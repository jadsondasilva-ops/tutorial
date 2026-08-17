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
// LANÇAMENTOS
//==================================================

let lancamentos = [];

//==================================================
// SUBCATEGORIAS
//==================================================

function carregarSubcategorias(){

    const lista =
        document.getElementById("listaSubcategorias");

    lista.innerHTML = "";

    for(const categoria in dados){

        dados[categoria].forEach(item => {

            const opcao =
                document.createElement("option");

            opcao.value = item.descricao;

            lista.appendChild(opcao);

        });

    }

}

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

    localStorage.setItem("lancamentos", JSON.stringify(lancamentos));

}

function carregarDados() {

    const dadosSalvos = localStorage.getItem("dados");
    const saldoSalvo = localStorage.getItem("saldoTotal");
    const orcamentoSalvo = localStorage.getItem("orcamento");
    const lancamentosSalvos = localStorage.getItem("lancamentos");

    if (dadosSalvos) {
        Object.assign(dados, JSON.parse(dadosSalvos));
    }

    if (saldoSalvo) {
        saldoTotal = Number(saldoSalvo);
    }

    if (orcamentoSalvo) {
        Object.assign(orcamento, JSON.parse(orcamentoSalvo));
    }

    if (lancamentosSalvos) {
    lancamentos = JSON.parse(lancamentosSalvos);
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

const linkInicio = document.getElementById("linkInicio");

//==================================================
// ELEMENTOS - NOVO LANÇAMENTO
//==================================================

const btnNovoLancamento =
    document.getElementById("btnNovoLancamento");

const modalNovoLancamento =
    document.getElementById("modalNovoLancamento");

const dataNovoLancamento =
    document.getElementById("dataNovoLancamento");

const cancelarNovoLancamento =
    document.getElementById("cancelarNovoLancamento");

//==================================================
// ABA FINANCEIRO
//==================================================

linkFinanceiro.addEventListener("click", (evento) => {

    evento.preventDefault();

    document.querySelector(".dashboard").classList.add("oculto");

    paginaFinanceiro.classList.remove("oculto");

}); //* TORNAR EM FUNÇÃO PARA NO FUTURO SERVIR PARA ALTERNAR AUTO.//

//==================================================
// NOVO LANÇAMENTO - ABRIR
//==================================================

btnNovoLancamento.addEventListener("click", () => {

    const hoje = new Date();

    const ano = hoje.getFullYear();

    const mes = String(
        hoje.getMonth() + 1
    ).padStart(2, "0");

    const dia = String(
        hoje.getDate()
    ).padStart(2, "0");

    dataNovoLancamento.value =
        `${ano}-${mes}-${dia}`;

    modalNovoLancamento.classList.remove("oculto");

});

//==================================================
// NOVO LANÇAMENTO - FECHAR MODAL
//==================================================

cancelarNovoLancamento.addEventListener("click", () => {

    modalNovoLancamento.classList.add("oculto");

});

//==================================================
// RETORNO INÍCIO
//==================================================

linkInicio.addEventListener("click", (evento) => {

    evento.preventDefault();

    document.querySelector(".dashboard").classList.remove("oculto");

    paginaFinanceiro.classList.add("oculto");

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

    const MAX_LINHAS = 15;

    for(let i = 0; i < MAX_LINHAS; i++){

        const item = dados[nomeTabela][i];

        if(item){

            // 1. Filtra os lançamentos que pertencem a esta subcategoria
            const lancamentosFiltrados = lancamentos.filter(l => 
                l.subcategoria.toLowerCase() === item.descricao.toLowerCase()
            );

            let valorFuturo = "";

            // 2. Se houver lançamentos, calcula o valor restante (Total - Lançamentos)
            if(lancamentosFiltrados.length > 0){
                const totalGasto = lancamentosFiltrados.reduce((acc, l) => acc + l.valor, 0);
                const restante = item.valor - totalGasto;
                valorFuturo = `R$ ${restante.toFixed(2)}`;
            }

            tbody.innerHTML += `
            <tr>

                <td>${item.descricao}</td>

                <td class="futuro">
                    ${valorFuturo}
                </td>

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

            // Mantém as linhas vazias intactas
            tbody.innerHTML += `
            <tr class="linhaVazia">

                <td>&nbsp;</td>

                <td></td>

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

function atualizarTotaisLancados(){

    let gastosLancados = 0;

    lancamentos.forEach(item => gastosLancados += item.valor);

    // Rodapé = saldo restante

    document.getElementById("totalLancamentos").innerHTML =
        "R$ " + (gastosLancados).toFixed(2);
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
                        size: 18
                    },

                    bodyFont: {
                        size: 16
                    }

                },

                legend: {

                    position: "bottom",

                    labels: {

                        color: "white",

                        font: {

                            size: 12

                        }

                    }

                }

            }

        }

    });

}

//==================================================
// IDENTIFICAR CATEGORIA DA SUBCATEGORIA
//==================================================

function identificarCategoria(subcategoria){

    for(const categoria in dados){

        const existe = dados[categoria].some(item =>
            item.descricao.toLowerCase() ===
            subcategoria.toLowerCase()
        );

        if(existe){

            return categoria;

        }

    }

    return null;

}

//==================================================
// DESENHAR LANÇAMENTOS
//==================================================

function renderizarLancamentos(){

    tbLancamentos.innerHTML = "";

    lancamentos.forEach((lancamento, indice) => {

        const data = new Date(
            lancamento.data + "T00:00:00"
        );

        const dataFormatada =
            data.toLocaleDateString("pt-BR");

        tbLancamentos.innerHTML += `

            <tr>

                <td>
                    ${dataFormatada}
                </td>

                <td>

                    <span class="subcategoria ${lancamento.categoria}">
                        ${lancamento.subcategoria}
                    </span>

                </td>

                <td>
                    ${lancamento.descricao}
                </td>

                <td>
                    ${lancamento.cartao}
                </td>

                <td>
                    ${lancamento.pagamento}
                </td>

                <td class="valorLancamento">

                    R$ ${lancamento.valor.toFixed(2)}

                </td>

                <td class="acoesLancamento">

                    <button
                        class="btnExcluirLancamento"
                        data-indice="${indice}">

                        ×

                    </button>

                </td>

            </tr>

        `;

    });

    //==================================================
    // NOVO: CONFIGURAR BOTÕES DE EXCLUIR LANÇAMENTO
    //==================================================
    document.querySelectorAll(".btnExcluirLancamento").forEach(botao => {

        botao.addEventListener("click", () => {

            // Pega o índice do lançamento que está no HTML do botão
            const indice = Number(botao.dataset.indice);

            // Remove 1 item do array 'lancamentos' a partir do índice selecionado
            lancamentos.splice(indice, 1);

            // Salva as alterações no navegador
            salvarDados();

            // Atualiza a tabela de lançamentos e o total da página
            renderizarLancamentos();
            atualizarTotaisLancados();

            // Atualiza o Dashboard principal (recalculando a coluna "futuro")
            atualizarTudo();

        });

    });

}

//==================================================
// NOVO LANÇAMENTO
//==================================================

salvarNovoLancamento.addEventListener("click", () => {

    // ... (Mantenha todas as validações `if` originais aqui) ...

    const novoLancamento = {

        data: dataNovoLancamento.value,

        categoria: categoriaLancamento,

        subcategoria: subcategoria,

        descricao: descricaoNovoLancamento.value,

        cartao: cartaoNovoLancamento.value,

        pagamento: pagamentoNovoLancamento.value,

        valor: Number(valorNovoLancamento.value)

    };

    lancamentos.push(novoLancamento);

    salvarDados();

    renderizarLancamentos();

    atualizarTotaisLancados();
    
    // Atualiza os saldos e as tabelas do Dashboard principal
    atualizarTudo(); 

    modalNovoLancamento.classList.add("oculto");

});


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

    atualizarTotaisLancados();

}

//==================================================
// START
//==================================================

carregarDados();

carregarSubcategorias();

renderizarLancamentos();

atualizarTudo();
