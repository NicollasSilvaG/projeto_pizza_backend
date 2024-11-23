import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Entrega1731530000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'entrega',
                columns: [
                    {
                        name: 'idEntrega',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'entrega',
                        type: 'varchar',
                        length: '45',
                        isNullable: true,
                    },
                    {
                        name: 'retirada',
                        type: 'varchar',
                        length: '45',
                        isNullable: true,

                    },
                    {
                        name: 'status',
                        type: 'varchar',
                        length: '100',
                    },
                    {
                        name: 'dataEntrega',
                        type: 'timestamp', // Alterado para "timestamp"
                        default: 'CURRENT_TIMESTAMP', // Valor padrão é a data e hora atual
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('entrega');
    }
}
