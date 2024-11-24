import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class AddCarrinhoToPedidoProduto1691532000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Adicionando a coluna idCarrinho na tabela pedido_e_produto
        await queryRunner.addColumn(
            'pedido_e_produto',
            new TableColumn({
                name: 'idCarrinho',
                type: 'integer',
                isNullable: true, // O carrinho pode ser nulo, caso o produto ainda esteja no carrinho
            })
        );

        // Criando a chave estrangeira para o campo idCarrinho
        await queryRunner.createForeignKey(
            'pedido_e_produto',
            new TableForeignKey({
                columnNames: ['idCarrinho'],
                referencedTableName: 'carrinho',
                referencedColumnNames: ['idCarrinho'],
                onDelete: 'SET NULL', // Quando o carrinho for deletado, a referência será null
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Recuperando a tabela 'pedido_e_produto'
        const table = await queryRunner.getTable('pedido_e_produto');

        // Verificando se a tabela foi encontrada antes de remover a chave estrangeira
        if (table) {
            const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('idCarrinho') !== -1);
            if (foreignKey) {
                await queryRunner.dropForeignKey('pedido_e_produto', foreignKey);
            }

            // Removendo a coluna idCarrinho
            await queryRunner.dropColumn('pedido_e_produto', 'idCarrinho');
        }
    }
}
