import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CriarCliente1727391488329 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
                name: "cliente",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                     {
                        name: "nome",
                        type: "varchar",
                    },
                    {
                        name: "email",
                        type: "varchar",
                    },
                    {
                        name: "telefone",
                        type: "varchar",
                    },
                    {
                        name: "rua",
                        type: "varchar",
                    },
                    {
                        name: "cidade",
                        type: "varchar",
                    },
                    {
                        name: "uf",
                        type: "varchar",
                    },
                    {
                        name: "cep",
                        type: "varchar",
                    },
                    {
                        name: "bairro",
                        type: "varchar",
                    },
                    {
                        name: "complemento",
                        type: "varchar",
                        isNullable: true,
                    },

                ]
            }));
        }
    

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("cliente");
    }

}
