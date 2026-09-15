import { validate } from 'class-validator';
import { IsCountryCode } from './countryCode';

class TestDto {
  @IsCountryCode()
  code!: string;
}

describe('IsCountryCode', () => {
  it.each(['NL', 'DE', 'US', 'ES', 'FR'])('accepts valid ISO 3166-1 alpha-2 code %s', async code => {
    const dto = new TestDto();
    dto.code = code;
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('rejects an unknown/made-up country code', async () => {
    const dto = new TestDto();
    dto.code = 'ZZ';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rejects a lowercase code (list match is case-sensitive)', async () => {
    const dto = new TestDto();
    dto.code = 'nl';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
