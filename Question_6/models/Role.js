const mongoose = require('../db');

const roleSchema = mongoose.Schema({
    role: {
        required: true,
        type: String
    }
})

const Role = mongoose.model('Role', roleSchema);


module.exports = Role;