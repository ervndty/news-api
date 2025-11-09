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

// Define proper type for admin user
interface AdminUser {
  id: string;
  username: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

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

    // Use type assertion to avoid unsafe member access
    const authAdminTable = authSchema.authAdmin as typeof authSchema.authAdmin;

    const existingUsers = await this.db
      .select()
      .from(authAdminTable)
      .where(
        and(
          eq(authAdminTable.username, username),
          isNull(authAdminTable.deleted_at),
        ),
      );

    const existingUser = existingUsers[0] as AdminUser | undefined;

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.db.insert(authAdminTable).values({
      username,
      password: hashedPassword,
    });

    return { message: 'Registration successful' };
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { username, password } = loginDto;

    const authAdminTable = authSchema.authAdmin as typeof authSchema.authAdmin;

    const admins = await this.db
      .select()
      .from(authAdminTable)
      .where(
        and(
          eq(authAdminTable.username, username),
          isNull(authAdminTable.deleted_at),
        ),
      );

    const admin = admins[0] as AdminUser | undefined;

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
    const authAdminTable = authSchema.authAdmin as typeof authSchema.authAdmin;

    const admins = await this.db
      .select()
      .from(authAdminTable)
      .where(
        and(
          eq(authAdminTable.id, userId),
          isNull(authAdminTable.deleted_at),
        ),
      );

    const admin = admins[0] as AdminUser | undefined;

    if (!admin) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: admin.id,
      username: admin.username,
    };
  }
}