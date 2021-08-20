const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config();

const PORT = process.env.PORT || 3000;


app.use(cors());

//Rotas da API
app.use('/buscacep', require('./routes'));

//Execução do servidor
app.listen(PORT, () => {
    console.log(`Running on ${PORT}`);
});