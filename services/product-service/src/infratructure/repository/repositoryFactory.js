const ProductRepository = require("./Product.repository")
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

                ProductRepository: new ProductRepository(this.models)
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