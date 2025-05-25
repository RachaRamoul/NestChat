import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../../prisma/prisma.service'
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private users = new Map<string, string>();

  constructor(private readonly prisma: PrismaService) {}

  @SubscribeMessage('login')
  async handleLogin(@MessageBody() username: string, @ConnectedSocket() socket: Socket) {
    this.users.set(socket.id, username);
    
    const user = await this.prisma.user.findUnique({ where: { username } });
    const color = user?.color || '#000000';
  
    socket.emit('your-color', color);
  
    this.broadcastUsers();
  }
  
  handleDisconnect(socket: Socket) {
    this.users.delete(socket.id);
    this.broadcastUsers();
  }

  @SubscribeMessage('private-message')
  async handlePrivateMessage(
    @MessageBody() data: { to: string; message: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const senderUsername = this.users.get(socket.id);
    const recipientSocketId = [...this.users.entries()].find(([id, name]) => name === data.to)?.[0];
  
    if (recipientSocketId && senderUsername) {
      const sender = await this.prisma.user.findUnique({
        where: { username: senderUsername },
      });
  
      this.server.to(recipientSocketId).emit('private-message', {
        from: senderUsername,
        message: data.message,
        color: sender?.color || '#000000', 
      });
    }
  }

  private broadcastUsers() {
    const usernames = Array.from(this.users.values());
    this.server.emit('users:list', usernames);
  }
}
