import { Conversation } from '../../conversations/entities/conversation.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') // Usamos UUID para ser escalables y seguros
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Recuerda hashearla antes de guardar en un caso real

  // Relación: Un Usuario tiene muchas Conversaciones
  @OneToMany(() => Conversation, (conversation) => conversation.user)
  conversations: Conversation[];

  @CreateDateColumn()
  createdAt: Date;
}
