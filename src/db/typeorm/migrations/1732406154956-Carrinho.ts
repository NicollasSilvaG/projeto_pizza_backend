import { MigrationInterface, QueryRunner, Table} from "typeorm";

export class Carrinho1732406154956 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'carrinho',
            columns: [
                {
                    name: 'idCarrinho',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'idUsuario',
                    type: 'int',
                },
                {
                    name: 'status',
                    type: 'varchar',
                    length: '100',
                    default: "'ativo'", // Status padrão para carrinho ativo
                },
            ],
            foreignKeys: [
                {
                    columnNames: ['idUsuario'],
                    referencedTableName: 'usuario',
                    referencedColumnNames: ['idUsuario'],
                    onDelete: 'CASCADE',
                },
                {
                    columnNames: ['idEntrega'],
                    referencedTableName: 'entrega',
                    referencedColumnNames: ['idEntrega'],
                    onDelete: 'SET NULL',
                },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('carrinho');
    }

}
