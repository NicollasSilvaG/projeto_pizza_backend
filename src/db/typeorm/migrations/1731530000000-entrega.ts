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
                    },
                    {
                        name: 'retirada',
                        type: 'varchar',
                        length: '45',
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                        length: '100',
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('entrega');
    }
}
