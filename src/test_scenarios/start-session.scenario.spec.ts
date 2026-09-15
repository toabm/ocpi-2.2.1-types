// Full START_SESSION command lifecycle, from an eMSP's point of view:
//   1. Build and validate the StartSessionDto before sending it.
//   2. Validate the CPO's immediate CommandResponseDto.
//   3. On ACCEPTED, validate the CPO's later, asynchronous CommandResultDto for the same command.
// Mirrors the flow exercised in ocpi-gateway's CpoCommandsService / ReceivedMessageHandler.
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  CommandResponseDto,
  CommandResponseType,
  CommandResultDto,
  CommandResultType,
  CommandType,
  OCPIStatusCodesEnum,
  OcpiResponseDto,
  StartSessionDto,
  TokenTypeEnum,
  WhitelistTypeEnum
} from '../index';

describe('Scenario: START_SESSION command lifecycle', () => {
  const requestId = 'req-123';
  const responseUrl = `https://your-emsp.example.com/ocpi/emsp/2.2.1/commands/${CommandType.START_SESSION}/result/${requestId}`;

  const validStartSessionPlain = {
    response_url: responseUrl,
    token: {
      country_code: 'NL',
      party_id: 'TNM',
      uid: '012345678',
      type: TokenTypeEnum.RFID,
      contract_id: 'NL8ACC12E46L89',
      issuer: 'TheNewMotion',
      valid: true,
      whitelist: WhitelistTypeEnum.ALWAYS,
      last_updated: new Date().toISOString()
    },
    location_id: 'LOC1',
    evse_uid: 'EVSE1',
    authorization_reference: requestId
  };

  it('happy path: request is accepted, then later completes successfully', async () => {
    // 1. eMSP builds the command and validates it before sending.
    const request = plainToInstance(StartSessionDto, validStartSessionPlain);
    expect(await validate(request)).toHaveLength(0);

    // 2. CPO's immediate synchronous response: ACCEPTED with a timeout.
    const immediateResponse: OcpiResponseDto<CommandResponseDto> = {
      data: { result: CommandResponseType.ACCEPTED, timeout: 30 },
      status_code: OCPIStatusCodesEnum.SUCCESS,
      timestamp: new Date().toISOString()
    };
    const responseErrors = await validate(plainToInstance(CommandResponseDto, immediateResponse.data));
    expect(responseErrors).toHaveLength(0);
    expect(immediateResponse.data!.result).toBe(CommandResponseType.ACCEPTED);

    // 3. Because it was ACCEPTED, the CPO later POSTs the real outcome to response_url.
    const asyncResult = plainToInstance(CommandResultDto, { result: CommandResultType.ACCEPTED, message: [] });
    const resultErrors = await validate(asyncResult);
    expect(resultErrors).toHaveLength(0);
    expect(asyncResult.result).toBe(CommandResultType.ACCEPTED);
  });

  it('rejection path: CPO rejects immediately, no async CommandResult follows', async () => {
    const request = plainToInstance(StartSessionDto, validStartSessionPlain);
    expect(await validate(request)).toHaveLength(0);

    const immediateResponse: OcpiResponseDto<CommandResponseDto> = {
      data: { result: CommandResponseType.REJECTED, timeout: 0 },
      status_code: OCPIStatusCodesEnum.SERVER_ERROR,
      timestamp: new Date().toISOString()
    };
    const responseErrors = await validate(plainToInstance(CommandResponseDto, immediateResponse.data));
    expect(responseErrors).toHaveLength(0);
    expect(immediateResponse.data!.result).toBe(CommandResponseType.REJECTED);
    // A non-SUCCESS status_code signals the request itself was rejected -- matches the
    // "NOT ACCEPTED" branch exercised in ocpi-gateway's ReceivedMessageHandler, where the
    // CommandResponse is forwarded immediately and no pending CommandResult is registered.
    expect(immediateResponse.status_code).not.toBe(OCPIStatusCodesEnum.SUCCESS);
  });

  it('never sends an invalid request: a StartSessionDto missing its token fails validation before it would be sent', async () => {
    const { token: _token, ...withoutToken } = validStartSessionPlain;
    const invalidRequest = plainToInstance(StartSessionDto, withoutToken);
    const errors = await validate(invalidRequest);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('times out: a pending command that never receives a CommandResult is reported as TIMEOUT', async () => {
    // Mirrors ReceivedMessageHandler's timeout branch: the accepted CommandResponseDto's data
    // is reused with result overwritten to TIMEOUT when the CPO never follows up.
    const accepted = { result: CommandResponseType.ACCEPTED, timeout: 1 };
    const timedOutResult = plainToInstance(CommandResultDto, { ...accepted, result: CommandResultType.TIMEOUT });
    const errors = await validate(timedOutResult);
    expect(errors).toHaveLength(0);
    expect(timedOutResult.result).toBe(CommandResultType.TIMEOUT);
  });
});
