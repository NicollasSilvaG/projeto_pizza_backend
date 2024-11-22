import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Cupom1731531000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'cupom',
                columns: [
                    {
                        name: 'idCupom',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'codigo',
                        type: 'varchar',
                        length: '20',
                        isNullable: false,
                    },
                    {
                        name: 'porcentagem_desconto',
                        type: 'int',
                        length: '10',
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                        length: '45',
                    },
                    {
                        name: 'quantidade',
                        type: 'int',
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('cupom');
    }
}