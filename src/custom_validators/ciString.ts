import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidatorConstraint
} from '@nestjs/class-validator';

// The custom validation function you provided
export const CiString = (value: string): boolean => {
  if (!value) return false; // Return false if value is undefined, null, or empty
  for (let i = 0; i < value.length; i++) {
    if (value.charCodeAt(i) < 32) return false; // Any character with charCode < 32 will be rejected
  }
  return true;
};

// Create a custom validator class
@ValidatorConstraint({ async: false })
export class IsCiStringConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    // Return true if the value passes the CiString validation function
    return CiString(value);
  }

  defaultMessage(args: ValidationArguments) {
    return 'String contains invalid characters (charCode < 32)';
  }
}

// Create the custom decorator
export function IsCiString(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCiStringConstraint
    });
  };
}
