const NotificaitionRepository = require("./NotificationRepository")
const initializeModels = require("../../application/model/index")
class RepositoryFactory {
    constructor() {
        this.models = null;
        this.repositories = {};
    }

    async initialize() {
        if (!this.models) {
            this.models = await initializeModels();
            this.repositories = {
                NotificationRepository: new NotificaitionRepository(this.models),
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