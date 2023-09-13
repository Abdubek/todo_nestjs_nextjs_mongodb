import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../users/users.schema';

export type TaskDocument = HydratedDocument<Task>;

export enum TaskStatus {
  TODO,
  IN_PROGRESS,
  DONE,
}

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Number, enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
