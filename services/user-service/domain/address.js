class Address {
    constructor({ id, UserId, address_type = 'main', pincode, address, city, country }) {
        this.id = id;
        this.UserId = UserId;
        this.address_type = address_type;
        this.pincode = pincode;
        this.address = address;
        this.city = city;
        this.country = country;
    }

    isMainAddress() {
        return this.address_type === 'main';
    }

    updateDetails({ address_type, pincode, address, city, country }) {
        this.address_type = address_type || this.address_type;
        this.pincode = pincode || this.pincode;
        this.address = address || this.address;
        this.city = city || this.city;
        this.country = country || this.country;
    }
}

module.exports = Address;