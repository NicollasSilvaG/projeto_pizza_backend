import { MigrationInterface, QueryRunner, Table  } from "typeorm";

export class Usuario1731022403646 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "usuario",
                columns: [
                    { name: "idUsuario", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                    { name: "nome", type: "varchar", length: "45" },
                    { name: "email", type: "varchar", length: "45" },
                    { name: "telefone", type: "varchar", length: "45" },
                    { name: "rua", type: "varchar", length: "45" },
                    { name: "cidade", type: "varchar", length: "45" },
                    { name: "uf", type: "varchar", length: "2" },
                    { name: "cep", type: "varchar", length: "45" },
                    { name: "bairro", type: "varchar", length: "45" },
                    { name: "complemento", type: "varchar", length: "45" },
                    { name: "permissao", type: "varchar", length: "10" },
                    { name: "senha", type: "varchar", length: "45" },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("usuario");
    }
}
