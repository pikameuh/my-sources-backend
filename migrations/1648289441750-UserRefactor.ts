import {MigrationInterface, QueryRunner} from "typeorm";

export class UserRefactor1648289441750 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" ADD COLUMN "register_token" VARCHAR(255)`,
        );

        await queryRunner.query(
            `ALTER TABLE "users" ADD COLUMN "is_registered" boolean`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" DROP COLUMN "register_token"`,
        );

        await queryRunner.query(
            `ALTER TABLE "users" DROP COLUMN "is_registered"`,
        );
    }

}
