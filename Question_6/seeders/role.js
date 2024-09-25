const Role = require('../models/Role');

const seed = async () => {
    await Role.deleteMany();

    const roles = [
        {role: 'admin'},
        {role: 'user'},
    ];

    await Role.insertMany(roles);
    console.log(`Role Seeder Successfully Implemented`);
}

module.exports = seed;