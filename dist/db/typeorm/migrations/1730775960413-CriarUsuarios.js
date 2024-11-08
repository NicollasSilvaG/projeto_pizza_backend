import { Table, TableCheck } from "typeorm";
export class CriarUsuarios1730775960413 {
    async up(queryRunner) {
        await queryRunner.createTable(new Table({
            name: "usuario",
            columns: [
                {
                    name: "idUsuario",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "nome",
                    type: "varchar",
                },
                {
                    name: "email",
                    type: "varchar",
                    isUnique: true,
                },
                {
                    name: "telefone",
                    type: "varchar",
                    length: "11",
                    isNullable: true,
                },
                {
                    name: "rua",
                    type: "varchar",
                    isNullable: true,
                },
                {
                    name: "cidade",
                    type: "varchar",
                    isNullable: true,
                },
                {
                    name: "uf",
                    type: "varchar",
                    length: "2",
                    isNullable: true,
                },
                {
                    name: "cep",
                    type: "varchar",
                    length: "8",
                    isNullable: true,
                },
                {
                    name: "bairro",
                    type: "varchar",
                    isNullable: true,
                },
                {
                    name: "complemento",
                    type: "varchar",
                    isNullable: true,
                },
                {
                    name: "permissao",
                    type: "varchar",
                    length: "10",
                    default: "'cliente'",
                },
            ],
        }));
        await queryRunner.createCheckConstraint("usuario", new TableCheck({
            name: "CHK_usuario_permissao",
            expression: "permissao IN ('admin', 'cliente')"
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("usuario");
    }
}
