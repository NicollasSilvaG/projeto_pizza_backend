import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("usuario")
export class Usuario {
    @PrimaryGeneratedColumn()
    idUsuario: number;

    @Column({ type: "varchar" })
    nome: string;

    @Column({ type: "varchar", unique: true })
    email: string;

    @Column({ type: "varchar", length: 11, nullable: true })
    telefone: string;

    @Column({ type: "varchar", length: 45, nullable: true })
    rua: string;

    @Column({ type: "varchar", length: 45, nullable: true })
    cidade: string;

    @Column({ type: "varchar", length: 2, nullable: true })
    uf: string;

    @Column({ type: "varchar", length: 45, nullable: true })
    cep: string;

    @Column({ type: "varchar", length: 45, nullable: true })
    bairro: string;

    @Column({ type: "varchar", length: 45, nullable: true })
    complemento: string;

    @Column({ type: "varchar", length: 10, default: "cliente" })
    permissao: string;
}
