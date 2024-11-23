import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class Pedido1731532000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'pedido',
                columns: [
                    {
                        name: 'idPedido',
                        type: 'serial',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                        length: '100',
                    },
                
                    {
                        name: 'idEntrega',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'tipo_pagamento',
                        type: 'enum',
                        enum: ['dinheiro', 'pix', 'debito', 'credito'],
                    },
                    {
                        name: 'idUsuario',
                        type: 'integer',
                        isNullable: false,

                    },
                    {
                        name: 'dataPedido',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP', // Valor padrão é a data e hora atual
                    },
                ],
            })
        );


        await queryRunner.createForeignKey(
            'pedido',
            new TableForeignKey({
                columnNames: ['idEntrega'],
                referencedTableName: 'entrega',
                referencedColumnNames: ['idEntrega'],
                onDelete: 'CASCADE',
            })
        );

        await queryRunner.createForeignKey(
            'pedido',
            new TableForeignKey({
                columnNames: ['idUsuario'],
                referencedTableName: 'usuario',
                referencedColumnNames: ['idUsuario'],
                onDelete: 'CASCADE',
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('pedido');
    }
}
