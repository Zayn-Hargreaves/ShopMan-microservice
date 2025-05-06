class User {
    constructor({ id, name, email, password, status = 'active' }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.status = status;
    }

    activate() {
        this.status = 'active';
    }

    deactivate() {
        this.status = 'inactive';
    }

    isActive() {
        return this.status === 'active';
    }
}

module.exports = User;