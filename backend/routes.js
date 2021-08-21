const axios = require("axios");
const express = require('express');
const router = express.Router();

const { CEP_API } = process.env || 'https://viacep.com.br/ws';

//Rota raiz
router.get('/', async (req, res) => {
    res.status(200).json(
        {
            "message": "API de pesquisa de CEP, projeto prático da segunda etapa do processo seletivo full stack Jr - vtrina 2021",
            "autor": "Alexander Roberto dos Santos",
            "rotas": {
                "/buscacep/:cep": "pesquisa por cep",
                "/:uf/:cidade/:logradouro": "pesquisa pelo logradouro"
            }
        }
    );
});

//Pesquisa por cep no formato: localhost:8080/buscacep/83330100
router.get('/buscacep/:cep', async (req, res) => {

    const busca = req.params.cep;

    //Remove caracteres separadores de cep (.-)
    const cep = busca.replace(/[\.-]/g, '');

    //Verifica se cep não está em branco, se o tamanho é idêntico a 8 e se contém somente caracteres númericos (0 a 9)
    if (cep && cep.length === 8 && !isNaN(cep)) {

        try {

            const response = await axios.get(`${CEP_API}/${cep}/json`);
            const data = response.data;

            //Verifica se não existe a propriedade erro no json de retorno
            if (!("erro" in data)) {
                res.status(200).json(data);
            } else {
                res.status(400).json({ 'error': true, 'message': 'CEP não encontrado' });
            }

        } catch (error) {
            res.status(400).json({ 'error': true, 'message': 'Erro ao realizar a requisição ao servidor' });
        }

    } else {
        res.status(400).json({ 'error': true, 'message': 'CEP inválido!' });
    }

});

/*
    Pesquisa por estado (uf), cidade e logradouro no formato: localhost:8080/pr/piraquara/antonio, 
    retorna uma lista de logradouros baseadas na pesquisa ou []
*/
router.get('/:uf/:cidade/:logradouro', async (req, res) => {

    try {

        //Pegando valores passados na url e atribuindo às variáveis correspondentes
        const { uf, cidade, logradouro } = req.params;
        const pesquisa = `${CEP_API}/${uf}/${cidade}/${logradouro}/json`;

        const response = await axios.get(pesquisa)
        const dados = response.data

        res.status(200).json(dados)

    } catch (error) {
        res.status(400).json({ "message": "Não foi possível encontrar o logradouro pesquisado" })
    }
});

module.exports = router;
