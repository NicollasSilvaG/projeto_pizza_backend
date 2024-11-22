import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterColumnPorcentagem1732222752363 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Alterando a coluna 'porcentagem_desconto' para o tipo INT em PostgreSQL
        await queryRunner.query(`
            ALTER TABLE cupom
            ALTER COLUMN porcentagem_desconto 
            TYPE INT 
            USING REGEXP_REPLACE(porcentagem_desconto, '%', '')::INTEGER;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revertendo a coluna 'porcentagem_desconto' para VARCHAR(255)
        await queryRunner.query(`
            ALTER TABLE cupom
            ALTER COLUMN porcentagem_desconto TYPE VARCHAR(255);
        `);
    }
}
