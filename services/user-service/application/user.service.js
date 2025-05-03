const RepositoryFactory = require("../infratructure/repository/repositoryFactory")
const { NotFoundError } = require("../shared/cores/error.response")
class UserService{
    static async getUserProfile(id){
        await RepositoryFactory.initialize()
        const UserRepository = RepositoryFactory.getRepository("UserRepository")
        const AddressRepository = RepositoryFactory.getRepository("AddressRepository")
        const user = await UserRepository.findById(id)
        const address = await AddressRepository.findAddressByUserId(id)
        if(!user){
            throw NotFoundError("An error occured")
        }
        return {user, address}
    }
    static async updateUserProfile(id, {user, address}){
        await RepositoryFactory.initialize()
        const UserRepository = RepositoryFactory.getRepository("UserRepository")
        const AddressRepository = RepositoryFactory.getRepository("AddressRepository")
        try {
            await UserRepository.updateUserProfile(id,{user})
            await AddressRepository.updateUserAddress(id,{address})
            return true
        } catch (error) {
            console.log(error)            
        }
    }
}

module.exports = UserService