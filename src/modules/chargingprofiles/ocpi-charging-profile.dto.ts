// 🚫 Do not import this file directly. Use `types/index.ts` instead.
import {
  IsArray,
  IsEnum,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUrl,
  MaxLength,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ChargingRateUnitEnum {
  W = 'W', // Watts (power). The TOTAL allowed charging power.
  A = 'A' // Amperes (current). The amount of Ampere per phase, not the sum of all phases.
}

export enum ChargingProfileResponseType {
  ACCEPTED = 'ACCEPTED', // ChargingProfile request accepted by the CPO, request will be forwarded to the EVSE.
  NOT_SUPPORTED = 'NOT_SUPPORTED', // ChargingProfiles not supported by this CPO, Charge Point, EVSE etc.
  REJECTED = 'REJECTED', // ChargingProfile request rejected by the CPO. (Session might not be from a customer of the eMSP that send this request)
  TOO_OFTEN = 'TOO_OFTEN', // ChargingProfile request rejected by the CPO, requests are send more often than allowed.
  UNKNOWN_SESSION = 'UNKNOWN_SESSION' // The Session in the requested command is not known by this CPO.
}

export enum ChargingProfileResultType {
  ACCEPTED = 'ACCEPTED', // ChargingProfile request accepted by the EVSE.
  REJECTED = 'REJECTED', // ChargingProfile request rejected by the EVSE.
  UNKNOWN = 'UNKNOWN' // No Charging Profile(s) were found by the EVSE matching the request.
}

/**
 * Charging profile period structure defines a time period in a charging profile, as used in ChargingProfileDto.
 */
export class ChargingProfilePeriodDto {
  /**
   * Start of the period, in seconds from the start of profile. The value of start_period also defines the stop
   * time of the previous period.
   */
  @IsNotEmpty()
  @IsInt()
  start_period: number;

  /**
   * Charging rate limit during the profile period, in the applicable ChargingRateUnit, for example in Amperes (A)
   * or Watts (W). Accepts at most one digit fraction (e.g. 8.1).
   */
  @IsNotEmpty()
  @IsNumber()
  limit: number;
}

/**
 * Charging profile class defines a list of charging periods, as used by both SetChargingProfile (Receiver
 * interface) and ActiveChargingProfile (the profile as calculated and reported back by the EVSE).
 */
export class ChargingProfileDto {
  /**
   * Starting point of an absolute profile. If absent the profile will be relative to start of charging.
   */
  @IsOptional()
  @IsISO8601({ strict: true })
  start_date_time?: string;

  /**
   * Duration of the charging profile in seconds. If the duration is left empty, the last period will continue
   * indefinitely or until end of the transaction in case start_date_time is absent.
   */
  @IsOptional()
  @IsInt()
  duration?: number;

  /**
   * The unit of measure for min_charging_rate and the limit of each ChargingProfilePeriod.
   */
  @IsNotEmpty()
  @IsEnum(ChargingRateUnitEnum)
  charging_rate_unit: ChargingRateUnitEnum;

  /**
   * Minimum charging rate supported by the EV, in the unit defined by charging_rate_unit. Intended to be used by a
   * local smart charging algorithm to optimize the power allocation in case a charging process is inefficient at
   * lower charging rates. Accepts at most one digit fraction (e.g. 8.1).
   */
  @IsOptional()
  @IsNumber()
  min_charging_rate?: number;

  /**
   * List of ChargingProfilePeriod elements defining maximum power or current usage over time.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChargingProfilePeriodDto)
  charging_profile_period?: ChargingProfilePeriodDto[];
}

/**
 * Sent by a Receiver (typically CPO) to a Sender (typically SCSP or eMSP), the latest known ActiveChargingProfile
 * as calculated by the Charge Point for a given session.
 */
export class ActiveChargingProfileDto {
  /**
   * Date and time at which the Charge Point has calculated this ActiveChargingProfile. All time measurements
   * within the profile are relative to this timestamp.
   */
  @IsNotEmpty()
  @IsISO8601({ strict: true })
  start_date_time: string;

  /**
   * Charging profile structure defines a list of charging periods.
   */
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ChargingProfileDto)
  charging_profile: ChargingProfileDto;
}

/**
 * Object set by a Sender (typically eMSP or SCSP) to request a Receiver (typically CPO) to set a Charging Profile
 * on a specific session. Sent as the request body of the Receiver interface's PUT method.
 */
export class SetChargingProfileDto {
  /**
   * Contains limits for the available power or current over time.
   */
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ChargingProfileDto)
  charging_profile: ChargingProfileDto;

  /**
   * URL that the ChargingProfileResult POST should be send to. This URL might contain a unique ID to be able to
   * distinguish between SetChargingProfile requests.
   */
  @IsNotEmpty()
  @IsUrl({}, { message: 'Invalid URL format' })
  @MaxLength(255)
  response_url: string;
}

/**
 * The ChargingProfileResponse object is send in the HTTP response body of the Receiver interface's GET, PUT, and
 * DELETE methods. Because OCPI does not allow/require retries, it is important for the Sender to know the timeout
 * on a certain command, in case the asynchronous result is never received.
 */
export class ChargingProfileResponseDto {
  /**
   * Response from the CPO on the ChargingProfile request.
   */
  @IsNotEmpty()
  @IsEnum(ChargingProfileResponseType)
  result: ChargingProfileResponseType;

  /**
   * Timeout for this ChargingProfile request in seconds. When the Result is not received within this timeout, the
   * Sender can assume that the message might never be send.
   */
  @IsNotEmpty()
  @IsInt()
  timeout: number;
}

/**
 * The ActiveChargingProfileResult object is send by the CPO to the given response_url in a POST request. It
 * contains the result of the GET (ActiveChargingProfile) request send by the Sender.
 */
export class ActiveChargingProfileResultDto {
  /**
   * The EVSE will indicate if it was able to process the request for the ActiveChargingProfile.
   */
  @IsNotEmpty()
  @IsEnum(ChargingProfileResultType)
  result: ChargingProfileResultType;

  /**
   * The requested ActiveChargingProfile, if the result field is set to: ACCEPTED.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => ActiveChargingProfileDto)
  profile?: ActiveChargingProfileDto;
}

/**
 * The ChargingProfileResult object is send by the CPO to the given response_url in a POST request. It contains the
 * result of the PUT (SetChargingProfile) request send by the Sender.
 */
export class ChargingProfileResultDto {
  /**
   * The EVSE will indicate if it was able to process the new/updated charging profile.
   */
  @IsNotEmpty()
  @IsEnum(ChargingProfileResultType)
  result: ChargingProfileResultType;
}

/**
 * The ClearProfileResult object is send by the CPO to the given response_url in a POST request. It contains the
 * result of the DELETE (ClearChargingProfile) request send by the Sender.
 */
export class ClearProfileResultDto {
  /**
   * The EVSE will indicate if it was able to process the removal of the charging profile.
   */
  @IsNotEmpty()
  @IsEnum(ChargingProfileResultType)
  result: ChargingProfileResultType;
}
