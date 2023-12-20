import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { Types } from "mongoose";

export class MongoIdValidationPipe implements PipeTransform {
  async transform(value: string, metadata: ArgumentMetadata): Promise<string> {
    if (metadata.type !== 'param') return value;

    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(['Id is not a valid ObjectId'])
    }

    return value;
  }
}