// 🚫 Do not import this file directly. Use `types/index.ts` instead.
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ConnectorFormatEnum, ConnectorTypeEnum, LocationDto, PowerTypeEnum, StatusEnum } from './index';

describe('LocationDto', () => {
  const validLocation = {
    id: 'LOC1',
    country_code: 'NL',
    party_id: 'EXA',
    publish: true,
    address: 'Radiostraat 12',
    city: 'Amsterdam',
    country: 'NLD',
    coordinates: { latitude: '52.379189', longitude: '4.899431' },
    time_zone: 'Europe/Amsterdam',
    evses: [
      {
        uid: 'EVSE1',
        status: StatusEnum.AVAILABLE,
        connectors: [
          {
            id: 'C1',
            standard: ConnectorTypeEnum.IEC_62196_T2,
            format: ConnectorFormatEnum.SOCKET,
            power_type: PowerTypeEnum.AC_3_PHASE,
            max_voltage: 400,
            max_amperage: 32,
            last_updated: new Date().toISOString()
          }
        ],
        last_updated: new Date().toISOString()
      }
    ],
    last_updated: new Date().toISOString()
  };

  it('validates a well-formed Location with a nested EVSE and Connector', async () => {
    const dto = plainToInstance(LocationDto, validLocation);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('fails when a required top-level field (address) is missing', async () => {
    const { address: _address, ...withoutAddress } = validLocation;
    const dto = plainToInstance(LocationDto, withoutAddress);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('fails when time_zone is not a valid IANA time zone', async () => {
    const dto = plainToInstance(LocationDto, { ...validLocation, time_zone: 'Not/AZone' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('fails when a nested EVSE has no connectors', async () => {
    const dto = plainToInstance(LocationDto, {
      ...validLocation,
      evses: [{ uid: 'EVSE1', status: StatusEnum.AVAILABLE, connectors: [], last_updated: new Date().toISOString() }]
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
