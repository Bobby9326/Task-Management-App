import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './entities/task.entity';
import { UserModule } from 'src/user/user.module';
// import { UserModule } from '../user/user.module';

@Module({
  imports: [SequelizeModule.forFeature([Task]), UserModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}