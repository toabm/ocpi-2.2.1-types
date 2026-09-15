// 🚫 Do not import this file directly. Use `types/index.ts` instead.
import { CdrTokenDto, ChargingPeriodDto, PriceDto } from './index';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsCiString } from './custom_validators/ciString';
import { IsCountryCode } from './custom_validators/countryCode';

export enum AuthMethodEnum {
  AUTH_REQUEST = 'AUTH_REQUEST', // Authentication request has been sent to the eMSP.
  COMMAND = 'COMMAND', // Command like StartSession or ReserveNow used to start the Session, the Token provided in the Command was used as authorization.
  WHITELIST = 'WHITELIST' // Whitelist used for authentication; no request to the eMSP has been performed.
}

export enum ProfileTypeEnum {
  CHEAP = 'CHEAP', // Driver wants to use the least expensive charging profile possible.
  FAST = 'FAST', // Driver wants his EV charged as quickly as possible and is willing to pay a premium for this, if needed.
  GREEN = 'GREEN', // Driver wants his EV charged with as much regenerative (green) energy as possible.
  REGULAR = 'REGULAR' // Driver does not have special preferences.
}

export enum SessionStatusEnum {
  ACTIVE = 'ACTIVE', // The session is active and ongoing.
  COMPLETED = 'COMPLETED', // The session has been completed.
  INVALID = 'INVALID', // The session is invalid and will not be billed.
  PENDING = 'PENDING', // The session is pending and has not yet started.
  RESERVATION = 'RESERVATION' // The session is started due to a reservation, charging has not yet started. The session might never become an active session.
}

export enum ChargingPreferencesResponseEnum {
  ACCEPTED = 'ACCEPTED', // Charging Preferences accepted, EVSE will try to accomplish them, although this is no guarantee that they will be fulfilled.
  DEPARTURE_REQUIRED = 'DEPARTURE_REQUIRED', // CPO requires departure_time to be able to perform Charging Preference based Smart Charging.
  ENERGY_NEED_REQUIRED = 'ENERGY_NEED_REQUIRED', // CPO requires energy_need to be able to perform Charging Preference based Smart Charging.
  NOT_POSSIBLE = 'NOT_POSSIBLE', // Charging Preferences contain a demand that the EVSE knows it cannot fulfill.
  PROFILE_TYPE_NOT_SUPPORTED = 'PROFILE_TYPE_NOT_SUPPORTED' // profile_type contains a value that is not supported by the EVSE.
}

/**
 * A session represents a charging session at a charge point.
 */
export class SessionDto {
  /**
   * ISO-3166 alpha-2 country code of the CPO that 'owns' this Session.
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(2)
  @IsCiString({ message: 'Value must be a valid CI string' }) // Applying the custom validator
  @IsCountryCode({ message: 'country_code is not valid' })
  country_code: string;

  /**
   * ID of the CPO that 'owns' this Session (following the ISO-15118 standard)
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(3)
  @IsCiString({ message: 'party_id must be a valid CI string' }) // Applying the custom validator
  party_id: string;

  /**
   * The unique id of the Session.
   */
  @IsNotEmpty()
  @IsCiString()
  @MaxLength(36)
  id: string;

  /**
   * The timestamp when the session became active.
   */
  @IsNotEmpty()
  @IsISO8601({ strict: true })
  start_date_time: string;

  /**
   * The timestamp when the session was completed/finished, charging might have finished before the session ends.
   * For example: EV is full, but parking cost also has to be paid.
   */
  @IsOptional()
  @IsISO8601({ strict: true })
  end_date_time?: string;

  /**
   * How many kWh were charged.
   */
  @IsNotEmpty()
  @IsNumber()
  kwh: number;

  /**
   * Token used to start this charging session, including all the relevant
   * information to identify the unique token.
   */
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CdrTokenDto)
  cdr_token: CdrTokenDto;

  /**
   * Method used for authentication. This might change during a
   * session, for example when the session was started with a
   * reservation: ReserveNow: COMMAND. When the driver arrives and
   * starts charging using a Token that is whitelisted: WHITELIST.
   */
  @IsEnum(AuthMethodEnum)
  auth_method?: AuthMethodEnum;

  /**
   * Reference to the authorization given by the eMSP. When the eMSP
   * provided an authorization_reference in either: real-time
   * authorization, StartSession or ReserveNow this field SHALL
   * contain the same value. When different
   * authorization_reference values have been given by the
   * eMSP that are relevant to this Session, the last given value SHALL
   * be used here.
   */
  @IsOptional()
  @IsString()
  @IsCiString({ message: 'Value must be a valid CI string' }) // Applying the custom validator
  @MaxLength(36)
  authorization_reference?: string;

  /**
   * Location.id of the Location object of this CPO, on which the
   * charging session is/was happening.
   */
  @IsString()
  @IsCiString({ message: 'Value must be a valid CI string' }) // Applying the custom validator
  @MaxLength(36)
  location_id: string;

  /**
   * EVSE.uid of the EVSE of this Location on which the charging
   * session is/was happening. Allowed to be set to: #NA when this
   * session is created for a reservation, but no EVSE yet assigned to
   * the driver.
   */
  @IsString()
  @IsCiString({ message: 'Value must be a valid CI string' }) // Applying the custom validator
  @MaxLength(36)
  evse_uid: string;

  /**
   * Connector.id of the Connector of this Location where the charging
   * session is/was happening. Allowed to be set to: #NA when this
   * session is created for a reservation, but no connector yet assigned
   * to the driver.
   */
  @IsString()
  @IsCiString({ message: 'Value must be a valid CI string' }) // Applying the custom validator
  @MaxLength(36)
  connector_id: string;

  /**
   * Optional identification of the kWh meter.
   */
  @IsOptional()
  @IsString()
  @MaxLength(255)
  meter_id?: string;

  /**
   * ISO 4217 code of the currency used for this session.
   */
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  /**
   * List of charging periods that make up this charging session.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChargingPeriodDto)
  charging_periods?: ChargingPeriodDto[];

  /**
   * The total cost of the session in the specified currency. This is the
   * price that the eMSP will have to pay to the CPO. A total_cost of
   * 0.00 means free of charge. When omitted, i.e. no price information
   * is given in the Session object, it does not imply the session is/was
   * free of charge.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => PriceDto)
  total_cost?: PriceDto;

  /**
   * The status of the session.
   */
  @IsNotEmpty()
  @IsEnum(SessionStatusEnum)
  status: SessionStatusEnum;

  /**
   * The timestamp when the session was last updated.
   */
  @IsNotEmpty()
  @IsISO8601({ strict: true })
  last_updated: string;
}

export class ChargingPreferencesDto {
  /**
   * Type of Smart Charging Profile selected by the driver. The ProfileType has to be
   * supported at the Connector and for every supported ProfileType, a Tariff MUST
   * be provided. This gives the EV driver the option between different pricing
   * options.
   */
  @IsNotEmpty()
  @IsEnum(ProfileTypeEnum)
  profile_type: ProfileTypeEnum;

  /**
   * Expected departure. The driver has given this Date/Time as expected departure
   * moment. It is only an estimation and not necessarily the Date/Time of the actual
   * departure.
   */
  @IsOptional()
  @IsISO8601({ strict: true })
  departure_time?: string;

  /**
   * Requested amount of energy in kWh. The EV driver wants to have this amount
   * of energy charged.
   */
  @IsOptional()
  @IsNumber()
  energy_need?: number;

  /**
   * The driver allows their EV to be discharged when needed, as long as the other
   * preferences are met: EV is charged with the preferred energy (energy_need)
   * until the preferred departure moment (departure_time). Default if omitted:
   * false
   */
  @IsOptional()
  @IsBoolean()
  discharge_allowed: boolean = false;
}
