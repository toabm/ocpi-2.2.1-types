// 🚫 Do not import this file directly. Use `types/index.ts` instead.
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsISO31661Alpha2,
  IsISO31661Alpha3,
  IsISO4217CurrencyCode,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested
} from 'class-validator';
import { IsCiString } from './custom_validators/ciString';
import { Type } from 'class-transformer';
import { ConnectorFormatEnum, ConnectorTypeEnum, PowerTypeEnum } from './ocpi-connector.dto';
import { TokenTypeEnum } from './ocpi-token.dto';
import { GeoLocationDto } from './ocpi-evse.dto';
import { AuthMethodEnum } from './ocpi-session.dto';
import { PriceDto, TariffDto } from './ocpi-tariff.dto';


/**
 * This enumeration contains allowed values for CdrDimensions, which are used to define dimensions of
 * ChargingPeriods in both CDRs and Sessions. Some of these values are not useful for CDRs, and SHALL therefor only be
 * used in Sessions, these are marked in the column: Session Only.
 */
export enum CdrDimensionTypeEnum {
  CURRENT = 'CURRENT', // Average charging current during this ChargingPeriod: defined in A (Ampere). When negative, the current is flowing from the EV to the grid.
  ENERGY = 'ENERGY', // Total amount of energy (dis-)charged during this ChargingPeriod: defined in kWh. When negative, more energy was feed into the grid then charged into the EV. Default step_size is 1.
  ENERGY_EXPORT = 'ENERGY_EXPORT', // Total amount of energy feed back into the grid: defined in kWh.
  ENERGY_IMPORT = 'ENERGY_IMPORT', // Total amount of energy charged, defined in kWh.
  MAX_CURRENT = 'MAX_CURRENT', // Sum of the maximum current over all phases, reached during this ChargingPeriod: defined in A (Ampere).
  MIN_CURRENT = 'MIN_CURRENT', // Sum of the minimum current over all phases, reached during this ChargingPeriod, when negative, current has flowed from the EV to the grid. Defined in A (Ampere).
  MAX_POWER = 'MAX_POWER', // Maximum power reached during this ChargingPeriod: defined in kW (Kilowatt).
  MIN_POWER = 'MIN_POWER', // Minimum power reached during this ChargingPeriod: defined in kW (Kilowatt), when negative, the power has flowed from the EV to the grid.
  PARKING_TIME = 'PARKING_TIME', // Time during this ChargingPeriod not charging: defined in hours, default step_size multiplier is 1 second.
  POWER = 'POWER', // Average power during this ChargingPeriod: defined in kW (Kilowatt). When negative, the power is flowing from the EV to the grid.
  RESERVATION_TIME = 'RESERVATION_TIME', // Time during this ChargingPeriod Charge Point has been reserved and not yet been in use for this customer: defined in hours, default step_size multiplier is 1 second.
  STATE_OF_CHARGE = 'STATE_OF_CHARGE', // Current state of charge of the EV, in percentage, values allowed: 0 to 100.
  TIME = 'TIME' // Time charging during this ChargingPeriod: defined in hours, default step_size multiplier is 1 second.
}

export class CdrDimensionDto {
  /**
   * Type of CDR dimension.
   */
  @IsNotEmpty()
  @IsEnum(CdrDimensionTypeEnum)
  type: CdrDimensionTypeEnum;

  /**
   * Volume of the dimension consumed, measured according to the
   * dimension type.
   */
  @IsNotEmpty()
  @IsNumber()
  volume: number;
}

/**
 * The CdrLocation class contains only the relevant information from the Location object that is needed in a CDR.
 */
export class CdrLocationDto {
  /**
   * Uniquely identifies the location within the CPO’s platform (and
   * suboperator platforms). This field can never be changed, modified or
   * renamed.
   */
  @IsNotEmpty()
  @IsString()
  @IsCiString({ message: 'Value must be a valid CI string' }) // Applying the custom validator
  @MaxLength(36)
  id: string;

  /**
   * Display name of the location.
   */
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  /**
   * Street/block name and house number if available.
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
   * Postal code of the location, may only be omitted when the location has
   * no postal code: in some countries charging locations at highways don’t
   * have postal codes.
   */
  @IsOptional()
  @IsString()
  @MaxLength(10)
  postal_code?: string;

  /**
   * State only to be used when relevant.
   */
  @IsOptional()
  @IsString()
  @MaxLength(20)
  state?: string;

  /**
   * ISO-3166 alpha-3 country code of the location.
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(3)
  @IsISO31661Alpha3({ message: 'Must be a valid ISO 3166-1 alpha-3 country code' })
  country: string;

  /**
   * Coordinates of the location.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => GeoLocationDto)
  coordinates?: GeoLocationDto;

  /**
   * Uniquely identifies the EVSE within the CPO’s platform (and suboperator platforms).
   * For example a database unique ID or the actual EVSE ID.
   * This field can never be changed, modified or renamed.
   * This is the technical identification of the EVSE, not to be used as human readable identification,
   * use the field: evse_id for that.
   * Allowed to be set to: #NA when this CDR is created for a reservation that never resulted in a charging session.
   */
  @IsNotEmpty()
  @IsString()
  @IsCiString({ message: 'Value must be a valid CI string' }) // Applying the custom validator
  @MaxLength(36)
  evse_uid: string;

  /**
   * Compliant with the following specification for EVSE ID from "eMI3 standard version V1.0"
   * (http://emi3group.com/documents-links/) "Part 2: business objects.".
   * Allowed to be set to: #NA when this CDR is created for a reservation that never resulted in a charging session.
   */
  @IsNotEmpty()
  @IsString()
  @IsCiString({ message: 'Value must be a valid CI string' }) // Applying the custom validator
  @MaxLength(48)
  evse_id: string;

  /**
   * Identifier of the connector within the EVSE.
   * Allowed to be set to: #NA when this CDR is created for a reservation that never resulted in a charging session.
   */
  @IsNotEmpty()
  @IsString()
  @IsCiString({ message: 'Value must be a valid CI string' }) // Applying the custom validator
  @MaxLength(36)
  connector_id: string;

  /**
   * The standard of the installed connector.
   * When this CDR is created for a reservation that never resulted in a charging session,
   * this field can be set to any value and should be ignored by the Receiver.
   */
  @IsNotEmpty()
  @IsEnum(ConnectorTypeEnum)
  connector_standard: ConnectorTypeEnum;

  /**
   * The format (socket/cable) of the installed connector.
   * When this CDR is created for a reservation that never resulted in a charging session,
   * this field can be set to any value and should be ignored by the Receiver.
   */
  @IsNotEmpty()
  @IsEnum(ConnectorFormatEnum)
  connector_format: ConnectorFormatEnum;

  /**
   * The power type of the installed connector.
   * When this CDR is created for a reservation that never resulted in a charging session,
   * this field can be set to any value and should be ignored by the Receiver.
   */
  @IsNotEmpty()
  @IsEnum(PowerTypeEnum)
  connector_power_type: PowerTypeEnum;
}

export class CdrTokenDto {
  /**
   * ISO-3166 alpha-2 country code of the MSP that 'owns' this Token.
   */
  @IsNotEmpty()
  @IsString()
  @IsCiString({ message: 'Value must be a valid CI string' })
  @MaxLength(2)
  @IsISO31661Alpha2({ message: 'Must be a valid ISO 3166-1 alpha-2 country code' })
  country_code: string;

  /**
   * ID of the eMSP that 'owns' this Token (following the ISO-15118 standard)
   */
  @IsNotEmpty()
  @IsString()
  @IsCiString({ message: 'Value must be a valid CI string' })
  @MaxLength(3)
  party_id: string;

  /**
   * Unique ID by which this Token can be identified.
   * This is the field used by the CPO's system (RFID reader on the Charge Point) to identify this token.
   * Currently, in most cases: type=RFID, this is the RFID hidden ID as read by the RFID reader, but that is
   * not a requirement.
   * If this is a type=APP_USER Token, it will be a unique, by the eMSP, generated ID.
   */
  @IsNotEmpty()
  @IsString()
  @IsCiString({ message: 'uid must be a valid CI string' }) // Applying the custom validator
  @MaxLength(36)
  uid: string;

  /**
   * Type of the token
   */
  @IsNotEmpty()
  @IsEnum(TokenTypeEnum)
  type: TokenTypeEnum;

  /**
   * Uniquely identifies the EV driver contract token within the eMSP's platform (and suboperator platforms).
   * Recommended to follow the specification for eMA ID from "eMI3 standard version V1.0" (http://emi3group.com/documents-links/)
   * "Part 2: business objects."
   */
  @IsNotEmpty()
  @IsString()
  @IsCiString({ message: 'Value must be a valid CI string' })
  @MaxLength(36)
  contract_id: string;
}

/**
 * A Charging Period consists of a start timestamp and a list of possible values that influence this period, for example:
 * amount of energy charged this period, maximum current during this period etc.
 */
export class ChargingPeriodDto {
  /**
   * Start timestamp of the charging period. A period ends when the next
   * period starts. The last period ends when the session ends.
   */
  @IsNotEmpty()
  @IsISO8601({ strict: true })
  start_date_time: string;

  /**
   * List of relevant values for this charging period.
   */
  @IsArray()
  @ArrayMinSize(1, { message: 'dimensions should not be empty' })
  dimensions: CdrDimensionDto[];

  /**
   * Unique identifier of the Tariff that is relevant for this Charging Period.
   * If not provided, no Tariff is relevant during this period.
   */
  @IsOptional()
  @IsString()
  @IsCiString({ message: 'Value must be a valid CI string' })
  @MaxLength(36)
  tariff_id?: string;
}

/**
 * This class contains all the information of the signed data. Which encoding method is used, if needed, the public key
 * and a list of signed values.
 */
export class SignedDataDto {
  /**
   * The name of the encoding used in the SignedData field. This is
   * the name given to the encoding by a company or group of
   * companies. See note below.
   */
  @IsNotEmpty()
  @IsString()
  @IsCiString({ message: 'Value must be a valid CI string' })
  @MaxLength(36)
  encoding_method: string;

  /**
   * Version of the EncodingMethod (when applicable)
   */
  @IsOptional()
  @IsNumber()
  encoding_method_version: number;

  /**
   * Public key used to sign the data, base64 encoded.
   */
  @IsOptional()
  @IsString()
  @MaxLength(512)
  public_key: string;

  /**
   * Public key used to sign the data, base64 encoded.
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SignedValueDto)
  signed_values: SignedValueDto[];

  /**
   * URL that can be used to validate the signed data.
   */
  @IsOptional()
  @IsString()
  url?: string;
}

export class SignedValueDto {
  /**
   * Nature of the value, in other words, the event this value belongs to.
   * Possible values at moment of writing:
   * - Start (value at the start of the Session)
   * - End (signed value at the end of the Session)
   * - Intermediate (signed values taken during the Session, after Start, before End)
   * Others might be added later.
   */
  @IsNotEmpty()
  @IsString()
  @IsCiString({ message: 'Value must be a valid CI string' })
  @MaxLength(32)
  nature: string;

  /**
   * The un-encoded string of data. The format of the content depends on
   * the EncodingMethod field.
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(512)
  plain_data: string;

  /**
   * Blob of signed data, base64 encoded. The format of the content
   * depends on the EncodingMethod field.
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(5000)
  signed_data: string;
}

/**
 * The CDR object represents the charging session and its costs.
 */
export class CdrDto {
  /**
   * ISO-3166 alpha-2 country code of the CPO that 'owns' this CDR.
   */
  @IsNotEmpty()
  @IsString()
  @IsCiString({ message: 'Value must be a valid CI string' })
  @IsISO31661Alpha2({ message: 'Must be a valid ISO 3166-1 alpha-2 country code' })
  @MaxLength(2)
  country_code: string;

  /**
   * ID of the CPO that 'owns' this CDR (following the ISO-15118
   * standard).
   */
  @IsNotEmpty()
  @IsString()
  @IsCiString({ message: 'Value must be a valid CI string' })
  @MaxLength(3)
  party_id: string;

  /**
   * Uniquely identifies the CDR, the ID SHALL be unique per country_code/party_id combination. This field is longer
   * than the usual 36 characters to allow for credit CDRs to have something appended to the original ID. Normal
   * (non-credit) CDRs SHALL only have an ID with a maximum length of 36 */
  @IsNotEmpty()
  @IsString()
  @IsCiString({ message: 'Value must be a valid CI string' })
  @MaxLength(36)
  id: string;

  /**
   * Start timestamp of the charging session, or in-case of a reservation (before the start of a session) the start of
   * the reservation.
   */
  @IsNotEmpty()
  @IsISO8601({ strict: true })
  start_date_time: string;

  /**
   * The timestamp when the session was completed/finished, charging might have finished before the session ends, for
   * example: EV is full, but parking cost also has to be paid.
   */
  @IsNotEmpty()
  @IsISO8601({ strict: true })
  end_date_time: string;

  /**
   * Unique ID of the Session for which this CDR is sent. Is only allowed to be omitted when the CPO has not implemented
   * the Sessions module or this CDR is the result of a reservation that never became a charging session, thus no OCPI
   * Session.
   */
  @IsOptional()
  @IsString()
  @MaxLength(36)
  @IsCiString({ message: 'Value must be a valid CI string' })
  session_id?: string;

  /**
   * Token used to start this charging session, including all the relevant information to identify the unique token.
   */
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CdrTokenDto)
  cdr_token: CdrTokenDto;

  /**
   * Method used for authentication. Multiple <mod_cdrs_authmethod_enum,AuthMethods>> are possible during a charging
   * sessions, for example when the session was started with a reservation: ReserveNow: COMMAND. When the driver arrives
   * and starts charging using a Token that is whitelisted: WHITELIST. The last method SHALL be used in the CDR.
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(36)
  auth_method: AuthMethodEnum;

  /**
   * Method used for authentication.
   */
  @IsOptional()
  @IsString()
  @IsCiString({ message: 'Value must be a valid CI string' })
  @MaxLength(36)
  authorization_reference?: string;

  /**
   * Location where the charging session took place, including only the relevant EVSE and Connector.
   */
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CdrLocationDto)
  cdr_location: CdrLocationDto;

  /**
   * Identification of the Meter inside the Charge Point.
   */
  @IsOptional()
  @IsString()
  @MaxLength(255)
  meter_id?: string;

  /**
   * Currency of the CDR in ISO 4217 Code.
   */
  @IsOptional()
  @IsString()
  @MaxLength(3)
  @IsISO4217CurrencyCode({ message: 'Must be a valid ISO 4217 currency code' })
  currency?: string;

  /**
   * List of relevant Tariffs, see: Tariff. When relevant, a Free of
   * Charge tariff should also be in this list, and point to a
   * defined Free of Charge Tariff.
   */
  @IsOptional()
  @IsArray()
  tariffs?: TariffDto[];

  /**
   * List of Charging Periods that make up this charging session.
   */
  @IsArray()
  @ArrayMinSize(1, { message: 'charging_periods should not be empty' })
  @ValidateNested({ each: true })
  @Type(() => ChargingPeriodDto)
  charging_periods: ChargingPeriodDto[];

  /**
   * Signed data that belongs to this charging Session.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => SignedDataDto)
  signed_data?: SignedDataDto;

  /**
   * Total sum of all the costs of this transaction in the specified
   * currency.
   */
  @IsNotEmpty()
  @Type(() => PriceDto)
  total_cost: PriceDto;

  /**
   * Total sum of all the fixed costs in the specified currency,
   * except fixed price components of parking and reservation.
   * Can contain costs like a start tariff.
   * The cost not depending on amount of time/energy used etc.
   */
  @IsOptional()
  @Type(() => PriceDto)
  total_fixed_cost?: PriceDto;

  /**
   * Total energy charged, in kWh.
   */
  @IsNotEmpty()
  @IsNumber()
  total_energy: number;

  /**
   * Total sum of all the cost of all the energy used, in the
   * specified currency.
   */
  @IsOptional()
  @Type(() => PriceDto)
  total_energy_cost?: PriceDto;

  /**
   * Total duration of the charging session (including the
   * duration of charging and not charging), in hours.
   */
  @IsNotEmpty()
  @IsNumber()
  total_time: number;

  /**
   * Total sum of all the cost related to duration of charging
   * during this transaction, in the specified currency.
   */
  @IsOptional()
  @Type(() => PriceDto)
  total_time_cost?: PriceDto;

  /**
   * Total duration of the charging session where the EV was not
   * charging (no energy was transferred between EVSE and
   * EV), in hours.
   */
  @IsOptional()
  @IsNumber()
  total_parking_time?: number;

  /**
   * Total sum of all the cost related to parking of this transaction, including fixed price components, in the
   * specified currency.
   */
  @IsOptional()
  @Type(() => PriceDto)
  total_parking_cost?: PriceDto;

  /**
   * Total sum of all the cost related to a reservation of a Charge Point, including fixed price components, in the
   * specified currency.
   */
  @IsOptional()
  @Type(() => PriceDto)
  total_reservation_cost?: PriceDto;

  /**
   * Optional remark, can be used to provide additional human readable information to the CDR,
   * for example: reason why a transaction was stopped.
   */
  @IsOptional()
  @IsString()
  @MaxLength(255)
  remark?: string;

  /**
   * This field can be used to reference an invoice, that will later be sent for this CDR.
   * Making it easier to link a CDR to a given invoice. Maybe even group CDRs that will be on the same invoice.
   */
  @IsOptional()
  @IsString()
  @IsCiString({ message: 'Value must be a valid CI string' })
  @MaxLength(39)
  invoice_reference_id?: string;

  /**
   * When set to true, this is a Credit CDR, and the field credit_reference_id needs to be set as well.
   */
  @IsOptional()
  @IsBoolean()
  credit?: boolean;

  /**
   * Is required to be set for a Credit CDR. This SHALL contain the id of the CDR for which this is a Credit CDR.
   */
  @IsOptional()
  @IsString()
  @IsCiString({ message: 'Value must be a valid CI string' })
  @MaxLength(39)
  credit_reference_id?: string;

  /**
   * When set to true, this CDR is for a charging session using the home charger of the EV Driver
   * for which the energy cost needs to be financial compensated to the EV Driver.
   */
  @IsOptional()
  @IsBoolean()
  home_charging_compensation?: boolean;

  /**
   * Timestamp when this CDR was last updated (or created).
   */
  @IsNotEmpty()
  @IsISO8601({ strict: true })
  last_updated: string;
}
