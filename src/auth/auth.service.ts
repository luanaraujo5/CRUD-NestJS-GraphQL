import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthInputDto } from './dto/auth-input.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateClient(authInput: AuthInputDto): Promise<boolean> {
    const { clientId, clientSecret } = authInput;
    return clientId === process.env.CLIENT_ID && clientSecret === process.env.CLIENT_SECRET;
  }

  async login(authInput: AuthInputDto): Promise<AuthResponseDto> {
    const isValidClient = await this.validateClient(authInput);
    if (!isValidClient) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { clientId: authInput.clientId };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
