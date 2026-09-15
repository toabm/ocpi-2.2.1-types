// 🚫 Do not import this file directly. Use `types/index.ts` instead.
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AuthMethodEnum, SessionDto, SessionStatusEnum, TokenTypeEnum } from './index';

describe('SessionDto', () => {
  const validSession = {
    country_code: 'NL',
    party_id: 'EXA',
    id: 'SESSION1',
    start_date_time: new Date().toISOString(),
    kwh: 10.5,
    cdr_token: {
      country_code: 'NL',
      party_id: 'TNM',
      uid: 'TOKEN1',
      type: TokenTypeEnum.RFID,
      contract_id: 'NL8ACC12E46L89'
    },
    auth_method: AuthMethodEnum.WHITELIST,
    location_id: 'LOC1',
    evse_uid: 'EVSE1',
    connector_id: 'C1',
    status: SessionStatusEnum.ACTIVE,
    last_updated: new Date().toISOString()
  };

  it('validates a well-formed active Session', async () => {
    const dto = plainToInstance(SessionDto, validSession);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('fails when status is not a valid SessionStatusEnum value', async () => {
    const dto = plainToInstance(SessionDto, { ...validSession, status: 'NOT_A_STATUS' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('fails when the nested cdr_token is missing its uid', async () => {
    const { uid: _uid, ...cdrTokenWithoutUid } = validSession.cdr_token;
    const dto = plainToInstance(SessionDto, { ...validSession, cdr_token: cdrTokenWithoutUid });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
