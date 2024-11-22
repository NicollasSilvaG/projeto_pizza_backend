import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddIdCupomToPedidoProduto1632229775486 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Adicionando a coluna 'idCupom' à tabela 'pedido_e_produto'
        await queryRunner.addColumn('pedido_e_produto', new TableColumn({
            name: 'idCupom',
            type: 'int',
            isNullable: true,  // Caso o cupom não seja obrigatório
        }));

        // Criando a chave estrangeira para a coluna 'idCupom'
        await queryRunner.createForeignKey('pedido_e_produto', new TableForeignKey({
            columnNames: ['idCupom'],  // Nome da coluna que será a chave estrangeira
            referencedTableName: 'cupom',  // Tabela referenciada
            referencedColumnNames: ['idCupom'],  // Coluna referenciada
            onDelete: 'SET NULL',  // Quando o cupom for excluído, setar o valor de 'idCupom' como NULL
            onUpdate: 'CASCADE',  // Atualizar o valor de 'idCupom' quando houver atualização
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remover a chave estrangeira
        const table = await queryRunner.getTable('pedido_e_produto');
        const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.includes('idCupom'));
        if (foreignKey) {
            await queryRunner.dropForeignKey('pedido_e_produto', foreignKey);
        }

        // Remover a coluna 'idCupom'
        await queryRunner.dropColumn('pedido_e_produto', 'idCupom');
    }
}
