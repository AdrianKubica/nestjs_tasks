import { Module } from '@nestjs/common'
import { TasksController } from './tasks.controller'
import { TasksService } from './tasks.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TaskRepository } from './task.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskRepository]),
    AuthModule  // wszystko co jest eksportowane przez AuthModule jest dostępne z automatu w tym module
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
