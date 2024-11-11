import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("usuario")
export class Usuario {
    @PrimaryGeneratedColumn()
    idUsuario: number;

    @Column({ length: 45, nullable: false })
    nome: string;

    @Column({ length: 80, unique: true, nullable: false })
    email: string;

    @Column({ length: 45,  nullable: false  })
    telefone: string;

    @Column({ length: 255, nullable: false  })
    senha: string;

    @Column({ length: 15, default: "cliente", nullable: false  })
    permissao: string;

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
}
