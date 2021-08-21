const axios = require("axios");
const express = require('express');
const router = express.Router();

const {CEP_API} = process.env || 'https://viacep.com.br/ws';

router.get('/:cep', async (req, res) => {

    const busca = req.params.cep;
    const cep = busca.replace(/[\.-]/g, '');

    if (cep && cep.length == 8 && !isNaN(cep)) {

        try {

            const response = await axios.get(`${CEP_API}/${cep}/json`);
            const data = response.data;

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

module.exports = router;
