// 🚫 Do not import this file directly. Use `types/index.ts` instead.
import {
  IsArray,
  IsEnum,
  IsInt,
  IsISO31661Alpha2,
  IsISO4217CurrencyCode,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  Min,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { EnergyMixDto, DisplayTextDto } from './index';
import { IsCiString } from './custom_validators/ciString';

export class PriceDto {
  /**
   * Price/Cost excluding VAT.
   */
  @IsNumber()
  excl_vat: number;

  /**
   * Price/Cost including VAT.
   */
  @IsOptional()
  @IsNumber()
  incl_vat?: number;
}

export enum TariffTypeEnum {
  AD_HOC_PAYMENT = 'AD_HOC_PAYMENT',
  PROFILE_CHEAP = 'PROFILE_CHEAP',
  PROFILE_FAST = 'PROFILE_FAST',
  PROFILE_GREEN = 'PROFILE_GREEN',
  REGULAR = 'REGULAR'
}

export enum DayOfWeekEnum {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY'
}

export enum TariffDimensionTypeEnum {
  ENERGY = 'ENERGY', // Defined in kWh, step_size multiplier: 1 Wh
  FLAT = 'FLAT', // Flat fee without unit for step_size
  PARKING_TIME = 'PARKING_TIME', // Time not charging: defined in hours, step_size multiplier: 1 second
  TIME = 'TIME' // Time charging: defined in hours, step_size multiplier: 1 second
}

export class PriceComponentDto {
  /**
   * The dimension that is being priced.
   */
  @IsNotEmpty()
  @IsEnum(TariffDimensionTypeEnum)
  type: TariffDimensionTypeEnum;

  /**
   * Price per unit (excluding VAT) for this dimension.
   */
  @IsNotEmpty()
  @IsNumber()
  price: number;

  /**
   * Applicable VAT percentage. If omitted, no VAT is applicable.
   */
  @IsOptional()
  @IsNumber()
  vat?: number;

  /**
   * Minimum amount to be billed. The consumed amount is rounded up
   * to the smallest multiple of step_size that is greater than the consumed amount.
   */
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  step_size: number;
}

export enum ReservationRestrictionTypeEnum {
  RESERVATION = 'RESERVATION', // Used in Tariff Elements to describe costs for a reservation.
  RESERVATION_EXPIRES = 'RESERVATION_EXPIRES' // Used in Tariff Elements to describe costs for a reservation that expires
}

export class TariffRestrictionsDto {
  /**
   * Start time of day in local time (HH:mm), e.g. "13:30"
   */
  @IsOptional()
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'start_time must be in HH:mm 24h format'
  })
  start_time?: string;

  /**
   * End time of day in local time (HH:mm), e.g. "19:45"
   */
  @IsOptional()
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'end_time must be in HH:mm 24h format'
  })
  end_time?: string;

  /**
   * Start date in local time (YYYY-MM-DD), inclusive.
   */
  @IsOptional()
  @IsString()
  @Matches(/^([12][0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, {
    message: 'start_date must be in YYYY-MM-DD format'
  })
  start_date?: string;

  /**
   * End date in local time (YYYY-MM-DD), exclusive.
   */
  @IsOptional()
  @IsString()
  @Matches(/^([12][0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, {
    message: 'end_date must be in YYYY-MM-DD format'
  })
  end_date?: string;

  @IsOptional()
  @IsNumber()
  min_kwh?: number;

  @IsOptional()
  @IsNumber()
  max_kwh?: number;

  @IsOptional()
  @IsNumber()
  min_current?: number;

  @IsOptional()
  @IsNumber()
  max_current?: number;

  @IsOptional()
  @IsNumber()
  min_power?: number;

  @IsOptional()
  @IsNumber()
  max_power?: number;

  @IsOptional()
  @IsInt()
  min_duration?: number;

  @IsOptional()
  @IsInt()
  max_duration?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(DayOfWeekEnum, { each: true })
  day_of_week?: DayOfWeekEnum[];

  @IsOptional()
  @IsEnum(ReservationRestrictionTypeEnum)
  reservation?: ReservationRestrictionTypeEnum;
}
export class TariffElementDto {
  /**
   * List of Price Components that each describe how a certain dimension is priced.
   */
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PriceComponentDto)
  price_components: PriceComponentDto[];

  /**
   * Optional restrictions that describe under which circumstances the Price Components apply.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => TariffRestrictionsDto)
  restrictions?: TariffRestrictionsDto;
}

export class TariffDto {
  /**
   * ISO-3166 alpha-2 country code of the CPO that owns this Tariff.
   */
  @IsNotEmpty()
  @IsString()
  @IsCiString()
  @IsISO31661Alpha2()
  @MaxLength(2)
  country_code: string;

  /**
   * ID of the CPO that 'owns' this Tariff.
   */
  @IsNotEmpty()
  @IsString()
  @IsCiString()
  @MaxLength(3)
  party_id: string;

  /**
   * Unique identifier for the tariff.
   */
  @IsNotEmpty()
  @IsString()
  @IsCiString()
  @MaxLength(36)
  id: string;

  /**
   * ISO-4217 code of the currency of this tariff.
   */
  @IsNotEmpty()
  @IsString()
  @IsISO4217CurrencyCode()
  @MaxLength(3)
  currency: string;

  /**
   * Type of the tariff. Optional.
   */
  @IsOptional()
  @IsEnum(TariffTypeEnum)
  type?: TariffTypeEnum;

  /**
   * Multi-language alternative tariff info texts.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DisplayTextDto)
  tariff_alt_text?: DisplayTextDto[];

  /**
   * URL to a web page that contains human-readable explanation of the tariff.
   */
  @IsOptional()
  @IsUrl()
  tariff_alt_url?: string;

  /**
   * Minimum cost of the Charging Session.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => PriceDto)
  min_price?: PriceDto;

  /**
   * Maximum cost of the Charging Session.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => PriceDto)
  max_price?: PriceDto;

  /**
   * List of tariff elements with pricing details and restrictions.
   */
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TariffElementDto)
  elements: TariffElementDto[];

  /**
   * UTC timestamp when this tariff becomes active.
   */
  @IsOptional()
  @IsString()
  start_date_time?: string;

  /**
   * UTC timestamp when this tariff becomes inactive.
   */
  @IsOptional()
  @IsString()
  end_date_time?: string;

  /**
   * Optional info on the energy supplied with this tariff.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => EnergyMixDto)
  energy_mix?: EnergyMixDto;

  /**
   * UTC timestamp when this tariff was last updated or created.
   */
  @IsNotEmpty()
  @IsString()
  last_updated: string;
}
