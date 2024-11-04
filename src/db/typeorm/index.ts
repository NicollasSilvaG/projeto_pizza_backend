import { DataSource } from "typeorm";
import {CriarCliente1727391488329} from "./1727391488329-CriarCliente";


export const dataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "dompizzas",
    password: "201202",
    database: "dompizzas",
    entities: [],
    migrations: [CriarCliente1727391488329]
})