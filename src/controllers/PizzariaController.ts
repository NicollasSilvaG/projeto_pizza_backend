import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Pizzaria } from '../entities/Pizzaria'; // Importando a entidade Pizzaria

export class PizzariaController {
  // Método para criar uma pizzaria
  public static async create(req: Request, res: Response): Promise<Response> {
    const { nome_fantasia, cpnj, rua, bairro, cidade, cep, uf, razao_social, horarioFuncionamento } = req.body;

    if (!nome_fantasia || !cpnj || !rua || !bairro || !cidade || !cep || !uf || !razao_social || !horarioFuncionamento) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    try {
      const pizzaria = new Pizzaria();
      pizzaria.nome_fantasia = nome_fantasia;
      pizzaria.cpnj = cpnj;
      pizzaria.rua = rua;
      pizzaria.bairro = bairro;
      pizzaria.cidade = cidade;
      pizzaria.cep = cep;
      pizzaria.uf = uf;
      pizzaria.razao_social = razao_social;
      pizzaria.horarioFuncionamento = horarioFuncionamento;

      await AppDataSource.manager.save(pizzaria);
      return res.status(201).json(pizzaria);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar a pizzaria', details: error });
    }
  }

  // Método para buscar todas as pizzarias
  public static async buscarTodasPizzarias(req: Request, res: Response): Promise<Response> {
    try {
      const pizzarias = await AppDataSource.getRepository(Pizzaria).find(); // Busca todas as pizzarias

      if (pizzarias.length === 0) {
        return res.status(404).json({ error: 'Nenhuma pizzaria encontrada.' });
      }

      return res.status(200).json(pizzarias); // Retorna todas as pizzarias
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar pizzarias', details: error });
    }
  }
}
