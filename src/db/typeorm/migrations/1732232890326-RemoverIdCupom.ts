import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class RemoveIdCupomFromPedido1648256730482 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Verificar se a chave estrangeira existe antes de tentar removê-la
        const table = await queryRunner.getTable('pedido');
        const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.includes('idCupom'));
        
        // Remover a chave estrangeira se existir
        if (foreignKey) {
            await queryRunner.dropForeignKey('pedido', foreignKey);
        }

        // Remover a coluna 'idCupom' da tabela 'pedido'
        await queryRunner.dropColumn('pedido', 'idCupom');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Adicionar a coluna 'idCupom' novamente
        await queryRunner.addColumn('pedido', new TableColumn({
            name: 'idCupom',
            type: 'int',
            isNullable: true,  // Caso o cupom não seja obrigatório
        }));

        // Criar a chave estrangeira novamente
        await queryRunner.createForeignKey('pedido', new TableForeignKey({
            columnNames: ['idCupom'],
            referencedTableName: 'cupom',
            referencedColumnNames: ['idCupom'],
            onDelete: 'SET NULL',  // Quando o cupom for excluído, setar o valor de 'idCupom' como NULL
            onUpdate: 'CASCADE',  // Atualizar o valor de 'idCupom' quando houver atualização
        }));
    }
}
