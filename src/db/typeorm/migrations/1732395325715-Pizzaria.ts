import { MigrationInterface, QueryRunner } from "typeorm";

export class Pizzaria1732395325715 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          CREATE TABLE pizzaria (
            "idPizzaria" SERIAL PRIMARY KEY,
            "nome_fantasia" VARCHAR(45) NOT NULL,
            "cpnj" VARCHAR(45) NOT NULL,
            "rua" VARCHAR(45) NOT NULL,
            "bairro" VARCHAR(45) NOT NULL,
            "cidade" VARCHAR(45) NOT NULL,
            "cep" VARCHAR(45) NOT NULL,
            "uf" VARCHAR(45) NOT NULL,
            "razao_social" VARCHAR(45) NOT NULL,
            "horarioFuncionamento" VARCHAR(45) NOT NULL
          );
        `);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE pizzaria');
      }
    }