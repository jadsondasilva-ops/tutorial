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

let saldoTotal = 6150;

const orcamento = {

    essenciais: saldoTotal * 0.50,
    ocasionais: saldoTotal * 0.30,
    investimentos: saldoTotal * 0.20

};

function salvarDados() {

    localStorage.setItem("dados", JSON.stringify(dados));

    localStorage.setItem("saldoTotal", saldoTotal);

    localStorage.setItem("orcamento", JSON.stringify(orcamento));

}

function carregarDados() {

    const dadosSalvos = localStorage.getItem("dados");
    const saldoSalvo = localStorage.getItem("saldoTotal");
    const orcamentoSalvo = localStorage.getItem("orcamento");

    if (dadosSalvos) {
        Object.assign(dados, JSON.parse(dadosSalvos));
    }

    if (saldoSalvo) {
        saldoTotal = Number(saldoSalvo);
    }

    if (orcamentoSalvo) {
        Object.assign(orcamento, JSON.parse(orcamentoSalvo));
    }

}



//==================================================
// ELEMENTOS HTML
//==================================================

const modal = document.getElementById("modal");

const descricao = document.getElementById("descricao");

const valor = document.getElementById("valor");

const categoria = document.getElementById("categoria");

const btnSalvar = document.getElementById("salvar");

const btnCancelar = document.getElementById("cancelar");

const saldo = document.getElementById("saldo");

const editarSaldo = document.getElementById("editarSaldo");

const botoesAdicionar = document.querySelectorAll(".btnAdicionar");

const linkFinanceiro = document.getElementById("linkFinanceiro");

const paginaFinanceiro = document.getElementById("paginaFinanceiro");

//==================================================
// ABA FINANCEIRO
//==================================================

linkFinanceiro.addEventListener("click", (evento) => {

    evento.preventDefault();

    document.querySelector(".dashboard").classList.add("oculto");

    paginaFinanceiro.classList.remove("oculto");

});

//==================================================
// TRANSFERÊNCIA
//==================================================

const botoesTransferir = document.querySelectorAll(".btnTransferir");

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
// EDITAR SALDO
//==================================================

saldo.addEventListener("click", () => {

    saldo.classList.add("oculto");

    editarSaldo.classList.remove("oculto");

    editarSaldo.value = saldoTotal;

    editarSaldo.focus();

    editarSaldo.select();

});

function salvarSaldo(){

    const novoValor = Number(editarSaldo.value);

    if(!isNaN(novoValor) && novoValor > 0){

        saldoTotal = novoValor;

        orcamento.essenciais = saldoTotal * 0.50;

        orcamento.ocasionais = saldoTotal * 0.30;

        orcamento.investimentos = saldoTotal * 0.20;

        salvarDados();

    }

    editarSaldo.classList.add("oculto");

    saldo.classList.remove("oculto");

    atualizarTudo();

}

editarSaldo.addEventListener("keydown", e => {

    if(e.key === "Enter"){

        salvarSaldo();

    }

});

editarSaldo.addEventListener("blur", salvarSaldo);

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

                <td class="acoes">

                    <button
                        class="btnExcluir"
                        data-tabela="${nomeTabela}"
                        data-indice="${i}">

                        ✕

                    </button>

                </td>

            </tr>
            `;

        }else{

            tbody.innerHTML += `
            <tr class="linhaVazia">

                <td>&nbsp;</td>

                <td></td>

                <td></td>

            </tr>
            `;

        }

    }

}

function configurarExclusao(){

    document.querySelectorAll(".btnExcluir").forEach(botao => {

        botao.addEventListener("click", () => {

            const tabela = botao.dataset.tabela;

            const indice = Number(botao.dataset.indice);

            dados[tabela].splice(indice,1);

            salvarDados();

            atualizarTudo();

        });

    });

}

//==================================================
// TRANSFERIR ORÇAMENTO
//==================================================

function transferirOrcamento(origem, destino, valor){

    if(valor <= 0){

        alert("Informe um valor válido.");

        return;

    }

    if(orcamento[origem] < valor){

        alert("A categoria de origem não possui orçamento suficiente.");

        return;

    }

    orcamento[origem] -= valor;

    orcamento[destino] += valor;

    salvarDados();

    atualizarTudo();

}

//==================================================
// EVENTO DOS BOTÕES DE TRANSFERÊNCIA
//==================================================

botoesTransferir.forEach(botao => {

    botao.addEventListener("click", () => {

        const destino = botao.dataset.destino;

        const valor = Number(
            document.getElementById(
                "valor" +
                destino.charAt(0).toUpperCase() +
                destino.slice(1)
            ).value
        );

        const origem = document.getElementById(
            "origem" +
            destino.charAt(0).toUpperCase() +
            destino.slice(1)
        ).value;

        transferirOrcamento(origem, destino, valor);

        document.getElementById(
            "valor" +
            destino.charAt(0).toUpperCase() +
            destino.slice(1)
        ).value = "";

    });

});

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

    salvarDados();

    atualizarTudo();

    fecharModal();

});

//==================================================
// ATUALIZAR GRÁFICOS
//==================================================

let graficoPizza = null;

function atualizarGrafico() {

    let gastosEssenciais = 0;
    let gastosOcasionais = 0;
    let gastosInvestimentos = 0;

    dados.essenciais.forEach(item => gastosEssenciais += item.valor);
    dados.ocasionais.forEach(item => gastosOcasionais += item.valor);
    dados.investimentos.forEach(item => gastosInvestimentos += item.valor);

    const ctx = document.getElementById("graficoPizza");
    
    console.log(graficoPizza);
    console.log(typeof graficoPizza);
    
    if (graficoPizza) {
        graficoPizza.destroy();
    }

    graficoPizza = new Chart(ctx, {

        type: "pie",

        data: {

            labels: [
                "ESSENCIAIS",
                "OCASIONAIS",
                "INVESTIMENTOS"
            ],

            datasets: [{

                data: [
                    orcamento.essenciais,
                    orcamento.ocasionais,
                    orcamento.investimentos
                ],

                backgroundColor: [
                    "#E53935",
                    "#FB8C00",
                    "#4A90E2"
                ]

            }]

        },

        options: {

            radius: "90%",

            responsive: true,

            plugins: {

                tooltip: {

                    padding: 16,

                    callbacks: {

                        label: function(context){

                            const total = context.dataset.data.reduce((a,b)=>a+b,0);

                            const valor = context.raw;

                            const porcentagem = (valor / total * 100).toFixed(1);

                            return `  R$ ${valor.toFixed(2)} - ${porcentagem}%`;

                        }
                    },

                    titleFont: {
                        size: 20
                    },

                    bodyFont: {
                        size: 18
                    }

                },

                legend: {

                    position: "bottom",

                    labels: {

                        color: "white",

                        font: {

                            size: 20

                        }

                    }

                }

            }

        }

    });

}


//==================================================
// ATUALIZAR TUDO
//==================================================

function atualizarTudo(){

    renderizarTabela("essenciais","tbEssenciais");

    renderizarTabela("ocasionais","tbOcasionais");

    renderizarTabela("investimentos","tbInvestimentos");

    atualizarGrafico();

    configurarExclusao();

    atualizarTotais();

}

//==================================================
// START
//==================================================

carregarDados();

atualizarTudo();
