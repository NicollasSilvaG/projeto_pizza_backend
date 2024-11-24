import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class StatusADDpedidoProduto1732481027589 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "pedido_e_produto", // Nome da tabela
            new TableColumn({
                name: "status", // Nome da nova coluna
                type: "varchar", // Tipo de dado
                isNullable: true, // Permitir valores nulos inicialmente (pode ser ajustado conforme necessidade)
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("pedido_e_produto", "status");
    }
}