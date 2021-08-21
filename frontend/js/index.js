const API_URL = 'http://localhost:8080/';

$(window).ready(() => {
    $.ajax({
        url: `${API_URL}`, async: true, success: function (response, _) {
            const html = `
                <p>Descrição: ${response.message}</p>
                <p>Autor: ${response.autor}</p>
            `;
            $("#dados").html(html);
        },
        error: (response, s) => {
            console.log(response.statusText)
            if (response.statusText == "error") {
                $("#dados").html("Erro ao requisitar dados da API");

            } else {
                $("#dados").html(response.responseJSON.message);
            }
        }
    });
});