import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) { // Por defecto se llama 'jwt'
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'tu_secreto_aqui', // Asegúrate de que coincida con tu .env
    });
  }

  async validate(payload: any) {
    // Esto inyecta el usuario en el request (req.user)
    return { userId: payload.sub, email: payload.email }; 
  }
}
