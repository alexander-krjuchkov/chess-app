import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGameTable1743534058098 implements MigrationInterface {
    name = 'AddGameTable1743534058098';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."game_status_enum" AS ENUM(
                'in_progress',
                'white_wins',
                'black_wins',
                'draw'
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "game" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "moves" jsonb NOT NULL DEFAULT '[]',
                "status" "public"."game_status_enum" NOT NULL DEFAULT 'in_progress',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "game"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."game_status_enum"
        `);
    }
}
