// 🚫 Do not import this file directly. Use `types/index.ts` instead.
import 'reflect-metadata';
import { ValidateNested, IsArray, IsEnum, IsUrl, MaxLength, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export enum VersionEnum {
  v2_0 = '2.0',
  v2_1 = '2.1',
  v2_1_1 = '2.1.1',
  v2_2 = '2.2',
  v2_2_1 = '2.2.1'
}

export enum ModuleIDEnum {
  cdrs = 'cdrs',
  chargingprofiles = 'chargingprofiles',
  commands = 'commands',
  credentials = 'credentials',
  hubclientinfo = 'hubclientinfo',
  locations = 'locations',
  sessions = 'sessions',
  tariffs = 'tariffs',
  tokens = 'tokens'
}

export enum InterfaceRoleEnum {
  SENDER = 'SENDER',
  RECEIVER = 'RECEIVER'
}

export class VersionDto {
  /**
   * The version number.
   */
  @IsNotEmpty()
  @IsEnum(VersionEnum)
  version: VersionEnum;

  /**
   * URL to the endpoint containing version specific information.
   */
  @IsNotEmpty()
  @IsUrl(undefined, { message: 'URL is not valid.' })
  @MaxLength(255)
  url: string;
}

export class EndpointDto {
  @IsEnum(ModuleIDEnum)
  identifier: ModuleIDEnum;

  @IsEnum(InterfaceRoleEnum)
  role: InterfaceRoleEnum;

  @IsUrl(undefined, { message: 'URL is not valid.' })
  @MaxLength(255)
  url: string;
}

export class VersionDetailDto {
  /**
   * The version number.
   */
  @IsEnum(VersionEnum)
  version: VersionEnum;

  /**
   * A list of supported endpoints for this version.
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EndpointDto)
  endpoints: EndpointDto[];
}
