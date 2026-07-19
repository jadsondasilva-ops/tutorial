//==================================================
// DADOS
//==================================================

const dados = {

    essenciais: [
        { descricao: "Aluguel", valor: 800 },
        { descricao: "Luz", valor: 170 },
        { descricao: "Água", valor: 90 },
        { descricao: "Internet", valor: 110 },
        { descricao: "Celular", valor: 65 }
    ],

    ocasionais: [
        { descricao: "Cinema", valor: 90 },
        { descricao: "Lazer", valor: 200 },
        { descricao: "Restaurante", valor: 170 }
    ],

    investimentos: [
        { descricao: "WEGE3", valor: 1400 },
        { descricao: "BBAS3", valor: 950 },
        { descricao: "VALE3", valor: 800 }
    ]

};

//==================================================
// ELEMENTOS HTML
//==================================================

const modal = document.getElementById("modal");

const descricao = document.getElementById("descricao");

const valor = document.getElementById("valor");

const categoria = document.getElementById("categoria");

const btnSalvar = document.getElementById("salvar");

const btnCancelar = document.getElementById("cancelar");

const botoesAdicionar = document.querySelectorAll(".btnAdicionar");

//==================================================
// ABRIR MODAL
//==================================================

botoesAdicionar.forEach(botao => {

    botao.addEventListener("click", () => {

        modal.classList.remove("oculto");

        categoria.value = botao.dataset.categoria;

        descricao.value = "";

        valor.value = "";

        descricao.focus();

    });

});

//==================================================
// FECHAR
//==================================================

btnCancelar.addEventListener("click", fecharModal);

function fecharModal(){

    modal.classList.add("oculto");

}

//==================================================
// DESENHAR TABELA
//==================================================

function renderizarTabela(nomeTabela, idTabela){

    const tbody = document.getElementById(idTabela);

    tbody.innerHTML = "";

    dados[nomeTabela].forEach(item => {

        tbody.innerHTML += `

            <tr>

                <td>${item.descricao}</td>

                <td style="text-align:right">

                    R$ ${item.valor.toFixed(2)}

                </td>

            </tr>

        `;

    });

}

//==================================================
// TOTAIS
//==================================================

function atualizarTotais(){

    let totalEssenciais = 0;

    let totalOcasionais = 0;

    let totalInvestimentos = 0;

    dados.essenciais.forEach(i => totalEssenciais += i.valor);

    dados.ocasionais.forEach(i => totalOcasionais += i.valor);

    dados.investimentos.forEach(i => totalInvestimentos += i.valor);

    document.getElementById("totalEssenciais").innerHTML =
        "R$ " + totalEssenciais.toFixed(2);

    document.getElementById("totalOcasionais").innerHTML =
        "R$ " + totalOcasionais.toFixed(2);

    document.getElementById("totalInvestimentos").innerHTML =
        "R$ " + totalInvestimentos.toFixed(2);

    document.getElementById("saldo").innerHTML =
        "R$ " +
        (totalEssenciais + totalOcasionais + totalInvestimentos).toFixed(2);

}

//==================================================
// NOVO ITEM
//==================================================

btnSalvar.addEventListener("click", () => {

    if(descricao.value.trim() === ""){

        alert("Digite uma descrição.");

        return;

    }

    if(valor.value === ""){

        alert("Digite um valor.");

        return;

    }

    dados[categoria.value].push({

        descricao: descricao.value,

        valor: Number(valor.value)

    });

    atualizarTudo();

    fecharModal();

});

//==================================================
// ATUALIZAR TUDO
//==================================================

function atualizarTudo(){

    renderizarTabela("essenciais","tbEssenciais");

    renderizarTabela("ocasionais","tbOcasionais");

    renderizarTabela("investimentos","tbInvestimentos");

    atualizarTotais();

}

//==================================================
// START
//==================================================

atualizarTudo();