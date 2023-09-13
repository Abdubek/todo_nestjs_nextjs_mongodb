import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TaskDocument, TaskSchema } from '../tasks/tasks.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Task' }] })
  tasks: TaskDocument[];
}

export const UserSchema = SchemaFactory.createForClass(User);
