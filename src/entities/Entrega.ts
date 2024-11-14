// src/entity/Entrega.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import { Pedido } from './Pedido';

@Entity('entrega')
export class Entrega {
    @PrimaryGeneratedColumn()
    idEntrega: number;

    @Column({ type: 'varchar', length: 45 })
    entrega: string;

    @Column({ type: 'varchar', length: 45 })
    retirada: string;

    @Column({ type: 'varchar', length: 100 })
    status: string;

    @OneToMany(() => Pedido, (pedido) => pedido.entrega)
    pedidos: Pedido[];
}
