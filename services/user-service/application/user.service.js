const RepositoryFactory = require("../infratructure/repository/repositoryFactory")
const { NotFoundError } = require("../shared/cores/error.response")
const RedisService = require("./redis.service")
class UserService{
    static async getUserProfile(id){
        await RepositoryFactory.initialize()
        const UserRepository = RepositoryFactory.getRepository("UserRepository")
        const AddressRepository = RepositoryFactory.getRepository("AddressRepository")
        const cacheKey = `user:id:${id}`
        let data = RedisService.getCachedData(cacheKey)
        if(!data){
            const user = await UserRepository.findById(id)
            const address = await AddressRepository.findAddressByUserId(id)
            data = {user, address}
            if(!user){
                throw NotFoundError("An error occured")
            }
            await RedisService.cacheData(cacheKey, data, 3600)
        }
        return {data}
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
            throw new Error(error)         
        }
    }
}

module.exports = UserService