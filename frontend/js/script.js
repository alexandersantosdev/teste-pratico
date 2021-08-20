
const API_URL = 'http://localhost:8080/buscacep';
const ceps = []

window.onload = reset();

if (ceps.length == 0){
    $("#dados").html("Nenhum CEP");
}

$("button").click(() => {
    $("#spinner").show()
    $("button").prop("disabled", true)
    
    const cep = $("#cep_pesquisa").val().replace(/[\.-]/g, '');
    
    if (cep == "" || cep == null || isNaN(cep) || cep.length < 8) {
        
        $("#message").show();
        $("#message").html("Cep inválido, preencha o campo corretamente");
        
    } else {
        $.ajax({
            url: `${API_URL}/${cep}`, async: true, success: function (response, _) {
                ceps.push(response);
                populateTable();
            },
            error: (response, s) => {
                console.log(response.statusText)
                if(response.statusText == "error"){
                    $("#message").show();
                    $("#message").html("Erro ao requisitar dados da API");
         
                }else{
                    $("#message").show();
                    $("#message").html(response.responseJSON.message);
                }
            }
        });
        
    }
    setTimeout(() => reset(), 2000)
    return
    
});

function populateTable(){
    
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
        $("button").prop("disabled", false)
    
}