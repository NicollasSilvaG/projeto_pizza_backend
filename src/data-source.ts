import { DataSource } from "typeorm";
import { Autenticacao1731022435641 } from "./db/typeorm/migrations/1731022435641-autenticacao";
import { Autenticacao } from "./entities/Autenticacao";

export const AppDataSource = new DataSource({
    type: "postgres",
  host: "localhost",
  port: 5432,
  username: "dompizzas",
  password: "201202",
  database: "dompizzas",
    entities: [Autenticacao],
    migrations: [ Autenticacao1731022435641],
    synchronize: true,

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
