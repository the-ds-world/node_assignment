const roleSeed = require('./seeders/role');
const userSeed = require('./seeders/user');

const seed = async () =>{
    console.log(`Seed DB started`);

    await roleSeed();
    await userSeed();

    console.log(`Seed DB completed`);
}

seed();