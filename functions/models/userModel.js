const bcrypt = require('bcrypt');

class User {
    constructor(fullName, email, password, phone, rol, providerId) {
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.rol = rol;
        this.password = this.setPassword(password);
        this.providerId = providerId;
    }

    setPassword(password) {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        return bcrypt.hashSync(password, salt);
    }

    validatePassword(password) {
        return bcrypt.compareSync(password, this.password);
    }
}

module.exports = User;
