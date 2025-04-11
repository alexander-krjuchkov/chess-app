import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { GameStatus, gameStatusVariants } from './game-status';

@Entity()
export class Game {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column('jsonb', { default: [] })
    moves: string[];

    @Column({
        type: 'enum',
        enum: gameStatusVariants,
        default: 'in_progress',
    })
    status: GameStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
