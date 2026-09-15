import { validate } from 'class-validator';
import { IsOcpiDateTime } from './IsOcpiDateTime';

class TestDto {
  @IsOcpiDateTime()
  ts!: string;
}

describe('IsOcpiDateTime', () => {
  it('accepts an RFC 3339 UTC timestamp with milliseconds', async () => {
    const dto = new TestDto();
    dto.ts = '2018-01-01T01:08:01.123Z';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('accepts a timestamp without milliseconds or trailing Z', async () => {
    const dto = new TestDto();
    dto.ts = '2018-01-01T01:08:01';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('rejects a non-ISO date format', async () => {
    const dto = new TestDto();
    dto.ts = '01/01/2018';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rejects a non-string value', async () => {
    const dto = new TestDto();
    // @ts-expect-error deliberately invalid type
    dto.ts = 1514768881123;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
