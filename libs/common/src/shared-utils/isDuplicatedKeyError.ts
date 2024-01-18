import { MongoError } from 'mongodb';

export function isDuplicatedKeyError(error: unknown) {
  const DUPLICATE_KEY_ERROR_CODE = 11000;
  return error instanceof MongoError && error.code === DUPLICATE_KEY_ERROR_CODE;
}
