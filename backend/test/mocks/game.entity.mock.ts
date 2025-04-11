import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { GameStatus } from '../../src/game/game-status';

/**
 * Entity mock adapted for sqlite
 */
@Entity()
export class GameMock {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column('simple-json')
    moves: string[];

    @Column({
        type: 'varchar',
    })
    status: GameStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
