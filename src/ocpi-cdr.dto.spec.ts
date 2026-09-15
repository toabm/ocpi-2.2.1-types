// 🚫 Do not import this file directly. Use `types/index.ts` instead.
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CdrDimensionTypeEnum, CdrDto, ConnectorFormatEnum, ConnectorTypeEnum, PowerTypeEnum, TokenTypeEnum } from './index';

describe('CdrDto', () => {
  const validCdr = {
    country_code: 'NL',
    party_id: 'EXA',
    id: 'CDR1',
    start_date_time: new Date(Date.now() - 3600_000).toISOString(),
    end_date_time: new Date().toISOString(),
    cdr_token: {
      country_code: 'NL',
      party_id: 'TNM',
      uid: 'TOKEN1',
      type: TokenTypeEnum.RFID,
      contract_id: 'NL8ACC12E46L89'
    },
    auth_method: 'WHITELIST',
    cdr_location: {
      id: 'LOC1',
      address: 'Radiostraat 12',
      city: 'Amsterdam',
      country: 'NLD',
      evse_uid: 'EVSE1',
      evse_id: 'NL*EXA*E1',
      connector_id: 'C1',
      connector_standard: ConnectorTypeEnum.IEC_62196_T2,
      connector_format: ConnectorFormatEnum.SOCKET,
      connector_power_type: PowerTypeEnum.AC_3_PHASE
    },
    charging_periods: [
      {
        start_date_time: new Date(Date.now() - 3600_000).toISOString(),
        dimensions: [{ type: CdrDimensionTypeEnum.ENERGY, volume: 10 }]
      }
    ],
    total_cost: { excl_vat: 5, incl_vat: 6 },
    total_energy: 10,
    total_time: 1,
    last_updated: new Date().toISOString()
  };

  it('validates a well-formed CDR', async () => {
    const dto = plainToInstance(CdrDto, validCdr);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('fails when charging_periods is empty', async () => {
    const dto = plainToInstance(CdrDto, { ...validCdr, charging_periods: [] });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('fails when total_energy is missing', async () => {
    const { total_energy: _totalEnergy, ...withoutTotalEnergy } = validCdr;
    const dto = plainToInstance(CdrDto, withoutTotalEnergy);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
