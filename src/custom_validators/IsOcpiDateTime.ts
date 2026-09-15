import { registerDecorator, ValidationOptions } from 'class-validator';

const OCPI_DATETIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z)?$/;

export function IsOcpiDateTime(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isOcpiDateTime',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          return typeof value === 'string' && OCPI_DATETIME_REGEX.test(value);
        },
        defaultMessage(): string {
          return `${propertyName} must be a valid OCPI DateTime string in RFC 3339 format (e.g. 2018-01-01T01:08:01.123Z)`;
        }
      }
    });
  };
}
