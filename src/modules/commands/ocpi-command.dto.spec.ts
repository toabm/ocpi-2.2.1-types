// 🚫 Do not import this file directly. Use `types/index.ts` instead.
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CommandResponseDto, CommandResponseType, StartSessionDto, TokenTypeEnum, WhitelistTypeEnum } from '../../index';

describe('StartSessionDto', () => {
  const validStartSession = {
    response_url: 'https://your-emsp.example.com/ocpi/emsp/2.2.1/commands/START_SESSION/result/req-123',
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
    evse_uid: 'EVSE1'
  };

  it('validates a well-formed START_SESSION command', async () => {
    const dto = plainToInstance(StartSessionDto, validStartSession);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('fails when response_url is not a valid URL', async () => {
    const dto = plainToInstance(StartSessionDto, { ...validStartSession, response_url: 'not-a-url' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('fails when the nested token is missing', async () => {
    const { token: _token, ...withoutToken } = validStartSession;
    const dto = plainToInstance(StartSessionDto, withoutToken);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('CommandResponseDto', () => {
  it('validates a well-formed CommandResponse', async () => {
    const dto = plainToInstance(CommandResponseDto, { result: CommandResponseType.ACCEPTED, timeout: 30 });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('fails when result is not a valid CommandResponseType', async () => {
    const dto = plainToInstance(CommandResponseDto, { result: 'MAYBE', timeout: 30 });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
