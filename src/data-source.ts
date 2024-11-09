import { DataSource } from "typeorm";
import { Usuario } from "./entities/Usuario";
import { Usuario1731162498445 } from "./db/typeorm/migrations/1731162498445-usuario";

export const AppDataSource = new DataSource({
    type: "postgres",
  host: "localhost",
  port: 5432,
  username: "dompizzas",
  password: "201202",
  database: "dompizzas",
    entities: [Usuario],
    migrations: [ Usuario1731162498445],
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
