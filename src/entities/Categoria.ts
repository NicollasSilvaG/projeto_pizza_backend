import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Produto } from './Produto';

@Entity('categoria')
export class Categoria {
    @PrimaryGeneratedColumn()
    idCategoria: number;

    @Column({ type: 'varchar', length: 45 })
    tipo: string;

    @OneToMany(() => Produto, (produto) => produto.categoria)
    produtos: Produto[];
}
