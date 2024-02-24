import { AbstractRepository, Role, User } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class UsersRepository extends AbstractRepository<User> {
  protected readonly logger = new Logger(UsersRepository.name);

  constructor(
    @InjectModel(User.name) model: Model<User>,
    @InjectConnection() connection: Connection,
  ) {
    super(model, connection);
  }

  public getUserByEmail(email: string) {
    return this.findOne({ email });
  }

  public assignRoles(userId: string, roles: Array<Role>) {
    return this.findOneAndUpdate({ _id: userId }, { roles });
  }
}
