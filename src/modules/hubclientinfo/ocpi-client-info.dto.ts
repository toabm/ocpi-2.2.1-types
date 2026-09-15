// 🚫 Do not import this file directly. Use `types/index.ts` instead.
import { IsEnum, IsISO8601, IsNotEmpty, MaxLength } from 'class-validator';
import { IsCiString } from '../../custom_validators/ciString';
import { IsCountryCode } from '../../custom_validators/countryCode';
import { RoleEnum } from '../credentials/ocpi-credentials.dto';

export enum ConnectionStatusEnum {
  CONNECTED = 'CONNECTED', // Party is connected.
  OFFLINE = 'OFFLINE', // Party is currently not connected.
  PLANNED = 'PLANNED', // Connection to this party is planned, but has never been connected.
  SUSPENDED = 'SUSPENDED' // Party is no longer active, will never connect anymore.
}

/**
 * The ClientInfo object describes the connection status of a party (CPO or eMSP) connected to a Hub, as known by
 * that Hub. Unlike the usual OCPI modules, HubClientInfo reflects state between an eMSP/CPO and a Hub, not between
 * an eMSP and a CPO directly.
 */
export class ClientInfoDto {
  /**
   * CPO or eMSP ID of this party (following the ISO-15118 standard), as used in the credentials exchange.
   */
  @IsNotEmpty()
  @IsCiString({ message: 'Value must be a valid CI string' })
  @MaxLength(3)
  party_id: string;

  /**
   * Country code of the country this party is operating in, as used in the credentials exchange.
   */
  @IsNotEmpty()
  @IsCiString({ message: 'Value must be a valid CI string' })
  @MaxLength(2)
  @IsCountryCode({ message: 'country_code is not valid' })
  country_code: string;

  /**
   * The role of the connected party.
   */
  @IsNotEmpty()
  @IsEnum(RoleEnum)
  role: RoleEnum;

  /**
   * Status of the connection to the party.
   */
  @IsNotEmpty()
  @IsEnum(ConnectionStatusEnum)
  status: ConnectionStatusEnum;

  /**
   * Timestamp when this ClientInfo object was last updated.
   */
  @IsNotEmpty()
  @IsISO8601({ strict: true })
  last_updated: string;
}
