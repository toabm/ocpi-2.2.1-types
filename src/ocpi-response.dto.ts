// 🚫 Do not import this file directly. Use `types/index.ts` instead.
export enum OperationResult {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED'
}

export enum OCPIStatusCodesEnum {
  SUCCESS = 1000,
  CLIENT_ERROR = 2000,
  CLIENT_INVALID_PARAMETERS = 2001,
  CLIENT_NOT_ENOUGH_INFORMATION = 2002,
  SERVER_ERROR = 3000,
  SERVER_UNUSABLE_API = 3001,
  HUB_ERROR = 4000,
  HUB_UNKNOWN_RECEIVER = 4001,
  HUB_INVALID_SENDER_OR_RECEIVER = 4002,
  HUB_NOT_CONNECTED = 4003
}

export enum OcpiStatusMessagesEnum {
  SUCCESS = 'Success',
  CLIENT_ERROR = 'Client error',
  CLIENT_INVALID_PARAMETERS = 'Invalid parameters',
  CLIENT_NOT_ENOUGH_INFORMATION = 'Not enough information',
  SERVER_ERROR = 'Server error',
  SERVER_UNUSABLE_API = 'Unusable API',
  HUB_ERROR = 'Hub error',
  HUB_UNKNOWN_RECEIVER = 'Unknown receiver',
  HUB_INVALID_SENDER_OR_RECEIVER = 'Invalid sender or receiver',
  HUB_NOT_CONNECTED = 'Sender not connected'
}

/**
 * In OCPI protocol this is the object that is sent with all the response messages:
 *
 * data: Contains the actual response data object or list of objects from each request,
 * depending on the cardinality of the response data, this is an array, or a single object
 */
export interface OcpiResponseDto<T = any> {
  data?: T;
  status_code: OCPIStatusCodesEnum; // OCPI status code, as listed in Status Codes, indicates how the request was handled. To avoid confusion with HTTP codes, OCPI status codes consist of four digits.
  status_message?: OcpiStatusMessagesEnum | null; // An optional status message which may help when debugging.
  timestamp: string; // A string, that matches RFC 3339 timestamp format (with optional fractional seconds). On UTC.
}
