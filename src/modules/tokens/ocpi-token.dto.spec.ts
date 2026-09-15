// 🚫 Do not import this file directly. Use `types/index.ts` instead.
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { TokenDto, WhitelistTypeEnum } from '../../index';

describe('TokenDto', () => {
  const validToken = {
    country_code: 'NL',
    party_id: 'TNM',
    uid: 'TOKEN1',
    contract_id: 'NL8ACC12E46L89',
    issuer: 'TheNewMotion',
    valid: true,
    whitelist: WhitelistTypeEnum.ALWAYS,
    last_updated: new Date().toISOString()
  };

  it('validates a well-formed Token', async () => {
    const dto = plainToInstance(TokenDto, validToken);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('fails when country_code is not a real ISO 3166-1 alpha-2 code', async () => {
    const dto = plainToInstance(TokenDto, { ...validToken, country_code: 'ZZ' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('fails when whitelist is missing', async () => {
    const { whitelist: _whitelist, ...withoutWhitelist } = validToken;
    const dto = plainToInstance(TokenDto, withoutWhitelist);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
