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

  // Método para atualizar uma pizzaria
  public static async atualizarPizzaria(req: Request, res: Response): Promise<Response> {
    const { idPizzaria } = req.params;
    const { nome_fantasia, cpnj, rua, bairro, cidade, cep, uf, razao_social, horarioFuncionamento } = req.body;

    if (!idPizzaria) {
      return res.status(400).json({ error: 'ID da pizzaria é obrigatório.' });
    }

    try {
      const pizzariaRepository = AppDataSource.getRepository(Pizzaria);
      const pizzaria = await pizzariaRepository.findOneBy({ idPizzaria: parseInt(idPizzaria, 10) });

      if (!pizzaria) {
        return res.status(404).json({ error: `Pizzaria com ID ${idPizzaria} não encontrada.` });
      }

      // Atualiza apenas os campos fornecidos no corpo da requisição
      pizzaria.nome_fantasia = nome_fantasia ?? pizzaria.nome_fantasia;
      pizzaria.cpnj = cpnj ?? pizzaria.cpnj;
      pizzaria.rua = rua ?? pizzaria.rua;
      pizzaria.bairro = bairro ?? pizzaria.bairro;
      pizzaria.cidade = cidade ?? pizzaria.cidade;
      pizzaria.cep = cep ?? pizzaria.cep;
      pizzaria.uf = uf ?? pizzaria.uf;
      pizzaria.razao_social = razao_social ?? pizzaria.razao_social;
      pizzaria.horarioFuncionamento = horarioFuncionamento ?? pizzaria.horarioFuncionamento;

      await pizzariaRepository.save(pizzaria);

      return res.status(200).json({ message: 'Pizzaria atualizada com sucesso.', pizzaria });
    } catch (error) {
      console.error('Erro ao atualizar a pizzaria:', error);
      return res.status(500).json({ error: 'Erro ao atualizar a pizzaria.', details: error });
    }
  }

  // Método para deletar uma pizzaria
  public static async deletarPizzaria(req: Request, res: Response): Promise<Response> {
    const { idPizzaria } = req.params;

    if (!idPizzaria) {
      return res.status(400).json({ error: 'ID da pizzaria é obrigatório.' });
    }

    try {
      const pizzariaRepository = AppDataSource.getRepository(Pizzaria);
      const pizzaria = await pizzariaRepository.findOneBy({ idPizzaria: parseInt(idPizzaria, 10) });

      if (!pizzaria) {
        return res.status(404).json({ error: `Pizzaria com ID ${idPizzaria} não encontrada.` });
      }

      // Deleta a pizzaria
      await pizzariaRepository.remove(pizzaria);

      return res.status(200).json({ message: `Pizzaria com ID ${idPizzaria} deletada com sucesso.` });
    } catch (error) {
      console.error('Erro ao deletar a pizzaria:', error);
      return res.status(500).json({ error: 'Erro ao deletar a pizzaria.', details: error });
    }
  }
}
