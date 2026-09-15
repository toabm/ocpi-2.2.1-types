// 🚫 Do not import this file directly. Use `types/index.ts` instead.
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  ActiveChargingProfileDto,
  ChargingProfileResponseType,
  ChargingProfileResultType,
  ChargingRateUnitEnum,
  SetChargingProfileDto
} from '../../index';

describe('SetChargingProfileDto', () => {
  const validSetChargingProfile = {
    response_url: 'https://sender.example.com/ocpi/scsp/2.2.1/chargingprofiles/response/req-123',
    charging_profile: {
      charging_rate_unit: ChargingRateUnitEnum.W,
      charging_profile_period: [
        { start_period: 0, limit: 11000 },
        { start_period: 1800, limit: 5500 }
      ]
    }
  };

  it('validates a well-formed SetChargingProfile request', async () => {
    const dto = plainToInstance(SetChargingProfileDto, validSetChargingProfile);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('fails when response_url is not a valid URL', async () => {
    const dto = plainToInstance(SetChargingProfileDto, { ...validSetChargingProfile, response_url: 'not-a-url' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('fails when the nested charging_profile is missing its charging_rate_unit', async () => {
    const { charging_rate_unit: _unit, ...profileWithoutUnit } = validSetChargingProfile.charging_profile;
    const dto = plainToInstance(SetChargingProfileDto, {
      ...validSetChargingProfile,
      charging_profile: profileWithoutUnit
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('ActiveChargingProfileDto', () => {
  it('validates a well-formed ActiveChargingProfile', async () => {
    const dto = plainToInstance(ActiveChargingProfileDto, {
      start_date_time: new Date().toISOString(),
      charging_profile: {
        charging_rate_unit: ChargingRateUnitEnum.A,
        charging_profile_period: [{ start_period: 0, limit: 32 }]
      }
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('fails when start_date_time is missing', async () => {
    const dto = plainToInstance(ActiveChargingProfileDto, {
      charging_profile: { charging_rate_unit: ChargingRateUnitEnum.A }
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('ChargingProfileResponseType / ChargingProfileResultType', () => {
  it('exposes the expected enum values from the spec', () => {
    expect(ChargingProfileResponseType.ACCEPTED).toBe('ACCEPTED');
    expect(ChargingProfileResponseType.TOO_OFTEN).toBe('TOO_OFTEN');
    expect(ChargingProfileResultType.UNKNOWN).toBe('UNKNOWN');
  });
});
