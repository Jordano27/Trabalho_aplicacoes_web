const animalModel = require('../models/animalModel');

const tamanhosValidos = ['small', 'medium', 'large'];
const statusValidos = ['available', 'adopted'];

const animalService = {
    getAll() {
        return animalService.listar();
    },

    getAvailable() {
        return animalService.listarDisponiveis();
    },

    getById(id) {
        return animalService.buscarPorId(id);
    },

    create(dadosAnimal) {
        return animalService.criar(dadosAnimal);
    },

    update(id, dadosAnimal) {
        return animalService.atualizar(id, dadosAnimal);
    },

    delete(id) {
        return animalService.remover(id);
    },

    async listar() {
        return await animalModel.listarTodos();
    },

    async listarDisponiveis() {
        return await animalModel.listarDisponiveis();
    },

    async buscarPorId(id) {
        const animal = await animalModel.buscarPorId(id);
        if (!animal) {
            throw new Error('Pet não encontrado');
        }
        return animal;
    },

    async criar(dadosAnimal) {
        const { name, species, size } = dadosAnimal;

        if (!name || !species || !size) {
            throw new Error('Nome, espécie e porte são obrigatórios');
        }

        if (!tamanhosValidos.includes(size)) {
            throw new Error('Porte inválido. Use: small, medium ou large');
        }

        const id = await animalModel.criar(dadosAnimal);
        return await animalModel.buscarPorId(id);
    },

    async atualizar(id, dadosAnimal) {
        const animal = await animalModel.buscarPorId(id);
        if (!animal) {
            throw new Error('Pet não encontrado');
        }

        if (dadosAnimal.size && !tamanhosValidos.includes(dadosAnimal.size)) {
            throw new Error('Porte inválido. Use: small, medium ou large');
        }

        if (dadosAnimal.status && !statusValidos.includes(dadosAnimal.status)) {
            throw new Error('Status inválido. Use: available ou adopted');
        }

        await animalModel.atualizar(id, dadosAnimal);
        return await animalModel.buscarPorId(id);
    },

    async remover(id) {
        const animal = await animalModel.buscarPorId(id);
        if (!animal) {
            throw new Error('Pet não encontrado');
        }

        if (animal.status === 'adopted') {
            throw new Error('Não é possível remover um pet adotado');
        }

        const removido = await animalModel.remover(id);
        if (!removido) {
            throw new Error('Erro ao remover pet');
        }

        return { message: 'Pet removido com sucesso' };
    },
};

module.exports = animalService;
