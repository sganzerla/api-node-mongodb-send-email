const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost:27017/apisendemail',{
    useNewUrlParser:true,
    useUnifiedTopology: true
});
mongoose.Promise = global.Promise;

module.exports = mongoose;