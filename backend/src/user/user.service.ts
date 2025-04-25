import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<{ id: string; email: string }> {
    const existingUser = await this.findUserByEmail(createUserDto.email);
    if (existingUser) {
      throw new Error('EMAIL_ALREADY_IN_USE');
    }
    const user = await this.userRepository.create({
      email: createUserDto.email,
      password: createUserDto.password,
    });

    const userResponse = {
      id: user.id,
      email: user.email,
    };
    return userResponse;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    return user;
  }

  async findUserById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    return user;
  }

}