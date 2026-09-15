import { validate } from 'class-validator';
import { IsIanaTimeZone } from './ianaTimeZone';

class TestDto {
  @IsIanaTimeZone()
  tz!: string;
}

describe('IsIanaTimeZone', () => {
  it.each(['Europe/Amsterdam', 'America/New_York', 'Asia/Tokyo'])('accepts known IANA time zone %s', async tz => {
    const dto = new TestDto();
    dto.tz = tz;
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('rejects an unknown/made-up time zone', async () => {
    const dto = new TestDto();
    dto.tz = 'Europe/Nowhereland';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rejects a non-string value', async () => {
    const dto = new TestDto();
    // @ts-expect-error deliberately invalid type
    dto.tz = 12345;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
