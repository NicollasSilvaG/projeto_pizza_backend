import { DataSource } from "typeorm";// Entidade Pedido
import { Pedido } from "./entities/Pedido";
import { PedidoProduto } from "./entities/PedidoProduto";
import { Pedido1731532000000 } from "./db/typeorm/migrations/1731532000000-Pedido";
import { PedidoProduto1731532121974 } from "./db/typeorm/migrations/1731532121974-PedidoProduto";
import { Cupom } from "./entities/Cupom";
import { Cupom1731531000000 } from "./db/typeorm/migrations/1731531000000-cupom";
import { Entrega1731530000000 } from "./db/typeorm/migrations/1731530000000-entrega";
import { Entrega } from "./entities/Entrega";
import { Usuario1731162498445 } from "./db/typeorm/migrations/1731162498445-usuario";
import { Usuario } from "./entities/Usuario";
import { Produto1731371833892 } from "./db/typeorm/migrations/1731371833892-produto";
import { Produto } from "./entities/Produto";
import { Categoria } from "./entities/Categoria";
import { Categoria1731371807369 } from "./db/typeorm/migrations/1731371807369-categoria";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "dompizzas",
    password: "201202",
    database: "dompizzas",
    entities: [Pedido, PedidoProduto, Cupom, Entrega, Usuario, Produto, Categoria],  // Inclui todas as entidades
    migrations: [
        Categoria1731371807369,
        Produto1731371833892,

        // Em seguida, criamos as tabelas que podem ter referências a outras
        Usuario1731162498445,
        Cupom1731531000000,
        Entrega1731530000000,

        // Depois criamos a tabela Pedido que depende de Usuario, Cupom e Entrega
        Pedido1731532000000,

        // Finalmente criamos a tabela de junção PedidoProduto que depende de Pedido e Produto
        PedidoProduto1731532121974, // Depois as migrações restantes
    ],
    synchronize: false,  // Deixe como false em produção para não criar tabelas automaticamente
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source inicializado com sucesso!");
        // Executando migrações (se necessário)
        AppDataSource.runMigrations()
            .then(() => {
                console.log("Migrações aplicadas com sucesso!");
            })
            .catch((err) => {
                console.error("Erro ao aplicar as migrações", err);
            });
    })
    .catch((err) => {
        console.error("Erro ao inicializar o Data Source", err);
    });
