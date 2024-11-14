import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Categoria1731371807369 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "categoria",
                columns: [
                    {
                        name: "idCategoria",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "tipo",
                        type: "varchar",
                        length: "45",
                        isNullable: false
                    }
                ]
            }),
            true
        );
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("categoria");

    }

}
