
const API_URL = 'http://localhost:8080/buscacep';
const GEO_API = "https://app.geocodeapi.io/api/v1/search?text="
const API_KEY = "5fabbb80-0353-11ec-91c7-8d352b3d7cc7"

document.onload = reset();

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
    $("#dados").hide()
    $("#pesquisar").prop("disabled", true)

    const cep = $("#cep_pesquisa").val().replace(/[\.-]/g, '');

    if (cep == "" || cep == null || isNaN(cep) || cep.length < 8) {

        $("#message").show();
        $("#spinner").hide()
        $("#message").html("Cep inválido, preencha o campo corretamente");
        $("#dados").html('<h3>Realize nova pesquisa por CEP</h3>')
        $("#map").hide();

    } else {
        $.ajax({
            url: `${API_URL}/${cep}`, async: true, success: function (response, _) {
                addData(response);
                $.ajax({
                    url: `${GEO_API}${response.logradouro} ${response.localidade} ${response.uf}&apikey=${API_KEY}`, async: true, success: function (r, _) {

                        const [lat, lng] = r['features'][0]['geometry']['coordinates']
                        initMap(lat, lng)
                    }
                })

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
    reset();

}

function initMap(lat, lng) {

    const map = `<iframe width="100%" height="100%" frameborder="0" src="https://www.bing.com/maps/embed?h=400&w=500&cp=${lng}~${lat}&lvl=15&typ=d&sty=r&src=SHELL&FORM=MBEDV8" scrolling="yes">
    </iframe>`
    $("#dados").show()
    $('#map').html(map)
    $('#map').show()
    reset();
}


function addData(c) {

    const dado =
        `<ul>
        <li><b>Logradouro:</b> ${c.logradouro} <b>Bairro:</b> ${c.bairro}</li>
        <li><b>Cidade:</b> ${c.localidade} <b>UF:</b> ${c.uf}</li>
        <li><b>IBGE:</b> ${c.ibge} <b>DDD:</b> ${c.ddd}</li>
        </ul>`

    $("#dados").html(dado);
}
function reset() {

    setTimeout(() => {
        
        $("#message").hide();
        $("#spinner").hide()
        $("#dados").show()
        $("#cep_pesquisa").val("")
        $("#cep_pesquisa").focus();
        $("#pesquisar").prop("disabled", false)
    }, 1000
    )

}
