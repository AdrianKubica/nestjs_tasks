import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../dist/auth/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  async signUp(authCredentialDto: AuthCredentialDto): Promise<User> {
    return await this.userRepository.signUp(authCredentialDto)
  }

  async signIn(authCredentialDto: AuthCredentialDto): Promise<{accessToken: string}> {
    const user = await this.userRepository.validateUserPassword(authCredentialDto)
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const payload: JwtPayload = { username: user.username }
    const accessToken = await this.jwtService.sign(payload)

    return { accessToken }
  }
}