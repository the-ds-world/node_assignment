const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/ass2question6')
.then(()=>{
    console.log('MongoDB Connected Successfully');
})
.catch((err)=>{
    console.log(`Error : ${err}`);
})

module.exports = mongoose;