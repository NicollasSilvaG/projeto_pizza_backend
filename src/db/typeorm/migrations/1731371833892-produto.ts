import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class Produto1731371833892 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "produto",
                columns: [
                    {
                        name: "idProduto",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "nome",
                        type: "varchar",
                        length: "45",
                        isNullable: false
                    },
                    {
                        name: "quantidade",
                        type: "int",
                        isNullable: false
                    },
                    {
                        name: "preco",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                        isNullable: false
                    },
                    {
                        name: "descricao",
                        type: "varchar",
                        length: "200",
                        isNullable: false
                    },
                    {
                        name: "tamanho",
                        type: "varchar",
                        length: "45",
                        isNullable: false
                    },
                    {
                        name: "categoria_idCategoria",
                        type: "int",
                        isNullable: true
                    }
                ]
            }),
            true
        );

        await queryRunner.createForeignKey(
            "produto",
            new TableForeignKey({
                columnNames: ["categoria_idCategoria"],
                referencedColumnNames: ["idCategoria"],
                referencedTableName: "categoria",
                onDelete: "SET NULL"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("produto", "categoria_idCategoria");
        await queryRunner.dropTable("produto");
    }
}