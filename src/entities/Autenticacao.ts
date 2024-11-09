import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("autenticacao")
export class Autenticacao {
    @PrimaryGeneratedColumn()
    idAutenticacao: number;

    @Column({ length: 45 })
    login: string;

    @Column({ length: 70 })
    senha: string;

    @Column({ length: 45 })
    nome: string;
}
