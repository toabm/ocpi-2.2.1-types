// 🚫 Do not import this file directly. Use `types/index.ts` instead.
import {
  IsString,
  ValidateNested,
  IsArray,
  IsEnum,
  IsISO8601,
  MaxLength,
  IsNotEmpty,
  IsOptional,
  Matches,
  IsUrl,
  IsInt,
  Min,
  Max,
  ArrayNotEmpty
} from 'class-validator';
import { Type } from 'class-transformer';
import { ConnectorDto } from './ocpi-connector.dto';

export enum StatusEnum {
  AVAILABLE = 'AVAILABLE', // The EVSE/Connector is able to start a new charging session.
  BLOCKED = 'BLOCKED', // The EVSE/Connector is not accessible because of a physical barrier, i.e. a car
  CHARGING = 'CHARGING', // The EVSE/Connector is in use
  INOPERATIVE = 'INOPERATIVE', // The EVSE/Connector is not yet active, or temporarily not available for use, but not broken or defect
  OUTOFORDER = 'OUTOFORDER', // The EVSE/Connector is currently out of order, some part/components may be broken/defect.
  PLANNED = 'PLANNED', // The EVSE/Connector is planned, will be operating soon
  REMOVED = 'REMOVED', // The EVSE/Connector was discontinued/removed.
  RESERVED = 'RESERVED', // The EVSE/Connector is reserved for a particular EV driver and is unavailable for other drivers
  UNKNOWN = 'UNKNOWN' // No status information available (also used when offline) for the EVSE/Connector
}

export enum CapabilityEnum {
  CHARGING_PROFILE_CAPABLE = 'CHARGING_PROFILE_CAPABLE', // The EVSE supports charging profiles.
  CHARGING_PREFERENCES_CAPABLE = 'CHARGING_PREFERENCES_CAPABLE', // The EVSE supports charging preferences.
  CHIP_CARD_SUPPORT = 'CHIP_CARD_SUPPORT', // EVSE has a payment terminal that supports chip cards.
  CREDIT_CARD_PAYABLE = 'CREDIT_CARD_PAYABLE', // EVSE has a payment terminal that supports contactless cards
  DEBIT_CARD_PAYABLE = 'DEBIT_CARD_PAYABLE', // EVSE has a payment terminal that makes it possible to pay for charging using a credit card.
  PED_TERMINAL = 'PED_TERMINAL', // EVSE has a payment terminal with a pin-code entry device.
  REMOTE_START_STOP_CAPABLE = 'REMOTE_START_STOP_CAPABLE', // The EVSE can remotely be started/stopped.
  RESERVABLE = 'RESERVABLE', // The EVSE can be reserved
  RFID_READER = 'RFID_READER', // Charging at this EVSE can be authorized with an RFID token.
  START_SESSION_CONNECTOR_REQUIRED = 'START_SESSION_CONNECTOR_REQUIRED', // When a StartSession is sent to this EVSE, the MSP is required to add the optional connector_id field in the StartSession object.
  TOKEN_GROUP_CAPABLE = 'TOKEN_GROUP_CAPABLE', // This EVSE supports token groups, two or more tokens work as one, so that a session can be started with one token and stopped with another (handy when a card and key-fob are given to the EV-driver).
  UNLOCK_CAPABLE = 'UNLOCK_CAPABLE' // Connectors have a mechanical lock that can be requested by the eMSP to be unlocked.
}

export enum ParkingRestrictionEnum {
  EV_ONLY = 'EV_ONLY', // Reserved parking spot for electric vehicles
  PLUGGED = 'PLUGGED', // Parking is only allowed while plugged in (charging).
  DISABLED = 'DISABLED', // Reserved parking spot for disabled people with valid ID.
  CUSTOMERS = 'CUSTOMERS', // Parking spot for customers/guests only, for example in case of a hotel or shop.
  MOTORCYCLES = 'MOTORCYCLES' // Parking spot only suitable for (electric) motorcycles or scooters.
}

export enum ImageCategoryEnum {
  CHARGER = 'CHARGER', // Photo of the physical device that contains one or more EVSE
  ENTRANCE = 'ENTRANCE', // Location entrance photo. Should show the car entrance to the location from the street side.
  LOCATION = 'LOCATION', // Location overview photo
  NETWORK = 'NETWORK', // Logo of an associated roaming network to be displayed with the EVSE, for example, in lists, maps  and detailed information views.
  OPERATOR = 'OPERATOR', // Logo of the charge point operator, for example, a municipality, to be displayed in the EVSEs detailed  information view or in lists and maps, if no network logo is present.
  OTHER = 'OTHER', // Other
  OWNER = 'OWNER' // Logo of the charge point owner, for example, a local store, to be displayed in the EVSEs detailed  information view.
}

/**
 * This type is used to schedule status periods in the future. The eMSP can provide this information to the EV user for
 * trip planning purposes. The scheduled status is purely informational. When the status actually changes, the CPO must push
 * an update to the EVSEs status field itself.
 */
export class StatusScheduleDto {
  @IsNotEmpty({ message: 'period_begin is required' }) // Ensures the field is not empty
  @IsISO8601({ strict: true }) // Ensures string is in the correct UTC format
  period_begin: string;

  @IsOptional()
  @IsISO8601({ strict: true }) // Ensures string is in the correct UTC format
  period_end?: string;

  @IsNotEmpty({ message: 'status is required' })
  @IsEnum(StatusEnum)
  status: StatusEnum;
}

export class DisplayTextDto {
  @IsNotEmpty({ message: 'language is required' })
  @IsString()
  @MaxLength(2)
  language: string;

  @IsNotEmpty({ message: 'text is required' })
  @IsString()
  @MaxLength(512)
  text: string;
}

/**
 * This class defines the geolocation of the Charge Point. The geodetic system to be used is WGS 84
 */
export class GeoLocationDto {
  /**
   * Latitude of the point in decimal degree. Example: 50.770774. Decimal separator: "." Regex: -?[0-9]{1,2}\.[0-9]{5,7}
   */
  @IsNotEmpty({ message: 'latitude is required' })
  @IsString()
  @MaxLength(10)
  @Matches(/-?[0-9]{1,2}\.[0-9]{5,7}/, { message: 'Wrong format for latitude' })
  latitude: string;

  /**
   * Longitude of the point in decimal degree. Example: -126.104965. Decimal separator: "." Regex: -?[0-9]{1,3}\.[0-9]{5,7}
   */
  @IsNotEmpty({ message: 'longitude is required' })
  @IsString()
  @MaxLength(11)
  @Matches(/-?[0-9]{1,2}\.[0-9]{5,7}/, {
    message: 'Wrong format for longitude'
  })
  longitude: string;
}

/**
 * This class defines an additional geolocation that is relevant for the Charge Point.
 */
export class AdditionalGeoLocationDto {
  /**
   * Latitude of the point in decimal degree. Example: 50.770774. Decimal separator: "." Regex: -?[0-9]{1,2}\.[0-9]{5,7}
   */
  @IsNotEmpty({ message: 'latitude is required' })
  @IsString()
  @MaxLength(10)
  @Matches(/-?[0-9]{1,2}\.[0-9]{5,7}/, { message: 'Wrong format for latitude' })
  latitude: string;

  /**
   * Longitude of the point in decimal degree. Example: -126.104965. Decimal separator: "." Regex: -?[0-9]{1,3}\.[0-9]{5,7}
   */
  @IsNotEmpty({ message: 'longitude is required' })
  @IsString()
  @MaxLength(11)
  @Matches(/-?[0-9]{1,2}\.[0-9]{5,7}/, {
    message: 'Wrong format for longitude'
  })
  longitude: string;

  /**
   * Name of the point in the local language or as written at the location. For example, the street name of a parking lot
   * entrance or its number.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DisplayTextDto)
  name?: DisplayTextDto;
}

/**
 * This class references an image related to an EVSE in terms of a file name or url.
 */
export class ImageDto {
  /**
   * URL from where the image data can be fetched through a web browser
   */
  @IsNotEmpty({ message: 'url is required' })
  @IsUrl({}, { message: 'Invalid URL format' }) // Checks if the string is a valid URL
  @MaxLength(255, { message: 'URL should not exceed 255 characters' }) // Limits length to 255 characters
  url: string;

  /**
   * URL from where a thumbnail of the image can be fetched through a
   * webbrowser.
   */
  @IsOptional()
  @IsUrl({}, { message: 'Invalid URL format' }) // Checks if the string is a valid URL
  @MaxLength(255, { message: 'URL should not exceed 255 characters' }) // Limits length to 255 characters
  thumbnail?: string;

  /**
   * Describes what the image is used for
   */
  @IsNotEmpty({ message: 'category is required' })
  @IsEnum(ImageCategoryEnum)
  category: ImageCategoryEnum;

  /**
   * Image type like: gif, jpeg, png, svg.
   */
  @IsNotEmpty({ message: 'category is required' })
  @MaxLength(4, { message: 'type must be shorter than or equal to 4 characters' })
  @Matches(/^(jpg|jpeg|png|gif|bmp|tiff)$/i, { message: 'Invalid image file type' })
  type: string;

  /**
   * Width of the full-scale image.
   */
  @IsOptional()
  @IsInt()
  @Min(0) // Optional: minimum value you want to allow
  @Max(99999) // Maximum 5 digit integer
  width?: number;

  /**
   * Height of the full-scale image.
   */
  @IsOptional()
  @IsInt()
  @Min(0) // Optional: minimum value you want to allow
  @Max(99999) // Maximum 5 digit integer
  height?: number;
}

export class EvseDto {
  /**
   * Uniquely identifies the EVSE within the CPOs platform (and sub-operator platforms). For example, a database ID or
   * the actual "EVSE ID". This field can never be changed, modified or renamed. This is the 'technical' identification
   * of the EVSE, not to be used as 'human-readable' identification, use the field evse_id for that.
   * This field is named uid instead of id, because id could be confused with evse_id, which is an eMI3 defined field.
   */
  @IsNotEmpty({ message: 'uid is required' })
  @IsString()
  @MaxLength(36)
  uid: string;

  /**
   * Compliant with the following specification for EVSE ID from "eMI3 standard version V1.0"
   * (http://emi3group.com/documents-links/) "Part 2: business objects."
   * Optional because: if an evse_id is to be re-used in the real world, the evse_id can be removed from an EVSE object
   * if the status is set to REMOVED.
   */
  @IsOptional()
  @IsString()
  @MaxLength(48)
  evse_id?: string;

  /**
   * Indicates the current status of the EVSE.
   */
  @IsNotEmpty({ message: 'status is required' })
  @IsEnum(StatusEnum)
  status: StatusEnum;

  /**
   * Indicates a planned status update of the EVSE.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatusScheduleDto)
  status_schedule?: StatusScheduleDto[];

  /**
   * List of functionalities that the EVSE is capable of.
   */
  @IsOptional()
  @IsArray()
  @IsEnum(CapabilityEnum, { each: true }) // Validate each element of the array
  capabilities?: CapabilityEnum[];

  /**
   * List of available connectors on the EVSE.
   */
  @ArrayNotEmpty({ message: 'connectors is required' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConnectorDto)
  connectors: ConnectorDto[] = [];

  /**
   * Level on which the Charge Point is located (in garage buildings) in the
   * locally displayed numbering scheme.
   */
  @IsOptional()
  @IsString()
  @MaxLength(36)
  floor_level?: string;

  /**
   * Coordinates of the EVSE
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => GeoLocationDto)
  coordinates?: GeoLocationDto;

  /**
   * A number/string printed on the outside of the EVSE for visual identification.
   */
  @IsOptional()
  @IsString()
  physical_reference?: string;

  /**
   * Multi-language human-readable directions when more detailed information on how to reach the EVSE from the
   * Location is required
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  directions?: DisplayTextDto[];

  /**
   * The restrictions that apply to the parking spot.
   */
  @IsOptional()
  @IsArray()
  @IsEnum(ParkingRestrictionEnum, { each: true }) // Validate each element of the array
  parking_restrictions?: ParkingRestrictionEnum[];

  /**
   * Links to images related to the EVSE such as photos or logos.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  images?: ImageDto[];

  /**
   * Timestamp when this EVSE or one of its Connectors was last updated (or created).
   */
  @IsNotEmpty({ message: 'last_updated is required' })
  @IsISO8601({ strict: true }) // Ensures string is in the correct UTC format
  last_updated: string;
}
