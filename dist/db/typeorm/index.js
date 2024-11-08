import { DataSource } from "typeorm";
import { CriarUsuarios1730775960413 } from "./migrations/1730775960413-CriarUsuarios";
import { Usuario } from "../../entities/Usuario";
export const dataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "dompizzas",
    password: "201202",
    database: "dompizzas",
    entities: [Usuario],
    migrations: [CriarUsuarios1730775960413]
});
