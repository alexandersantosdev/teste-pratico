
const API_URL = 'http://localhost:8080';
var lista = []

window.onload = reset();

if (lista.length == 0) {
    $("#dados").html("Nenhum dado para aprensentar");
}

$("#pesquisar").click(() => {
    pesquisaLogradouro();

});

$(document).keyup(e => {
    if ($("#logradouro").is(":focus") && (e.keyCode == 13)) {
        pesquisaLogradouro();
    }
});

function pesquisaLogradouro() {
    $("#spinner").show()
    $("#pesquisar").prop("disabled", true)

    const uf = $("#uf").val();
    const cidade = $("#cidade").val();
    const logradouro = $("#logradouro").val();

    if ((uf === "" || uf === null) || (cidade === "" || cidade === null) || (logradouro === "" || logradouro === null)) {

        $("#message").show();
        $("#message").html("Dados inválidos, preencha todos os campos corretamente");

    } else {
        $.ajax({
            url: `${API_URL}/${uf}/${cidade}/${logradouro}`, async: true, success: function (response, _) {

                lista.push(response);
                populateTable();
            },
            error: (response, s) => {
                console.log(response.statusText)
                if (response.statusText == "error") {
                    $("#message").show();
                    $("#message").html("Erro ao requisitar dados da API");

                } else {
                    $("#message").show();
                    $("#message").html(response.responseJSON.message);
                }
            }
        });

    }
    setTimeout(() => reset(), 2000)
    return
}

function populateTable() {

    let listagem = '';
    console.log(lista)
    for (let i = 0; i < lista[0].length; i++) {
        listagem +=
            `<tr>
                <td>${lista[0][i].cep}</td>
                <td>${lista[0][i].logradouro}</td>
                <td>${lista[0][i].bairro}</td>
                <td>${lista[0][i].localidade}</td>
                <td>${lista[0][i].uf}</td>
                <td>${lista[0][i].ibge}</td>
                <td>${lista[0][i].ddd}</td>
            </tr>`
    }
    $("#dados").html(listagem);
}
function reset() {

    $("#spinner").hide()
    $("#message").hide();
    $("#uf").val("")
    $("#uf").focus();
    $("#cidade").val("")
    $("#logradouro").val("")
    $("#pesquisar").prop("disabled", false)
    lista = []

}
