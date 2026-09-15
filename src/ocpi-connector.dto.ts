// 🚫 Do not import this file directly. Use `types/index.ts` instead.
import {
  IsString,
  IsInt,
  IsArray,
  IsEnum,
  MaxLength,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsISO8601,
  ValidateIf
} from 'class-validator';
import { IsCiString } from './custom_validators/ciString';

export enum ConnectorTypeEnum {
  CHADEMO = 'CHADEMO',
  CHAOJI = 'CHAOJI',
  DOMESTIC_A = 'DOMESTIC_A',
  DOMESTIC_B = 'DOMESTIC_B',
  DOMESTIC_C = 'DOMESTIC_C',
  DOMESTIC_D = 'DOMESTIC_D',
  DOMESTIC_E = 'DOMESTIC_E',
  DOMESTIC_F = 'DOMESTIC_F',
  DOMESTIC_G = 'DOMESTIC_G',
  DOMESTIC_H = 'DOMESTIC_H',
  DOMESTIC_I = 'DOMESTIC_I',
  DOMESTIC_J = 'DOMESTIC_J',
  DOMESTIC_K = 'DOMESTIC_K',
  DOMESTIC_L = 'DOMESTIC_L',
  DOMESTIC_M = 'DOMESTIC_M',
  DOMESTIC_N = 'DOMESTIC_N',
  DOMESTIC_O = 'DOMESTIC_O',
  GBT_AC = 'GBT_AC',
  GBT_DC = 'GBT_DC',
  IEC_60309_2_SINGLE_16 = 'IEC_60309_2_SINGLE_16',
  IEC_60309_2_THREE_16 = 'IEC_60309_2_THREE_16',
  IEC_60309_2_THREE_32 = 'IEC_60309_2_THREE_32',
  IEC_60309_2_THREE_64 = 'IEC_60309_2_THREE_64',
  IEC_62196_T1 = 'IEC_62196_T1',
  IEC_62196_T1_COMBO = 'IEC_62196_T1_COMBO',
  IEC_62196_T2 = 'IEC_62196_T2',
  IEC_62196_T2_COMBO = 'IEC_62196_T2_COMBO',
  IEC_62196_T3A = 'IEC_62196_T3A',
  IEC_62196_T3C = 'IEC_62196_T3C',
  NEMA_5_20 = 'NEMA_5_20',
  NEMA_6_20 = 'NEMA_6_20',
  NEMA_6_50 = 'NEMA_6_50',
  NEMA_10_30 = 'NEMA_10_30',
  NEMA_10_50 = 'NEMA_10_50',
  NEMA_14_30 = 'NEMA_14_30',
  NEMA_14_50 = 'NEMA_14_50',
  PANTOGRAPH_BOTTOM_UP = 'PANTOGRAPH_BOTTOM_UP',
  PANTOGRAPH_TOP_DOWN = 'PANTOGRAPH_TOP_DOWN',
  TESLA_R = 'TESLA_R',
  TESLA_S = 'TESLA_S'
}

export enum ConnectorFormatEnum {
  SOCKET = 'SOCKET',
  CABLE = 'CABLE'
}

export enum PowerTypeEnum {
  AC_1_PHASE = 'AC_1_PHASE',
  AC_2_PHASE = 'AC_2_PHASE',
  AC_2_PHASE_SPLIT = 'AC_2_PHASE_SPLIT',
  AC_3_PHASE = 'AC_3_PHASE',
  DC = 'DC'
}

export class ConnectorDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(36)
  @IsCiString({ message: 'Value must be a valid CI string' }) // Applying the custom validator
  id: string;

  @IsNotEmpty()
  @IsEnum(ConnectorTypeEnum)
  standard: ConnectorTypeEnum;

  @IsNotEmpty()
  @IsEnum(ConnectorFormatEnum)
  format: ConnectorFormatEnum;

  @IsNotEmpty()
  @IsEnum(PowerTypeEnum)
  power_type: PowerTypeEnum;

  @IsNotEmpty()
  @IsInt()
  max_voltage: number;

  @IsNotEmpty()
  @IsInt()
  max_amperage: number;

  @ValidateIf(o => o.max_electric_power !== undefined)
  @IsOptional()
  @IsInt()
  max_electric_power?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsCiString({ each: true, message: 'Each tariff_id must be a valid CI string' })
  @MaxLength(36, { each: true })
  tariff_ids?: string[];

  @ValidateIf(o => o.terms_and_conditions !== undefined)
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Invalid URL format' }) // Checks if the string is a valid URL
  @MaxLength(255, { message: 'URL should not exceed 255 characters' }) // Limits length to 255 characters
  terms_and_conditions?: string;

  @IsNotEmpty({ message: 'last_updated is required' })
  @IsISO8601({ strict: true }) // Ensures string is in correct UTC format
  last_updated: string;
}
