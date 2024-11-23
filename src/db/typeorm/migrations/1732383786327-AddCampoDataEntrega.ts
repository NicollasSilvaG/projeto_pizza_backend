import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddDataEntregaToEntrega1731530000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'entrega',
            new TableColumn({
                name: 'dataEntrega',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP', // Valor padrão é a data e hora atual
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('entrega', 'dataEntrega');
    }
}
