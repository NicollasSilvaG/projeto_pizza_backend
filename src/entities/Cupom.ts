// src/entity/Cupom.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Pedido } from './Pedido';
import { PedidoProduto } from './PedidoProduto';  

@Entity('cupom')
export class Cupom {
    @PrimaryGeneratedColumn()
    idCupom: number;

    @Column({ type: 'varchar', length: 20, nullable: false })
    codigo: string;

    @Column({ type: 'varchar', length: 5,  })
    porcentagem_desconto: string; 

    @Column({ type: 'varchar', length: 45 })
    status: string;

    @Column({ type: 'int' })
    quantidade: number;

  

    @OneToMany(() => PedidoProduto, pedidoProduto => pedidoProduto.cupom)
    pedidoProdutos: PedidoProduto[];  
  }

