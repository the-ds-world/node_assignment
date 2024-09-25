const bcrypt = require('bcrypt');

async function encrypt(str)
{
    const hash = await bcrypt.hash(str, 10);
    return hash;
}

async function compare(str, hash)
{
    const result = await bcrypt.compare(str, hash);
    return result;
}

module.exports = {encrypt, compare};