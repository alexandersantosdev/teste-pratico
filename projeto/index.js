const express = require('express');
const app = express();
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');

require('dotenv').config();

const PORT = process.env.PORT || 8080;

app.use('/public', express.static(process.cwd() + '/public'));
app.set('view engine', 'ejs');
app.use(cors());

//Rotas da API
app.use('/', require('./routes'));

//Rota da documentação da API
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

//Tratando rota(s) inexistente(s)
app.use((req, res, next) => {
    res.status(404).json(
        { "message": "Esta rota não existe" }
    );
});


//Execução do servidor
app.listen(PORT, () => {
    console.log(`Running on ${PORT}`);
});
