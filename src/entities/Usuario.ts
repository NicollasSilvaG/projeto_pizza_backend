import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("usuario")
export class Usuario {
    @PrimaryGeneratedColumn()
    idUsuario: number;

    @Column({ length: 45 })
    nome: string;

    @Column({ length: 45 })
    email: string;

    @Column({ length: 45 })
    telefone: string;

    @Column({ length: 45 })
    rua: string;

    @Column({ length: 45 })
    cidade: string;

    @Column({ length: 2 })
    uf: string;

    @Column({ length: 45 })
    cep: string;

    @Column({ length: 45 })
    bairro: string;

    @Column({ length: 45 })
    complemento: string;

    @Column({ length: 10 })
    permissao: string;

    @Column({ length: 45 })
    senha: string;
}
