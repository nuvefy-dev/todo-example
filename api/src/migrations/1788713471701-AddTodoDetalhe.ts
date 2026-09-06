import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTodosTable1788713471701 implements MigrationInterface {
  name = 'CreateTodosTable1788713471701';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "todos" ADD "detalhe" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "detalhe"`);
  }
}
