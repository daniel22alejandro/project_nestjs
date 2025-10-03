import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register-dto';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor( 
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async register(registerDto: RegisterDto) {
    // Delegar en UsersService (ya hashea la contraseña)
    return this.usersService.createUser(registerDto as any);
  }

  async validateUser(username: string, plainPassword: string) {
    const user = await this.usersService.findByUsernameWithPassword(username);
    if (!user) return null;

    const passwordMatches = await bcrypt.compare(plainPassword, user.password);
    if (!passwordMatches) return null;

    const { password, ...safe } = user as any;
    return safe;
  }

  async login(payload: { username: string; password: string }) {
    const user = await this.usersService.findByUsernameWithPassword(payload.username);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const matches = await bcrypt.compare(payload.password, user.password);
    if (!matches) throw new UnauthorizedException('Credenciales inválidas');

    const tokenPayload = { sub: user.id, username: user.username, rol: user.rol };
    const accessToken = this.jwtService.sign(tokenPayload);

    return { accessToken, expiresIn: process.env.JWT_EXPIRES_IN || '1h' };
  }
}
