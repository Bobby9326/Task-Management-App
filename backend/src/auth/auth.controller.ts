import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Res,
  UnauthorizedException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
  LoginFailResponseDto,
  LoginResponseDto,
} from './dto/login-auth.dto';
import { LocalAuthGuard } from './guard/local.guard';
import { Response } from 'express';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/task/authenticated-request.interface';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Use to login' })
  @ApiOkResponse({ description: 'Login success', type: LoginResponseDto })
  @ApiUnauthorizedResponse({
    description: 'Login fail',
    type: LoginFailResponseDto,
  })
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginFailResponseDto | LoginResponseDto | undefined> {
    try {
      const { access_token } = await this.authService.login(body);
      res.cookie('access_token', access_token, {
        httpOnly: true,
        expires: new Date(Date.now() + 3600000),
      });

      return { message: 'Login successful', statusCode: HttpStatus.OK };
    } catch (error) {
      const err = error as Error;
      if (err.message === 'USER_NOT_FOUND') {
        throw new UnauthorizedException(
          'Email not found or password is incorrect',
        );
      }
    }
  }
  @UseGuards(JwtAuthGuard)
  @Get('/check')
  check(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const user = req.user;
    if (user) {
      return res.json({ email:user.email,
        authenticated: true });
    }
    return res.json({  email:"",authenticated: false });
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and clear access token' })
  logout(@Res({ passthrough: true }) res: Response): void {
    res.clearCookie('access_token'); // Clear the cookie that stores the JWT
  }
}