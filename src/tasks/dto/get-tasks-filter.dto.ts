
import { IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus, {message: `status must be valid: ${Object.keys(TaskStatus)}`})
  status: TaskStatus

  @IsOptional()
  @IsNotEmpty()
  search: string
}