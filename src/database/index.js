import pkg from 'mongoose';
const { set, connect } = pkg;

set('useCreateIndex', true);
connect('mongodb://localhost:27017/apisendemail',{
    useNewUrlParser:true,
    useUnifiedTopology: true
});

export default pkg;