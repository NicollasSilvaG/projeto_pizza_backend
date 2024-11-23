import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCampoDataPedido1732384017204 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'pedido',
            new TableColumn({
                name: 'dataPedido',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {~
        await queryRunner.dropColumn('pedido', 'dataPedido');

    }

}
