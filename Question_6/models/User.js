const mongoose = require('../db');
const Role = require('./Role');

const userSchema = mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    email: {
        required: true,
        unique: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    role_id: {
        required: true,
        type: mongoose.Types.ObjectId,
        ref: Role
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;