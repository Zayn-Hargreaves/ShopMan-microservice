const AddressRepository = require("./address.repo")
const OtpRepository = require("./opt.repo")
const UserRepository = require("./user.repo")
const initializeModels = require("./models/index")
class RepositoryFactory {
    constructor() {
        this.models = null;
        this.repositories = {};
    }

    async initialize() {
        if (!this.models) {
            this.models = await initializeModels();
            this.repositories = {
                AddressRepository: new AddressRepository(this.models),

                OtpRepository: new OtpRepository(this.models),

                UserRepository: new UserRepository(this.models),

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