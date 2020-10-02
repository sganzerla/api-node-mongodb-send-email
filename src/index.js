import pkg from 'express';
const app = pkg();
import router from './router.js';

app.use(pkg.json());
app.use(router);

app.listen(3000);