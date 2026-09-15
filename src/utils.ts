// 🚫 Do not import this file directly. Use `types/index.ts` instead.
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';

/**
 * This method can be use to validate an array of dtos with class validator.
 *
 * If we dont provide the classConstructor as a second argument we need to convert the array of plain objects
 * into class instances first using plainToInstance().
 *
 * Uses:
 * + Option 1:
 *       const allLocationInstances = plainToInstance(LocationDto, allLocations);
 *       const errors = await validateAll(allLocationInstances);
 * + Option 2:
 *       const errors = await validateAll(allLocationInstances, LocationDto);
 *
 *
 * @param items
 */
export function validateAll<T extends object>(items: T[]): Promise<ValidationError[][]>;
/**
 * Overload 2: Validates an array of plain objects by transforming them into class instances first.
 * Requires a class constructor to convert plain objects using class-transformer.
 */
export function validateAll<T extends object>(
  items: T[] | unknown[],
  classConstructor: new () => T
): Promise<ValidationError[][]>;

/**
 * This method can be use to validate an array of dtos with class validator.
 * @param items
 * @param classConstructor
 */
export function validateAll<T extends object>(
  items: T[] | unknown[],
  classConstructor?: new () => T
): Promise<ValidationError[][]> {
  if (classConstructor) {
    const instances = (items as unknown[]).map(item => plainToInstance(classConstructor, item));
    return Promise.all(instances.map(instance => validate(instance)));
  } else {
    return Promise.all((items as T[]).map(item => validate(item)));
  }
}
