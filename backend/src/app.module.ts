import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/todo'),
    RedisModule.forRoot({
      config: {
        host: 'localhost',
        port: 6379,
        password: 'my-password',
      },
    }),
    UsersModule,
    AuthModule,
    TasksModule,
  ],
})
export class AppModule {}
