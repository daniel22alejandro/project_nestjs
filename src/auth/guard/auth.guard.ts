import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private readonly jwtService: JwtService) {}


  async canActivate(context: ExecutionContext):Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No se proporcionó token');
    }

    try {
      // JwtService ya está configurado con el secret en AuthModule, no es necesario pasarlo aquí
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload;
    } catch (error) {
      throw new UnauthorizedException('Sin autorizacion');
    }

    return true;    
  }
   private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }

}
