// 🚫 Do not import this file directly. Use `types/index.ts` instead.
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { TariffDimensionTypeEnum, TariffDto } from './index';

describe('TariffDto', () => {
  const validTariff = {
    country_code: 'NL',
    party_id: 'EXA',
    id: 'TARIFF1',
    currency: 'EUR',
    elements: [
      {
        price_components: [{ type: TariffDimensionTypeEnum.ENERGY, price: 0.3, step_size: 1 }]
      }
    ],
    last_updated: new Date().toISOString()
  };

  it('validates a well-formed Tariff', async () => {
    const dto = plainToInstance(TariffDto, validTariff);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('fails when currency is not a valid ISO 4217 code', async () => {
    const dto = plainToInstance(TariffDto, { ...validTariff, currency: 'NOTREAL' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('fails when a price component is missing its step_size', async () => {
    const dto = plainToInstance(TariffDto, {
      ...validTariff,
      elements: [{ price_components: [{ type: TariffDimensionTypeEnum.ENERGY, price: 0.3 }] }]
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
