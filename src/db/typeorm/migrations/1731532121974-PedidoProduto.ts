import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class PedidoProduto1731532121974 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Criando a tabela pedido_e_produto
        await queryRunner.createTable(
            new Table({
                name: 'pedido_e_produto',
                columns: [
                    {
                        name: 'idPedidoProduto',
                        type: 'serial',
                        isPrimary: true,
                    },
                    {
                        name: 'idPedido',
                        type: 'integer',
                    },
                    {
                        name: 'idProduto',
                        type: 'integer',
                    },
                    {
                        name: 'quantidade',
                        type: 'int',
                        default: 1,
                    },
                    {
                        name: 'precoUnitario',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'desconto',
                        type: 'decimal',
                        precision: 5,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'valorTotal',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'observacoes',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    // Adicionando a coluna 'idCupom'
                    {
                        name: 'idCupom',
                        type: 'integer',
                        isNullable: true,  // Caso o cupom não seja obrigatório
                    },
                ],
            })
        );

        // Adicionando as chaves estrangeiras
        await queryRunner.createForeignKey(
            'pedido_e_produto',
            new TableForeignKey({
                columnNames: ['idPedido'],
                referencedTableName: 'pedido',
                referencedColumnNames: ['idPedido'],
                onDelete: 'CASCADE',
            })
        );

        await queryRunner.createForeignKey(
            'pedido_e_produto',
            new TableForeignKey({
                columnNames: ['idProduto'],
                referencedTableName: 'produto',
                referencedColumnNames: ['idProduto'],
                onDelete: 'CASCADE',
            })
        );

        // Adicionando a chave estrangeira para 'idCupom'
        await queryRunner.createForeignKey(
            'pedido_e_produto',
            new TableForeignKey({
                columnNames: ['idCupom'],
                referencedTableName: 'cupom',
                referencedColumnNames: ['idCupom'],
                onDelete: 'SET NULL',  // Quando o cupom for excluído, o valor de 'idCupom' será setado para NULL
                onUpdate: 'CASCADE',  // Quando o cupom for atualizado, a alteração será propagada
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Verificando se a tabela 'pedido_e_produto' existe antes de tentar acessar as chaves estrangeiras
        const table = await queryRunner.getTable('pedido_e_produto');
        if (table) {
            // Remover as chaves estrangeiras
            const foreignKeys = table.foreignKeys.filter(
                (fk) => fk.columnNames.indexOf('idPedido') !== -1 || fk.columnNames.indexOf('idProduto') !== -1 || fk.columnNames.indexOf('idCupom') !== -1
            );
            await queryRunner.dropForeignKeys('pedido_e_produto', foreignKeys);
        }

        // Remover a tabela pedido_e_produto
        await queryRunner.dropTable('pedido_e_produto');
    }
}
