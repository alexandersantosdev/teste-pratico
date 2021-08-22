
const API_URL = 'http://localhost:8080/buscacep';
const ceps = []
const GEO_API = "https://app.geocodeapi.io/api/v1/search?text="
const API_KEY = "5fabbb80-0353-11ec-91c7-8d352b3d7cc7"

window.onload = reset();

if (ceps.length == 0) {
    $("#dados").html("Nenhum CEP");
}

$("#pesquisar").click(() => {
    pesquisaCep();
});

$(document).keyup(e => {
    if ($("#cep_pesquisa").is(":focus") && (e.keyCode == 13)) {
        pesquisaCep();
    }
});

function pesquisaCep() {
    $("#spinner").show()
    $("#pesquisar").prop("disabled", true)

    const cep = $("#cep_pesquisa").val().replace(/[\.-]/g, '');

    if (cep == "" || cep == null || isNaN(cep) || cep.length < 8) {

        $("#message").show();
        $("#message").html("Cep inválido, preencha o campo corretamente");

    } else {
        $.ajax({
            url: `${API_URL}/${cep}`, async: true, success: function (response, _) {
                ceps.push(response);
                $.ajax({
                    url: `${GEO_API}${response.logradouro} ${response.localidade} ${response.uf}&apikey=${API_KEY}`, async: true, success: function (r, _) {
                        
                        console.log(r['features'][0]['bbox'])
                        const [lat, lng] = r['features'][0]['geometry']['coordinates']

                        initMap(lat, lng)
                    }
                })

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

function initMap(lat, lng) {

    const map = `<iframe width="500" height="400" frameborder="0" src="https://www.bing.com/maps/embed?h=400&w=500&cp=${lng}~${lat}&lvl=15&typ=d&sty=r&src=SHELL&FORM=MBEDV8" scrolling="yes">
    </iframe>`
    $('#map').html(map)
}


function populateTable() {

    const dado = ceps.map(c =>
        `<tr>
        <td>${c.logradouro}</td>
        <td>${c.bairro}</td>
        <td>${c.localidade}</td>
        <td>${c.uf}</td>
        <td>${c.ibge}</td>
        <td>${c.ddd}</td>
        </tr>`)

    $("#dados").html(dado);
}
function reset() {

    $("#spinner").hide()
    $("#message").hide();
    $("#cep_pesquisa").val("")
    $("#cep_pesquisa").focus();
    $("#pesquisar").prop("disabled", false)

}
