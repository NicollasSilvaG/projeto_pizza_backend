import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Pedido } from "./Pedido";
import { Carrinho } from "./Carrinho";

@Entity("usuario")
export class Usuario {
    @PrimaryGeneratedColumn()
    idUsuario: number;

    @Column({ length: 45, nullable: false })
    nome: string;

    @Column({ length: 80, unique: true, nullable: false })
    email: string;

    @Column({ length: 45,  nullable: true  })
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

    @OneToMany(() => Pedido, (pedido) => pedido.usuario)
    pedidos: Pedido[];

    @OneToMany(() => Carrinho, (carrinho) => carrinho.usuario)
    carrinhos: Carrinho[];  
}
