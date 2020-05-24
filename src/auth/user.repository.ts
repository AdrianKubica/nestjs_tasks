import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialDto: AuthCredentialDto): Promise<User> {
    const { username, password } = authCredentialDto

    const salt = await bcrypt.genSalt()

    const user = new User()
    // User.create({ username, password }).save() --> ten sam efekt
    user.username = username
    user.password = await this.hashPassword(password, salt)

    console.log(user.password)

    try {
      return await user.save()
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`User with ${username} already exists`)
      } else {
        throw new InternalServerErrorException()
      }
    }
  }

  async validateUserPassword(authCredentialDto: AuthCredentialDto): Promise<User> {
    const { username, password } = authCredentialDto
    const user = await this.findOne({ username })

    if (user && await user.validatePassword(password)) {
      return user
    } else {
      return null
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt)
  }
}