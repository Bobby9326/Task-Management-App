import {
  Controller,
  Post,
  Body,
  HttpStatus,
  BadRequestException,

  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,

} from './dto/create-user.dto';
import {
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';


@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOperation({ summary: 'Use to register user' })
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.createUser(createUserDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Create user successfully',
        data: user,
      };
    } catch (error) {
      const err = error as Error;
      if (err.message === 'EMAIL_ALREADY_IN_USE') {
        throw new BadRequestException('Email already in use');
      }
      // fallback error response
      throw new InternalServerErrorException('Something went wrong');
    }
  }

}