import { validate } from 'class-validator';
import { CiString, IsCiString } from './ciString';

class TestDto {
  @IsCiString()
  value!: string;
}

describe('CiString', () => {
  it('accepts a normal printable string', () => {
    expect(CiString('ABC123')).toBe(true);
  });

  it('rejects an empty string', () => {
    expect(CiString('')).toBe(false);
  });

  it('rejects undefined', () => {
    expect(CiString(undefined as unknown as string)).toBe(false);
  });

  it('rejects a string containing a control character (charCode < 32)', () => {
    expect(CiString('AB\tC')).toBe(false); // tab = charCode 9
    expect(CiString('AB\nC')).toBe(false); // newline = charCode 10
  });
});

describe('IsCiString decorator', () => {
  it('passes validation for a valid CI string', async () => {
    const dto = new TestDto();
    dto.value = 'VALID123';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('fails validation when the string contains a control character', async () => {
    const dto = new TestDto();
    dto.value = 'BAD\x01VALUE';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('fails validation for an empty string', async () => {
    const dto = new TestDto();
    dto.value = '';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
