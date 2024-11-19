import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddImagem1731977756462 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('produto', new TableColumn({
            name: 'imagem',
            type: 'varchar',
            length: '255',
            isNullable: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('produto', 'imagem');
    }
}
