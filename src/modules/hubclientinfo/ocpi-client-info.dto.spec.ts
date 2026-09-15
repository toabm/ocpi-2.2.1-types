// 🚫 Do not import this file directly. Use `types/index.ts` instead.
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ClientInfoDto, ConnectionStatusEnum, RoleEnum } from '../../index';

describe('ClientInfoDto', () => {
  const validClientInfo = {
    party_id: 'EXA',
    country_code: 'NL',
    role: RoleEnum.CPO,
    status: ConnectionStatusEnum.CONNECTED,
    last_updated: new Date().toISOString()
  };

  it('validates a well-formed ClientInfo object', async () => {
    const dto = plainToInstance(ClientInfoDto, validClientInfo);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('fails when status is not a valid ConnectionStatusEnum value', async () => {
    const dto = plainToInstance(ClientInfoDto, { ...validClientInfo, status: 'REBOOTING' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('fails when country_code is not a real ISO 3166-1 alpha-2 code', async () => {
    const dto = plainToInstance(ClientInfoDto, { ...validClientInfo, country_code: 'ZZ' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
