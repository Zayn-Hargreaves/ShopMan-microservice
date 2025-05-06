const OrderRepository = require("./OrderRepository")
const initializeModels = require("../../application/models/index")
class RepositoryFactory {
    constructor() {
        this.models = null;
        this.repositories = {};
    }

    async initialize() {
        if (!this.models) {
            this.models = await initializeModels();
            this.repositories = {
                OrderRepository: new OrderRepository(this.models),
            };
        }
    }

    getRepository(repoName) {
        if (!this.repositories[repoName]) {
            throw new Error(`Repository ${repoName} not found`);
        }
        return this.repositories[repoName];
    }
}

const factory = new RepositoryFactory();

module.exports = factory