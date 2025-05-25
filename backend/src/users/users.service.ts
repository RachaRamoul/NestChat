import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: { email: string; username: string; password: string }) {
    return this.prisma.user.create({ data });
  }

  async updateColor(username: string, color: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
  
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
  
    return this.prisma.user.update({
      where: { id: user.id }, 
      data: { color },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }
  
  async updateColorById(id: number, color: string) {
    return this.prisma.user.update({
      where: { id },
      data: { color },
    });
  }
  
  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }
  
}
