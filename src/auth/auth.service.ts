import { Injectable, UnauthorizedException, Inject, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, isNull, and } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import * as authSchema from '../db/schema/auth-admin.schema';
import { LoginDto } from '../auth/dto/login.dto';
import { LoginResponseDto } from '../auth/dto/login-response.dto';
import { RegisterAuthAdminDto } from './dto/register-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('DB') private db: NodePgDatabase<typeof authSchema>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(
    registerAuthAdminDto: RegisterAuthAdminDto,
  ): Promise<{ message: string }> {
    const { username, password } = registerAuthAdminDto;

    const existingUsers = await this.db
      .select()
      .from(authSchema.authAdmin)
      .where(
        and(
          eq(authSchema.authAdmin.username, username),
          isNull(authSchema.authAdmin.deleted_at),
        ),
      );

    const existingUser: authSchema.AuthAdmin | undefined = existingUsers[0];

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.db.insert(authSchema.authAdmin).values({
      username,
      password: hashedPassword,
    });

    return { message: 'Registration successful' };
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { username, password } = loginDto;

    const admins = await this.db
      .select()
      .from(authSchema.authAdmin)
      .where(
        and(
          eq(authSchema.authAdmin.username, username),
          isNull(authSchema.authAdmin.deleted_at),
        ),
      );

    const admin: authSchema.AuthAdmin | undefined = admins[0];

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: admin.id,
      username: admin.username,
    };

    const accessToken = this.jwtService.sign(payload);
    const expiresIn = this.configService.get<number>('JWT_EXPIRES_IN') || 3600;

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: expiresIn,
    };
  }

  async validateUser(userId: string) {
    const admins = await this.db
      .select()
      .from(authSchema.authAdmin)
      .where(
        and(
          eq(authSchema.authAdmin.id, userId),
          isNull(authSchema.authAdmin.deleted_at),
        ),
      );

    const admin: authSchema.AuthAdmin | undefined = admins[0];

    if (!admin) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: admin.id,
      username: admin.username,
    };
  }
}