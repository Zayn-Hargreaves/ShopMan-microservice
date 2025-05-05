const Address = require('../../domain/address');

class AddressRepository {
    constructor(models) {
        this.AddressModel = models.Address; // Sequelize model
    }

    async findAddressByUserId({ UserId, address_type = 'main' }) {
        const addressData = await this.AddressModel.findOne({
            where: {
                UserId: UserId,
                address_type: address_type
            },
            raw: true
        });
        if (!addressData) return null;

        return new Address(addressData);
    }

    async getListAddress(UserId) {
        const addressList = await this.AddressModel.findAll({
            where: {
                UserId: UserId,
            },
            raw: true
        });

        return addressList.map(data => new Address(data));
    }

    async createAddress({ UserId, address_type, pincode, address, city, country }) {
        const newAddress = await this.AddressModel.create({
            UserId,
            address_type,
            pincode,
            address,
            city,
            country
        });

        return new Address(newAddress.get({ plain: true }));
    }

    async updateUserAddress(UserId, { address_type = 'main', pincode, address, city, country }) {
        await this.AddressModel.update({
            address_type,
            pincode,
            address,
            city,
            country,
        }, {
            where: {
                UserId: UserId
            }
        });

        return this.findAddressByUserId({ UserId, address_type });
    }
}

module.exports = AddressRepository;