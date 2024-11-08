import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Autenticacao1731022435641 implements MigrationInterface {
     public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "autenticacao",
                columns: [
                    { name: "idAutenticacao", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                    { name: "login", type: "varchar", length: "45" },
                    { name: "senha", type: "varchar", length: "45" },
                    { name: "nome", type: "varchar", length: "45" },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("autenticacao");
    }
}