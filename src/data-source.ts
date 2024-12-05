import { DataSource } from "typeorm";
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
import { Pizzaria } from "./entities/Pizzaria";
import { Categoria } from "./entities/Categoria";
import { Categoria1731371807369 } from "./db/typeorm/migrations/1731371807369-categoria";
import { Autenticacao } from "./entities/Autenticacao";
import { Autenticacao1731022435641 } from "./db/typeorm/migrations/1731022435641-autenticacao";
import { AddImagem1731977756462 } from "./db/typeorm/migrations/1731977756462-AddImagem";
import { AlterColumnPorcentagem1732222752363 } from "./db/typeorm/migrations/1732222752363-AlterColumnPorcentagem";
import { AddIdCupomToPedidoProduto1632229775486 } from "./db/typeorm/migrations/1732229775486-AddColumnPedProd";
import { RemoveIdCupomFromPedido1648256730482 } from "./db/typeorm/migrations/1732232890326-RemoverIdCupom";
import { AddDataEntregaToEntrega1731530000000 } from "./db/typeorm/migrations/1732383786327-AddCampoDataEntrega";
import { AddCampoDataPedido1732384017204 } from "./db/typeorm/migrations/1732384017204-AddCampoDataPedido";
import { Pizzaria1732395325715 } from "./db/typeorm/migrations/1732395325715-Pizzaria";
import { Carrinho1732406154956 } from "./db/typeorm/migrations/1732406154956-Carrinho";
import { Carrinho } from "./entities/Carrinho";
import { AddCarrinhoToPedidoProduto1691532000000 } from "./db/typeorm/migrations/1732406825408-AddCarrinhoAoPedido";
import { StatusADDpedidoProduto1732481027589 } from "./db/typeorm/migrations/1732481027589-StatusADDpedido_produto";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "dompizzas",
    password: "201202",
    database: "dompizzas",
    entities: [Pedido, PedidoProduto, Cupom, Entrega, Usuario, Produto, Categoria, Autenticacao, Pizzaria, Carrinho ],  
    migrations: [
        Categoria1731371807369,
        Produto1731371833892,

        Usuario1731162498445,
        Cupom1731531000000,
        Entrega1731530000000,

        Pedido1731532000000,

        PedidoProduto1731532121974, 
        Autenticacao1731022435641,
        AddImagem1731977756462,
        AlterColumnPorcentagem1732222752363,
        AddIdCupomToPedidoProduto1632229775486,
        AddDataEntregaToEntrega1731530000000,
        AddCampoDataPedido1732384017204,
        Pizzaria1732395325715,
        Carrinho1732406154956,
        AddCarrinhoToPedidoProduto1691532000000,
        StatusADDpedidoProduto1732481027589
        //RemoveIdCupomFromPedido1648256730482

    ],
    synchronize: false, 
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source inicializado com sucesso!");
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
