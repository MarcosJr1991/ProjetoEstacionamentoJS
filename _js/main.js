(function(){ //()PARÊNTESE AQUI PARA PODER ISOLAR A FUNÇÃO, FUNÇÃO ANÔNIMA NÃO TEM NOME. ISSO EVITA QUE OS USUÁRIO ACESSE ESSAS VARIÁVEIS
    const $ = q => document.querySelector(q); //FUNÇÃO QUE VAI FAZER ESSA VARIAVEL VOU SO CHAMAR $ E MANDAR A INFORMAÇÃO POR PARAMETRO

    function convertPeriod(mil) {
        var min = Math.floor(mil / 60000);
        var sec = Math.floor((mil % 60000) / 1000);
        return `${min}m e ${sec}s`;
    };
    //ESSA FUNÇÃO VAI REDERIZAR  O CARRO
    function renderGarage () {
        const garage = getGarage();
        $("#garage").innerHTML = "";
        garage.forEach(c => addCarToGarage(c))
    };

    /*ESSA FUNÇÃO VAI ESPERAR O CARRO CRIAR UM OBJETO ROW E VAI PREENCHER O GARAGE ATRAVES DA MANIPULAÇÃO
    DO DOM PELO PROPRIO JAVASCRIPT E DENTRO DO ROW VOU CONCATENAR UM INNER HTML USANDO CRASE E COLOCANDO O TD PARA
    COMPLETAR A COLUNA*/
    function addCarToGarage (car) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${car.name}</td> 
            <td>${car.licence}</td>
            <td data-time="${car.time}">
                ${new Date(car.time)
                        .toLocaleString('pt-BR', { 
                            hour: 'numeric', minute: 'numeric' 
                })}
            </td>
            <td>
                <button class="delete">x</button>
            </td>
        `;
                
        $("#garage").appendChild(row);
    };

    /* DATE VAI PEGAR A HORA ATUAL QUE O VEICULO FOI CADASTRADO NO ESTACIONAMENTO */
    function checkOut(info) {
        let period = new Date() - new Date(info[2].dataset.time);
        period = convertPeriod(period);

        const licence = info[1].textContent;
        const msg = `O veículo ${info[0].textContent} de placa ${licence} permaneceu ${period} estacionado. \n\n Deseja encerrar?`;

        if(!confirm(msg)) return;
        
        const garage = getGarage().filter(c => c.licence !== licence);
        localStorage.garage = JSON.stringify(garage);
        
        renderGarage();
    };

    /*ARMAZENAR O NOME DO VEICULO QUANTO A LICENÇA  EO TEMPO  COM O DATE VAI PEGAR A HORA ATUAL QUE O VEICULO FOI 
    CADASTRADO NO ESTACIONAMENTO. LOCALSTORAGE VAI SER RESPONSAVEL POR ARMAZENAR E DEIXAR O DADOS FAZER UM TERNARIO
    PRA VER SE ESSE LOCALSTORAGE JA EXISTE TRAZER NO FORMATO DE JSON DANDO UM PARSE.
    DEPOIS DA UM STRINGIFY TRANSFORMAR UM OBJETO EM JAVASCRIPT EM UM TEXTO O LOCALSTORAGE NÃO ENTENDE O OBJETO SO ENTENDE O TEXTO
    */
    const getGarage = () => localStorage.garage ? JSON.parse(localStorage.garage) : [];

    renderGarage();
    $("#send").addEventListener("click", e => {
        const name = $("#name").value;
        const licence = $("#licence").value;
        /*SE NÃO EXISTE O NAME OU LICENCE FOR FALSE TAMBEM DA UM ALERTA DE JANELINHA DE AVISO DIZENDO QUE OS CAMPOS SÃO OBRIGATORIOS
        RETURN IMPEDE QUE A FUNÇÃO DER A CONTINUIDADE.*/
        if(!name || !licence){
            alert("Os campos são obrigatórios.");
            return; 
        }   

        const card = { name, licence, time: new Date() };

        const garage = getGarage();
        garage.push(card);

        localStorage.garage = JSON.stringify(garage);

        addCarToGarage(card);
        $("#name").value = "";
        $("#licence").value = "";
    });

    $("#garage").addEventListener("click", (e) => {
        if(e.target.className === "delete")
            checkOut(e.target.parentElement.parentElement.cells);
    });
})()