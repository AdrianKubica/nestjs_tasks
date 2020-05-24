import { Controller, Body, Post, ValidationPipe, UseInterceptors, ClassSerializerInterceptor, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { User } from './user.entity';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body(ValidationPipe) authCredentialDto: AuthCredentialDto): Promise<User> {
    return await this.authService.signUp(authCredentialDto)
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body(ValidationPipe) authCredentialDto: AuthCredentialDto): Promise<{ accessToken: string }> {
    return await this.authService.signIn(authCredentialDto)
  }
}
