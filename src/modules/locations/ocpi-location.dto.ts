// 🚫 Do not import this file directly. Use `types/index.ts` instead.
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsCiString } from '../../custom_validators/ciString';
import { IsCountryCode } from '../../custom_validators/countryCode';

import { IsIanaTimeZone } from '../../custom_validators/ianaTimeZone';
import { AdditionalGeoLocationDto, DisplayTextDto, EvseDto, GeoLocationDto, ImageDto } from './ocpi-evse.dto';
import { TokenTypeEnum } from '../tokens/ocpi-token.dto';

/**
 * Reflects the general type of the charge point’s location. May be used for user information.
 */
export enum ParkingTypeEnum {
  ALONG_MOTORWAY = 'ALONG_MOTORWAY',
  PARKING_GARAGE = 'PARKING_GARAGE',
  PARKING_LOT = 'PARKING_LOT',
  ON_DRIVEWAY = 'ON_DRIVEWAY',
  ON_STREET = 'ON_STREET',
  UNDERGROUND_GARAGE = 'UNDERGROUND_GARAGE'
}

export enum FacilityEnum {
  HOTEL = 'HOTEL', // A hotel.
  RESTAURANT = 'RESTAURANT', // A restaurant.
  CAFE = 'CAFE', // A cafe.
  MALL = 'MALL', // A mall or shopping center.
  SUPERMARKET = 'SUPERMARKET', // A supermarket.
  SPORT = 'SPORT', // Sport facilities: gym, field etc.
  RECREATION_AREA = 'RECREATION_AREA', // A recreation area.
  NATURE = 'NATURE', // Located in, or close to, a park, nature reserve etc.
  MUSEUM = 'MUSEUM', // A museum.
  BIKE_SHARING = 'BIKE_SHARING', // A bike/e-bike/e-scooter sharing location.
  BUS_STOP = 'BUS_STOP', // A bus stop.
  TAXI_STAND = 'TAXI_STAND', // A taxi stand.
  TRAM_STOP = 'TRAM_STOP', // A tram stop/station.
  METRO_STATION = 'METRO_STATION', // A metro station.
  TRAIN_STATION = 'TRAIN_STATION', // A train station.
  AIRPORT = 'AIRPORT', // An airport.
  PARKING_LOT = 'PARKING_LOT', // A parking lot.
  CARPOOL_PARKING = 'CARPOOL_PARKING', // A carpool parking.
  FUEL_STATION = 'FUEL_STATION', // A Fuel station.
  WIFI = 'WIFI' // Wifi or other type of internet available.
}

/**
 * Categories of energy sources
 */
export enum EnergySourceCategoryEnum {
  NUCLEAR = 'NUCLEAR', // Nuclear power sources.
  GENERAL_FOSSIL = 'GENERAL_FOSSIL', // All kinds of fossil power sources.
  COAL = 'COAL', // Fossil power from coal.
  GAS = 'GAS', // Fossil power from gas.
  GENERAL_GREEN = 'GENERAL_GREEN', // All kinds of regenerative power sources.
  SOLAR = 'SOLAR', // Regenerative power from PV.
  WIND = 'WIND', // Regenerative power from wind turbines.
  WATER = 'WATER' // Regenerative power from water turbines.
}

/**
 * Categories of environmental impact values.
 */
export enum EmissionType {
  NUCLEAR_WASTE = 'NUCLEAR_WASTE', // Produced nuclear waste in grams per kilowatthour.
  CARBON_DIOXIDE = 'CARBON_DIOXIDE' // Exhausted carbon dioxide in grams per kilowatthour.
}

export class PublishTokenTypeDto {
  /**
   * Unique ID by which this Token can be identified
   */
  @IsOptional()
  @IsString()
  @IsCiString({ message: 'uid must be a valid CI string' }) // Applying the custom validator
  @MaxLength(36)
  uid?: string;

  /**
   * Type of the token.
   */
  @IsOptional()
  @IsEnum(TokenTypeEnum)
  type?: TokenTypeEnum;

  /**
   * Visual readable number/identification as printed on the Token (RFID card)
   */
  @IsOptional()
  @IsString()
  @MaxLength(64)
  visual_number?: string;

  /**
   * Issuing company, usually the name of the company printed on the token (RFID card), not necessarily the eMSP.
   */
  @IsOptional()
  @IsString()
  @MaxLength(64)
  issuer?: string;

  /**
   * This ID groups a couple of tokens. This can be used to make two or more tokens work as one.
   */
  @IsOptional()
  @IsString()
  @MaxLength(36)
  @IsCiString({ message: 'group_id must be a valid CI string' }) // Applying the custom validator
  group_id?: string;
}

export class BusinessDetailsDto {
  /**
   * Name of the operator
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  /**
   * Link to the operator’s website.
   */
  @ValidateIf(o => o.website !== undefined)
  @IsOptional()
  @IsUrl({}, { message: 'Invalid URL format' }) // Checks if the string is a valid URL
  @MaxLength(255, { message: 'URL should not exceed 255 characters' }) // Limits length to 255 characters
  website?: string;

  /**
   * Image link to the operator’s logo.
   */
  @ValidateIf(o => o.logo !== undefined)
  @IsOptional()
  @ValidateNested()
  @Type(() => ImageDto)
  logo?: ImageDto;
}

export class RegularHoursDto {
  /**
   * Number of day in the week, from Monday (1) till Sunday (7)
   */
  @IsNotEmpty()
  @IsInt()
  weekday: number;

  /**
   * Begin of the regular period, in local time, given in hours and minutes. Must be in 24h format with leading zeros.
   * Example: "18:15". Hour/Minute separator: ":"
   * Regex: ([0-1][0-9]|2[0-3]):[0-5][0-9].
   */
  @IsNotEmpty()
  @IsString()
  @Matches(/([0-1][0-9]|2[0-3]):[0-5][0-9]/, {
    message: 'Wrong format for period_begin'
  })
  period_begin: string;

  /**
   * End of the regular period, in local time, syntax as for period_begin. Must be later than period_begin
   */
  @IsNotEmpty()
  @IsString()
  @Matches(/([0-1][0-9]|2[0-3]):[0-5][0-9]/, {
    message: 'Wrong format for period_end'
  })
  period_end: string;
}

export class EnergySourceDto {
  /**
   * The type of energy source.
   */
  @IsNotEmpty()
  @IsEnum(EnergySourceCategoryEnum)
  source: EnergySourceCategoryEnum;

  /**
   * Percentage of this source (0-100) in the mix.
   */
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(100)
  number: number;
}

export class HoursDto {
  /**
   * True to represent 24 hours a day and 7 days a week, except the given exceptions.
   */
  @IsNotEmpty()
  @IsBoolean()
  twentyfourseven: boolean;

  /**
   * Regular hours, weekday-based. Only to be used if twentyfourseven=false, then this field needs to contain at least
   * one RegularHours object.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RegularHoursDto)
  regular_hours?: RegularHoursDto[];

  /**
   * Exceptions for specified calendar dates, time-range based. Periods the station is operating/accessible.
   * Additional to regular_hours. May overlap regular rules.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExceptionalPeriodDto)
  exceptional_openings?: ExceptionalPeriodDto[];

  /**
   * Exceptions for specified calendar dates, time-range based. Periods the station is not operating/accessible.
   * Overwriting regular_hours and exceptional_openings. Should not overlap exceptional_openings.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExceptionalPeriodDto)
  exceptional_closings?: ExceptionalPeriodDto[];
}

export class ExceptionalPeriodDto {
  /**
   * Begin of the exception. In UTC, time_zone field can be used to convert to local time.
   */
  @IsNotEmpty({ message: 'period_begin is required' }) // Ensures the field is not empty
  @IsISO8601({ strict: true }) // Ensures string is in correct UTC format
  period_begin: string;

  /**
   * End of the exception. In UTC, time_zone field can be used to convert to local time.
   */
  @IsNotEmpty({ message: 'period_end is required' }) // Ensures the field is not empty
  @IsISO8601({ strict: true }) // Ensures string is in correct UTC format
  period_end: string;
}

export class EnvironmentalImpactDto {
  /**
   * The environmental impact category of this value.
   */
  @IsNotEmpty()
  @IsEnum(EnergySourceCategoryEnum)
  category: EnergySourceCategoryEnum;

  /**
   * Amount of waste produced/emitted per kWh.
   */
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export class EnergyMixDto {
  /**
   * True if 100% from regenerative sources. (CO2 and nuclear waste is zero)
   */
  @IsNotEmpty()
  @IsBoolean()
  is_green_energy: boolean;

  /**
   * Key-value pairs (enum + percentage) of energy sources of this location’s tariff.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EnergySourceDto)
  energy_sources?: EnergySourceDto[];

  /**
   *
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EnvironmentalImpactDto)
  environ_impact?: EnvironmentalImpactDto[];

  /**
   * Name of the energy supplier, delivering the energy for this location or tariff.*
   */
  @IsOptional()
  @IsString()
  @MaxLength(64)
  supplier_name?: string;

  /**
   * Name of the energy suppliers product/tariff plan used at this location.*
   */
  @IsOptional()
  @IsString()
  @MaxLength(64)
  energy_product_name?: string;
}

export class LocationDto {
  /**
   * Uniquely identifies the location within the CPOs platform (and sub-operator platforms).
   * This field can never be changed, modified or renamed.
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(36)
  @IsCiString({ message: 'id must be a valid CI string' }) // Applying the custom validator
  id: string;

  /**
   * ISO-3166 alpha-2 country code of the CPO that 'owns' this Location.
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(2)
  @IsCiString({ message: 'Value must be a valid CI string' }) // Applying the custom validator
  @IsCountryCode({ message: 'country_code is not valid' })
  country_code: string;

  /**
   * ID of the CPO that 'owns' this Location (following the ISO-15118 standard)
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(3)
  @IsCiString({ message: 'party_id must be a valid CI string' }) // Applying the custom validator
  party_id: string;

  /**
   * Defines if a Location may be published on an website or app, etc.
   * When this is set to false, only tokens identified in the field: publish_allowed_to are allowed to be shown this Location.
   * When the same location has EVSEs that may be published and may not be published, two 'Locations' should be created.
   */
  @IsNotEmpty()
  @IsBoolean()
  publish: boolean;

  /**
   * This field may only be used when the publish field is set to false.
   * Only owners of Tokens that match all the set fields of one PublishToken in the list are allowed to be shown this location.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PublishTokenTypeDto)
  publish_allowed_to?: PublishTokenTypeDto[];

  /**
   * Display name of the location.
   */
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  /**
   * Street/block name and house number if available
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(45)
  address: string;

  /**
   * City or town.
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(45)
  city: string;

  /**
   * Postal code of the location, may only be omitted when the location has no postal code: in some countries charging
   * locations at highways don’t have postal codes.
   */
  @IsOptional()
  @IsString()
  @MaxLength(10)
  postal_code?: string;

  /**
   * State or province of the location, only to be used when relevant.
   */
  @IsOptional()
  @IsString()
  @MaxLength(20)
  state?: string;

  /**
   * ISO 3166-1 alpha-3 code for the country of this location.
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(3)
  country: string;

  /**
   * Coordinates of the location.
   */
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => GeoLocationDto)
  coordinates: GeoLocationDto;

  /**
   * Geographical location of related points relevant to the user.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdditionalGeoLocationDto)
  related_locations?: AdditionalGeoLocationDto[];

  /**
   * The general type of parking at the charge point location.
   */
  @IsOptional()
  @IsEnum(ParkingTypeEnum)
  parking_type?: ParkingTypeEnum;

  /**
   * List of EVSEs that belong to this Location.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EvseDto)
  evses?: EvseDto[];

  /**
   * Human-readable directions on how to reach the location.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DisplayTextDto)
  directions?: DisplayTextDto[];

  /**
   * Information of the operator. When not specified, the information retrieved from the Credentials module, selected by the
   * country_code and party_id of this Location, should be used instead.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => BusinessDetailsDto)
  operator?: BusinessDetailsDto;

  /**
   * Information of the sub-operator if available.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => BusinessDetailsDto)
  suboperator?: BusinessDetailsDto;

  /**
   * Information of the owner if available.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => BusinessDetailsDto)
  owner?: BusinessDetailsDto;

  /**
   * Optional list of facilities this charging location directly belongs to.
   */
  @IsString()
  @MaxLength(255)
  @IsIanaTimeZone({ message: 'Invalid IANA time zone' })
  time_zone: string;

  /**
   * Optional list of facilities this charging location directly belongs
   * to.
   */
  @IsOptional()
  @IsArray()
  @IsEnum(FacilityEnum, { each: true })
  facilities?: FacilityEnum[];

  /**
   * The times when the EVSEs at the location can be accessed for charging.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => HoursDto)
  opening_times?: HoursDto;

  /**
   * Indicates if the EVSEs are still charging outside the opening hours of the location. E.g. when the parking garage
   * closes its barriers over night, is it allowed to charge till the next morning?
   * Default: true
   */
  @IsOptional()
  @IsBoolean()
  charging_when_closed?: boolean;

  /**
   * Links to images related to the location such as photos or logos.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  images?: ImageDto[];

  /**
   * Details on the energy supplied at this location.
   */
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => EnergyMixDto)
  energy_mix?: EnergyMixDto;

  /**
   * Timestamp when this Location or one of its EVSEs or Connectors were last updated (or created).
   */
  @IsNotEmpty({ message: 'last_updated is required' })
  @IsISO8601({ strict: true }) // Ensures string is in correct UTC format
  last_updated: string;
}
