import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import { PostModule } from './post/post.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '192.168.84.101',
      port: 3306,
      username: 'root',
      password: '7MNCWHDV4BJBFDQ',
      database: 'project_nestJS',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true
    }),
    UsersModule,
    PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
