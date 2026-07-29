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
// ORÇAMENTO
//==================================================

const saldoTotal = 6150;

const orcamento = {

    essenciais: saldoTotal * 0.50,
    ocasionais: saldoTotal * 0.30,
    investimentos: saldoTotal * 0.20

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

    const MAX_LINHAS = 20;

    for(let i = 0; i < MAX_LINHAS; i++){

        const item = dados[nomeTabela][i];

        if(item){

            tbody.innerHTML += `
                <tr>
                    <td>${item.descricao}</td>
                    <td class="valor">
                        R$ ${item.valor.toFixed(2)}
                    </td>
                </tr>
            `;

        }else{

            tbody.innerHTML += `
                <tr class="linhaVazia">
                    <td>&nbsp;</td>
                    <td></td>
                </tr>
            `;

        }

    }

}

//==================================================
// TOTAIS
//==================================================

function atualizarTotais(){

    let gastosEssenciais = 0;
    let gastosOcasionais = 0;
    let gastosInvestimentos = 0;

    dados.essenciais.forEach(item => gastosEssenciais += item.valor);
    dados.ocasionais.forEach(item => gastosOcasionais += item.valor);
    dados.investimentos.forEach(item => gastosInvestimentos += item.valor);

    // Cabeçalho = orçamento disponível da categoria

    document.getElementById("totalEssenciais").innerHTML =
        "R$ " + orcamento.essenciais.toFixed(2);

    document.getElementById("totalOcasionais").innerHTML =
        "R$ " + orcamento.ocasionais.toFixed(2);

    document.getElementById("totalInvestimentos").innerHTML =
        "R$ " + orcamento.investimentos.toFixed(2);

    // Rodapé = saldo restante

    document.getElementById("saldoEssenciais").innerHTML =
        "R$ " + (orcamento.essenciais - gastosEssenciais).toFixed(2);

    document.getElementById("saldoOcasionais").innerHTML =
        "R$ " + (orcamento.ocasionais - gastosOcasionais).toFixed(2);

    document.getElementById("saldoInvestimentos").innerHTML =
        "R$ " + (orcamento.investimentos - gastosInvestimentos).toFixed(2);

    // Saldo Geral

    document.getElementById("saldo").innerHTML =
        "R$ " + saldoTotal.toFixed(2);

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