const Role = require('../models/Role');
const User = require('../models/User');
const {encrypt} = require('../functions/hashing');

const seed = async () => {
    const admin = await Role.findOne({role: 'admin'});
    const users = [
        {name: 'devang shah', email: 'devang@gmail.com', password: await encrypt('dev@123'), role_id: admin._id}
    ];

    await User.deleteMany();
    await User.insertMany(users);

    console.log(`User Seeder Implemented Successfully`);
}

module.exports = seed;