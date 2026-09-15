// 🚫 Do not import this file directly. Use `types/index.ts` instead.
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CredentialsDto, RoleEnum } from '../../index';

describe('CredentialsDto', () => {
  const validCredentials = {
    token: 'sometoken1234',
    url: 'https://example.com/ocpi/versions',
    roles: [
      {
        role: RoleEnum.CPO,
        business_details: { name: 'Example CPO' },
        party_id: 'EXA',
        country_code: 'NL'
      }
    ]
  };

  it('validates a well-formed Credentials handshake payload', async () => {
    const dto = plainToInstance(CredentialsDto, validCredentials);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('fails when roles is missing', async () => {
    const { roles: _roles, ...withoutRoles } = validCredentials;
    const dto = plainToInstance(CredentialsDto, withoutRoles);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('fails when a role is missing its business_details', async () => {
    const dto = plainToInstance(CredentialsDto, {
      ...validCredentials,
      roles: [{ role: RoleEnum.CPO, party_id: 'EXA', country_code: 'NL' }]
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
