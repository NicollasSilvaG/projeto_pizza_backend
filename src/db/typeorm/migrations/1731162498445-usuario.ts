import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Usuario1731162498445 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
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
                        length: "45",
                        isNullable: false, // Campo não pode ser nulo
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "80",
                        isUnique: true,
                        isNullable: false, // Campo não pode ser nulo
                    },
                    {
                        name: "telefone",
                        type: "varchar",
                        length: "45", // Ajustado para o tamanho do telefone
                        isNullable: false, 
                    },
                    {
                        name: "senha",
                        type: "varchar",
                        length: "255", // Aumentado para suportar senhas criptografadas
                        isNullable: false, // Campo não pode ser nulo
                    },
                    {
                        name: "permissao",
                        type: "varchar",
                        length: "15", // Ajustado para o tamanho do campo de permissao
                        default: "'cliente'", // Valor padrão
                        isNullable: false, // Campo não pode ser nulo
                    },
                    {
                        name: "rua",
                        type: "varchar",
                        length: "45",
                        isNullable: false, // Permitindo nulo
                    },
                    {
                        name: "cidade",
                        type: "varchar",
                        length: "45",
                        isNullable: false, // Permitindo nulo
                    },
                    {
                        name: "uf",
                        type: "varchar",
                        length: "2",
                        isNullable: false, // Permitindo nulo
                    },
                    {
                        name: "cep",
                        type: "varchar",
                        length: "45",
                        isNullable: false, // Permitindo nulo
                    },
                    {
                        name: "bairro",
                        type: "varchar",
                        length: "45",
                        isNullable: false, // Permitindo nulo
                    },
                    {
                        name: "complemento",
                        type: "varchar",
                        length: "45",
                        isNullable: false, // Permitindo nulo
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("usuario");
    }
}
