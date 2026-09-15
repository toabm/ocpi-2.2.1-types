// 🚫 Do not import this file directly. Use `types/index.ts` instead.
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested
} from 'class-validator';
import { BusinessDetailsDto } from '../../index';
import { IsCiString } from '../../custom_validators/ciString';
import { IsCountryCode } from '../../custom_validators/countryCode';
import { Type } from 'class-transformer';

export enum RoleEnum {
  CPO = 'CPO', // Charge Point Operator Role
  EMSP = 'EMSP', // eMobility Service Provider Role
  HUB = 'HUB', // Hub role
  NAP = 'NAP', // National Access Point Role (national database with all location information of a country)
  NSP = 'NSP', // Navigation Service Provider Role, similar to eMSP (mainly interested in location info)
  OTHER = 'OTHER', // Other role
  SCSP = 'SCSP' // Smart Charging Service Provider Role
}

export class CredentialsRoleDto {
  /**
   * Type of role.
   */
  @IsNotEmpty()
  @IsEnum(RoleEnum)
  role: RoleEnum;

  /**
   * Details of this party.
   */
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => BusinessDetailsDto)
  business_details: BusinessDetailsDto;

  /**
   * CPO, eMSP (or other role) ID of this party (following the ISO-15118 standard).
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(3)
  @IsCiString({ message: 'party_id must be a valid CI string' })
  party_id: string;

  /**
   * ISO-3166 alpha-2 country code of the country this party is operating in.
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(2)
  @IsCiString({ message: 'Value must be a valid CI string' })
  @IsCountryCode({ message: 'country_code is not valid' })
  country_code: string;
}

export class CredentialsDto {
  /**
   * The credentials token for the other party to authenticate in your system. It should only contain printable
   * non-whitespace ASCII characters, that is, characters with Unicode code points from the range of U+0021 up to
   * and including U+007E.
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  token: string;

  /**
   * The URL to your API versions endpoint -- VERSIONS ENDPOINT
   */
  @IsNotEmpty({ message: 'url is required' })
  @IsUrl({}, { message: 'Invalid URL format' })
  @MaxLength(255, { message: 'URL should not exceed 255 characters' })
  url: string;

  /**
   * List of the roles this party provides.
   */
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CredentialsRoleDto)
  roles: CredentialsRoleDto[];

  /**
   * This is a custom property. Not part of OCPI specs. It is used to identify for whom was the Necture token
   * issued for.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => CredentialsRoleDto)
  issuedFor?: CredentialsRoleDto;

  /**
   * This is a custom property. Not part of OCPI specs. Used to search credentials by token.
   */
  @IsOptional()
  @IsString()
  @MaxLength(64)
  tokenHash?: string;

  @IsOptional()
  @IsDate()
  created_at?: Date;
}
