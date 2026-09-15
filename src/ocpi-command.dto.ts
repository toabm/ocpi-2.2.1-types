// 🚫 Do not import this file directly. Use `types/index.ts` instead.
import { DisplayTextDto, TokenDto } from './';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  MaxLength,
  ValidateNested
} from 'class-validator';
import { IsCiString } from './custom_validators/ciString';
import { Type } from 'class-transformer';

export enum CommandType {
  CANCEL_RESERVATION = 'CANCEL_RESERVATION', // Request the Charge Point to cancel a specific reservation.
  RESERVE_NOW = 'RESERVE_NOW', // Request the Charge Point to reserve a (specific) EVSE for a Token for a certain time, starting now.
  START_SESSION = 'START_SESSION', // Request the Charge Point to start a transaction on the given EVSE/Connector.
  STOP_SESSION = 'STOP_SESSION', // Request the Charge Point to stop an ongoing session.
  UNLOCK_CONNECTOR = 'UNLOCK_CONNECTOR' // Request the Charge Point to unlock the connector (if applicable). This functionality is for help desk operators only!
}

export enum CommandResultType {
  ACCEPTED = 'ACCEPTED', // Command request accepted by the Charge Point.
  CANCELED_RESERVATION = 'CANCELED_RESERVATION', // The Reservation has been canceled by the CPO.
  EVSE_OCCUPIED = 'EVSE_OCCUPIED', // EVSE is currently occupied, another session is ongoing. Cannot start a new session
  EVSE_INOPERATIVE = 'EVSE_INOPERATIVE', // EVSE is currently inoperative or faulted.
  FAILED = 'FAILED', // Execution of the command failed at the Charge Point.
  NOT_SUPPORTED = 'NOT_SUPPORTED', // The requested command is not supported by this Charge Point, EVSE etc.
  REJECTED = 'REJECTED', // Command request rejected by the Charge Point.
  TIMEOUT = 'TIMEOUT', // Command request timeout, no response received from the Charge Point in a reasonabletime.
  UNKNOWN_RESERVATION = 'UNKNOWN_RESERVATION' // The Reservation in the requested command is not known by this Charge Point.
}

export enum CommandResponseType {
  NOT_SUPPORTED = 'NOT_SUPPORTED', //  The requested command is not supported by this CPO, Charge Point, EVSE etc.
  REJECTED = 'REJECTED', //  Command request rejected by the CPO. (Session might not be from a customer of the eMSP that send this request)
  ACCEPTED = 'ACCEPTED', //  Command request accepted by the CPO.
  UNKNOWN_SESSION = 'UNKNOWN_SESSION' // The Session in the requested command is not known by this CPO.
}

/**
 * The CommandResponse object is send in the HTTP response body.
 */
export class CommandResponseDto {
  /**
   * Response from the CPO on the command request.
   */
  @IsNotEmpty()
  @IsEnum(CommandResponseType)
  result: CommandResponseType;

  /**
   * Timeout for this command in seconds. When the Result is not received within this timeout, the eMSP can assume
   * that the message might never be send.
   */
  @IsNotEmpty()
  @IsInt()
  timeout: number;

  /**
   * Human-readable description of the result (if one can be provided), multiple languages can be provided.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => DisplayTextDto)
  message?: DisplayTextDto[];
}

/**
 * The CommandResult object is send in the HTTP response body.
 */
export class CommandResultDto {
  /**
   * Result of the command request as sent by the Charge Point to the CPO.
   */
  @IsNotEmpty()
  @IsEnum(CommandResultType)
  result: CommandResultType;

  /**
   * Human-readable description of the reason (if one can be provided), multiple languages can be provided.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DisplayTextDto)
  message?: DisplayTextDto[];
}

/**
 * With CancelReservation the Sender can request the Cancel of an existing Reservation. The CancelReservation needs to contain
 * the reservation_id that was given by the Sender to the ReserveNow.
 */
export class CancelReservationDto {
  /**
   * URL that the CommandResult POST should be send to. This URL might contain an unique ID to be able to distinguish
   * between CancelReservation requests.
   */
  @IsNotEmpty()
  @IsUrl({}, { message: 'Invalid URL format' }) // Checks if the string is a valid URL
  response_url: string;

  /**
   * Reservation id, unique for this reservation. If the Charge Point already has a reservation that matches this
   * reservationId the Charge Point will replace the reservation.
   */
  @IsCiString({ message: 'Value must be a valid CI string' }) // Applying the custom validator
  @MaxLength(36, { each: true })
  reservation_id: string;
}

/**
 * The evse_uid is optional. If no EVSE is specified, the Charge Point should keep one EVSE available for the EV Driver identified
 * by the given Token. (This might not be supported by all Charge Points). A reservation can be replaced/updated by sending a
 * RESERVE_NOW request with the same Location (Charge Point) and the same reservation_id.
 * A successful reservation will result in a new Session object being created by the CPO.
 */
export class ReserveNowDto {
  /**
   * URL that the CommandResult POST should be send to. This URL might contain an unique ID to be able to distinguish between ReserveNow requests.
   */
  @IsNotEmpty()
  @IsUrl(undefined, { message: 'URL is not valid.' })
  @MaxLength(255)
  response_url: string;

  /**
   * Token object for how to reserve this Charge Point (and specific EVSE).
   */
  @IsNotEmpty()
  token: TokenDto;

  /**
   * The Date/Time when this reservation ends, in UTC.
   */
  @IsNotEmpty({ message: 'expiry_date is required' })
  @IsISO8601({ strict: true }) // Ensures string is in correct UTC format
  expiry_date: string;

  /**
   * Reservation id, unique for this reservation. If the Receiver (typically
   * CPO) Point already has a reservation that matches this reservationId for
   * that Location it will replace the reservation.
   */
  @IsCiString({ message: 'Value must be a valid CI string' }) // Applying the custom validator
  @MaxLength(36)
  reservation_id: string;

  /**
   * Location.id of the Location (belonging to the CPO this request is send to) for which to reserve an EVSE.
   */
  @IsCiString({ message: 'Value must be a valid CI string' }) // Applying the custom validator
  @MaxLength(36)
  location_id: string;

  /**
   * Optional EVSE.uid of the EVSE of this Location if a specific EVSE has to be reserved.
   */
  @IsOptional()
  @IsCiString({ message: 'Value must be a valid CI string' }) // Applying the custom validator
  @MaxLength(36)
  evse_uid?: string;

  /**
   * Reference to the authorization given by the eMSP, when given, this reference will be provided in the relevant
   * Session and/or CDR.
   */
  @IsOptional()
  @IsCiString({ message: 'Value must be a valid CI string' }) // Applying the custom validator
  @MaxLength(36)
  authorization_reference?: string;
}

/**
 * The evse_uid is optional. If no EVSE is specified, the Charge Point can itself decide on which EVSE to start a new session. (this
 * might not be supported by all Charge Points).
 */
export class StartSessionDto {
  /**
   * URL that the CommandResult POST should be send to. This URL might contain an unique ID to be able to distinguish between StartSession requests.
   */
  @IsNotEmpty()
  @IsUrl(undefined, { message: 'URL is not valid.' })
  @MaxLength(255)
  response_url: string;

  /**
   * Token object the Charge Point has to use to start a new session. The Token provided in this request is authorized by the eMSP.
   */
  @IsNotEmpty()
  token: TokenDto;

  /**
   * Location.id of the Location (belonging to the CPO this request is send to) on which a session is to be started.
   */
  @IsCiString({ message: 'Value must be a valid CI string' }) // Applying the custom validator
  @MaxLength(36)
  location_id: string;

  /**
   * Optional EVSE.uid of the EVSE of this Location on which a session is to be started. Required when connector_id is set.
   * Required for SNH ocpi implementation.
   */
  @IsOptional()
  @IsCiString({ message: 'Value must be a valid CI string' }) // Applying the custom validator
  @MaxLength(36)
  evse_uid?: string;

  /**
   * Optional Connector.id of the Connector of the EVSE on which a session is to be started. This field is required
   * when the capability: START_SESSION_CONNECTOR_REQUIRED is set on the EVSE.
   */
  @IsOptional()
  @IsCiString({ message: 'Value must be a valid CI string' }) // Applying the custom validator
  @MaxLength(36)
  connector_id?: string;

  /**
   * Reference to the authorization given by the eMSP, when given, this
   * reference will be provided in the relevant Session and/or CDR.
   */
  @IsOptional()
  @IsCiString({ message: 'Value must be a valid CI string' }) // Applying the custom validator
  @MaxLength(36)
  authorization_reference?: string;
}

export class StopSessionDto {
  /**
   * URL that the CommandResult POST should be send to. This URL might contain an unique ID to be able to distinguish
   * between StopSessionDto requests.
   */
  @IsNotEmpty()
  @IsUrl(undefined, { message: 'URL is not valid.' })
  @MaxLength(255)
  response_url: string;

  /**
   * Session.id of the Session that is requested to be stopped.
   */
  @IsCiString({ message: 'Value must be a valid CI string' }) // Applying the custom validator
  @MaxLength(36)
  session_id: string;
}

export class UnlockConnectorDto {
  /**
   * URL that the CommandResult POST should be send to.
   * This URL might contain an unique ID to be able to distinguish between UnlockConnectorDto requests.
   */
  @IsNotEmpty()
  @IsUrl(undefined, { message: 'URL is not valid.' })
  @MaxLength(255)
  response_url: string;

  /**
   * EVSE.uid of the EVSE of this Location of which it is requested to unlock the connector.
   */
  @IsCiString({ message: 'Value must be a valid CI string' }) // Applying the custom validator
  @MaxLength(36)
  location_id: string;

  /**
   * Optional EVSE.uid of the EVSE of this Location on which a session is to be started. Required when connector_id is set.
   */
  @IsCiString({ message: 'Value must be a valid CI string' }) // Applying the custom validator
  @MaxLength(36)
  evse_uid: string;

  /**
   * Connector.id of the Connector of this Location of which it is requested to unlock.
   */
  @IsCiString({ message: 'Value must be a valid CI string' }) // Applying the custom validator
  @MaxLength(36)
  connector_id: string;
}

export type CommandDto = StartSessionDto | StopSessionDto | ReserveNowDto | CancelReservationDto | UnlockConnectorDto;
