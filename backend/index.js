const express = require('express');
const app = express();
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');

require('dotenv').config();

const PORT = process.env.PORT || 3000;


app.use(cors());

//Rotas da API
app.use('/buscacep', require('./routes'));

//Rota da documentação da API
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

//Execução do servidor
app.listen(PORT, () => {
    console.log(`Running on ${PORT}`);
});