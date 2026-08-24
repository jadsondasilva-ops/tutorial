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
    ],
};

const pagamentos = Object.values(dados)
    .flat()
    .map(item => ({
        descricao: item.descricao,
        valor: Number(item.valor),
        vencimento: "",
        pago: false
}));

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

//==================================================
// SINCRONIZAR PAGAMENTOS
//==================================================
function sincronizarPagamentos() {
    const pagamentosAtuais = [...pagamentos];
    
    pagamentos.length = 0;
    
    Object.values(dados).flat().forEach(item => {
        const existente = pagamentosAtuais.find(p => p.descricao === item.descricao);
        
        pagamentos.push({
            descricao: item.descricao,
            valor: Number(item.valor),
            vencimento: existente ? existente.vencimento : "",
            pago: existente ? existente.pago : false
        });
    });
}

function salvarDados() {

    sincronizarPagamentos();


    localStorage.setItem("dados", JSON.stringify(dados));

    localStorage.setItem("saldoTotal", saldoTotal);

    localStorage.setItem("orcamento", JSON.stringify(orcamento));

    localStorage.setItem("lancamentos", JSON.stringify(lancamentos));

    localStorage.setItem("pagamentos", JSON.stringify(pagamentos));

}

function carregarDados() {

    const dadosSalvos = localStorage.getItem("dados");
    const saldoSalvo = localStorage.getItem("saldoTotal");
    const orcamentoSalvo = localStorage.getItem("orcamento");
    const lancamentosSalvos = localStorage.getItem("lancamentos");
    const pagamentosSalvos = localStorage.getItem("pagamentos");

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

    if (pagamentosSalvos) {
        const pagamentosCarregados = JSON.parse(pagamentosSalvos);
        
        
        pagamentos.push(...pagamentosCarregados);
    }
    
    
    sincronizarPagamentos();

}

//==================================================
// CONTROLE DE EDIÇÃO
//==================================================
let modoEdicao = false;
let itemEditadoCategoria = null;
let itemEditadoIndice = null;

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
// ABRIR MODAL (NOVA DESPESA)
//==================================================

botoesAdicionar.forEach(botao => {
    botao.addEventListener("click", () => {
        modoEdicao = false; // Garante que é um item novo
        document.querySelector("#modal .janela h2").innerText = "Nova Despesa";

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

    if(!isNaN(novoValor) && novoValor > 0 && novoValor != saldoTotal){

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

            // Dentro da função renderizarTabela, no trecho do `tbody.innerHTML +=`
            tbody.innerHTML += `
            <tr class="linhaComExclusao" data-tabela="${nomeTabela}" data-indice="${i}" draggable="true" style="cursor: grab;">
                <td>${item.descricao}</td>
                <td class="futuro">${valorFuturo}</td>
                <td class="valor">R$ ${item.valor.toFixed(2)}</td>
                <td class="acoes"><button class="btnExcluir">✕</button></td>
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

//==================================================
// DESENHAR TABELA DE PAGAMENTOS
//==================================================

function renderizarTabelaPagamentos() {

    const tbody =
        document.querySelector(".painelDireito #tbPagamentos");

    if (!tbody) return;

    tbody.innerHTML = "";

    const MAX_LINHAS = 10;

    //==================================================
    // OPÇÕES DA LISTA
    //==================================================

    let opcoesHTML =
        `<option value="" style="background:#2B3240;color:#FFF;">
            Selecione...
        </option>`;

    pagamentos.forEach((item, index) => {

        opcoesHTML += `
            <option
                value="${index}"
                style="background:#2B3240;color:#FFF;">
                ${item.descricao}
            </option>
        `;

    });

    //==================================================
    // CRIAR LINHAS
    //==================================================

    for(let i = 0; i < MAX_LINHAS; i++){

        tbody.innerHTML += `

            <tr
                class="linhaPagamento"
                data-indice="${i}">

                <td style="padding:5px;width:45%;">

                    <select
                        class="selectPagamento"
                        style="
                            width:100%;
                            border:none;
                            background:#2B3240;
                            padding:6px;
                            border-radius:5px;
                            color:#FFF;
                            outline:none;
                            cursor:pointer;
                            font-family:inherit;
                            font-size:12px;
                        ">

                        ${opcoesHTML}

                    </select>

                </td>


                <td
                    class="valorPagamento valor"
                    style="
                        text-align:right;
                        padding:5px;
                        width:25%;
                    ">
                </td>


                <td
                    class="vencimentoPagamento"
                    style="
                        text-align:center;
                        padding:5px;
                        width:15%;
                        cursor:pointer;
                    ">
                </td>


                <td
                    style="
                        text-align:center;
                        padding:5px;
                        width:15%;
                    ">

                    <input
                        type="checkbox"
                        class="checkPagamento"
                        disabled
                        style="
                            opacity:0.3;
                            accent-color:#34D16A;
                            cursor:pointer;
                            width:16px;
                            height:16px;
                        ">

                </td>

            </tr>

        `;

    }


    //==================================================
    // SELECIONAR PAGAMENTO
    //==================================================

    document
        .querySelectorAll(".painelDireito .selectPagamento")
        .forEach(select => {

            select.addEventListener("change", e => {

                const pagamentoIndex =
                    e.target.value;

                const tr =
                    e.target.closest("tr");

                const tdValor =
                    tr.querySelector(".valorPagamento");

                const tdVencimento =
                    tr.querySelector(".vencimentoPagamento");

                const checkbox =
                    tr.querySelector(".checkPagamento");


                //==========================================
                // NENHUM PAGAMENTO
                //==========================================

                if(pagamentoIndex === ""){

                    tdValor.innerHTML = "";

                    tdVencimento.innerHTML = "";

                    checkbox.disabled = true;

                    checkbox.style.opacity = "0.3";

                    checkbox.checked = false;

                    return;

                }


                //==========================================
                // PAGAMENTO SELECIONADO
                //==========================================

                const item =
                    pagamentos[pagamentoIndex];


                tdValor.innerHTML =
                    `R$ ${item.valor.toFixed(2)}`;


                //==========================================
                // VENCIMENTO
                //==========================================

                if(item.vencimento){

                    const data =
                        new Date(
                            item.vencimento + "T00:00:00"
                        );

                    tdVencimento.innerHTML =
                        data.toLocaleDateString("pt-BR");

                }else{

                    tdVencimento.innerHTML = "";

                }


                //==========================================
                // CHECKBOX
                //==========================================

                checkbox.disabled = false;

                checkbox.style.opacity = "1";

                checkbox.checked = item.pago;

            });

        });


    //==================================================
    // EDITAR VENCIMENTO
    //==================================================

    document
        .querySelectorAll(".painelDireito .vencimentoPagamento")
        .forEach(td => {

            td.addEventListener("click", () => {

                const tr =
                    td.closest("tr");

                const select =
                    tr.querySelector(".selectPagamento");


                // Não existe pagamento selecionado
                if(select.value === ""){

                    return;

                }


                const indice =
                    Number(select.value);

                const pagamento =
                    pagamentos[indice];


                //==========================================
                // EVITA CRIAR DOIS INPUTS
                //==========================================

                if(td.querySelector("input")){

                    return;

                }


                //==========================================
                // CRIA INPUT DE DATA
                //==========================================

                const input =
                    document.createElement("input");


                input.type = "date";

                input.value =
                    pagamento.vencimento || "";


                input.style.width = "100%";
                input.style.boxSizing = "border-box";
                input.style.background = "#2B3240";
                input.style.color = "#FFF";
                input.style.border = "1px solid #66B3FF";
                input.style.borderRadius = "5px";
                input.style.padding = "5px";
                input.style.outline = "none";
                input.style.fontFamily = "inherit";
                input.style.fontSize = "12px";


                td.innerHTML = "";

                td.appendChild(input);

                input.focus();


                //==========================================
                // SALVAR
                //==========================================

                let salvo = false;


                function salvarVencimento(){

                    // Impede o blur e Enter de salvar duas vezes
                    if(salvo){

                        return;

                    }

                    salvo = true;


                    pagamentos[indice].vencimento =
                        input.value;


                    salvarDados();


                    //======================================
                    // MOSTRAR NOVAMENTE A DATA
                    //======================================

                    if(input.value){

                        const data =
                            new Date(
                                input.value + "T00:00:00"
                            );

                        td.innerHTML =
                            data.toLocaleDateString("pt-BR");

                    }else{

                        td.innerHTML = "";

                    }

                }


                //==========================================
                // ENTER
                //==========================================

                input.addEventListener(
                    "keydown",
                    e => {

                        if(e.key === "Enter"){

                            e.preventDefault();

                            salvarVencimento();

                            input.blur();

                        }

                    }
                );


                //==========================================
                // CLIQUE FORA
                //==========================================

                input.addEventListener(
                    "blur",
                    salvarVencimento
                );

            });

        });


    //==================================================
    // CHECKBOX DE PAGAMENTO
    //==================================================

    document
        .querySelectorAll(".painelDireito .checkPagamento")
        .forEach(checkbox => {

            checkbox.addEventListener("change", e => {

                const tr =
                    e.target.closest("tr");

                const select =
                    tr.querySelector(".selectPagamento");


                if(select.value !== ""){

                    const indice =
                        Number(select.value);


                    pagamentos[indice].pago =
                        e.target.checked;


                    salvarDados();

                }

            });

        });

}

function configurarExclusao() {
    // Agora selecionamos apenas o botão, não mais a linha inteira
    document.querySelectorAll(".btnExcluir").forEach(botao => {
        botao.addEventListener("click", (e) => {
            
            // Encontra a linha "Pai" (tr) que contém o botão
            const linha = e.target.closest("tr");
            
            const tabela = linha.dataset.tabela;
            const indice = Number(linha.dataset.indice);

            dados[tabela].splice(indice, 1);
            salvarDados();
            atualizarTudo();
        });
    });
}

//==================================================
// DRAG AND DROP (REORDENAR LINHAS)
//==================================================

let linhaArrastada = null;

function configurarDragAndDrop() {
    const linhas = document.querySelectorAll(".linhaComExclusao[draggable='true']");

    linhas.forEach(linha => {
        // Ao começar a arrastar
        linha.addEventListener("dragstart", function(e) {
            linhaArrastada = this;
            e.dataTransfer.effectAllowed = "move";
            // Usa um pequeno delay para a linha original ficar com aspecto "fantasma"
            setTimeout(() => this.classList.add("arrastando"), 0);
        });

        // Ao soltar ou cancelar
        linha.addEventListener("dragend", function() {
            linhaArrastada = null;
            this.classList.remove("arrastando");
        });

        // Quando passa por cima de outra linha
        linha.addEventListener("dragover", function(e) {
            e.preventDefault(); // Obrigatório para permitir o "Drop"
            // Garante que só mostre o efeito visual se arrastar dentro da mesma tabela
            if (linhaArrastada && this.dataset.tabela === linhaArrastada.dataset.tabela && this !== linhaArrastada) {
                this.classList.add("drag-over");
            }
        });

        // Quando sai de cima de outra linha
        linha.addEventListener("dragleave", function() {
            this.classList.remove("drag-over");
        });

        // Quando solta a linha no novo destino
        linha.addEventListener("drop", function(e) {
            e.preventDefault();
            this.classList.remove("drag-over");

            // Valida se o drop é válido (na mesma tabela e numa linha diferente)
            if (linhaArrastada && this.dataset.tabela === linhaArrastada.dataset.tabela && this !== linhaArrastada) {
                
                const tabela = this.dataset.tabela;
                const indexOrigem = Number(linhaArrastada.dataset.indice);
                const indexDestino = Number(this.dataset.indice);

                // Reordena os itens no array 'dados'
                const itemMovido = dados[tabela].splice(indexOrigem, 1)[0];
                dados[tabela].splice(indexDestino, 0, itemMovido);

                // Salva no localStorage e reconstrói a interface
                salvarDados();
                atualizarTudo();
            }
        });
    });
}

//==================================================
// DUPLO CLIQUE PARA EDITAR
//==================================================

function configurarDuploClique() {
    document.querySelectorAll(".linhaComExclusao").forEach(linha => {
        linha.addEventListener("dblclick", () => {
            modoEdicao = true;
            itemEditadoCategoria = linha.dataset.tabela;
            itemEditadoIndice = Number(linha.dataset.indice);

            let item;
          
            try {
              item = dados[itemEditadoCategoria][itemEditadoIndice];
            } 
            catch (erro) {
              item = pagamentos[itemEditadoIndice];
            }
            console.log(itemEditadoCategoria)
            console.log(itemEditadoIndice)
            // Muda o título do modal e preenche os campos
              document.querySelector("#modal .janela h2").innerText = "Editar Despesa";
              descricao.value = item.descricao;
              valor.value = item.valor;
              categoria.value = itemEditadoCategoria;
  
              modal.classList.remove("oculto");
              descricao.focus();

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
// SALVAR ITEM (NOVO OU EDIÇÃO)
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

    if (modoEdicao) {
        // --- MODO EDIÇÃO ---
        const novaCategoria = categoria.value;
        const novoValor = Number(valor.value);
        const novaDescricao = descricao.value.trim();
        const descricaoAntiga = dados[itemEditadoCategoria][itemEditadoIndice].descricao;

        // 1. Atualiza os dados
        if (novaCategoria === itemEditadoCategoria) {
            // Se manteve na mesma categoria
            dados[itemEditadoCategoria][itemEditadoIndice].descricao = novaDescricao;
            dados[itemEditadoCategoria][itemEditadoIndice].valor = novoValor;
        } else {
            // Se mudou de categoria (ex: de Essencial para Ocasional)
            dados[itemEditadoCategoria].splice(itemEditadoIndice, 1);
            dados[novaCategoria].push({ descricao: novaDescricao, valor: novoValor });
        }

        // 2. Atualiza o histórico de lançamentos caso o nome ou categoria tenham mudado
        if (descricaoAntiga !== novaDescricao || novaCategoria !== itemEditadoCategoria) {
            lancamentos.forEach(l => {
                if (l.subcategoria.toLowerCase() === descricaoAntiga.toLowerCase()) {
                    l.subcategoria = novaDescricao;
                    l.categoria = novaCategoria;
                }
            });
            renderizarLancamentos();
        }
        
    } else {
        // --- MODO NOVO ITEM ---
        dados[categoria.value].push({
            descricao: descricao.value.trim(),
            valor: Number(valor.value)
        });
    }

    carregarSubcategorias(); // Atualiza a lista de opções de lançamentos
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

        type: "doughnut", // Mudamos de "pie" para "doughnut"

        data: {

            labels: [
                "  ESSENCIAIS",
                "  OCASIONAIS",
                "  INVESTIMENTOS"
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
                ],
                
                
                borderWidth: 0,
                hoverOffset: 8, // A fatia "pula" ao passar o mouse
                borderRadius: 4 // Arredonda levemente as pontas das fatias

            }]

        },

        options: {

            cutout: '70%', 
            radius: "90%",
            responsive: true,

            plugins: {

                tooltip: {
                    padding: 16,
                    
                    titleFont: {
                        family: "'Inter', sans-serif",
                        size: 14
                    },
                    bodyFont: {
                        family: "'Inter', sans-serif",
                        size: 14
                    },
                    callbacks: {
                        label: function(context){
                            const total = context.dataset.data.reduce((a,b)=>a+b,0);
                            const valor = context.raw;
                            const porcentagem = (valor / total * 100).toFixed(1);
                            return `  R$ ${valor.toFixed(2)} - ${porcentagem}%`;
                        }
                    }
                },

                legend: {
                    position: "bottom",
                    labels: {
                        color: "#9DA5B4", 
                        usePointStyle: true, 
                        padding: 25, 
                        font: {
                            family: "'Inter', sans-serif", 
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

    if(dataNovoLancamento.value === ""){
        alert("Informe a data.");
        return;
    }

    if(subcategoriaNovoLancamento.value.trim() === ""){
        alert("Informe a subcategoria.");
        return;
    }

    if(descricaoNovoLancamento.value.trim() === ""){
        alert("Informe a descrição.");
        return;
    }

    if(valorNovoLancamento.value === ""){
        alert("Informe o valor.");
        return;
    }

    // Variáveis importantes que estavam faltando:
    const subcategoria = subcategoriaNovoLancamento.value.trim();
    const categoriaLancamento = identificarCategoria(subcategoria);

    if(!categoriaLancamento){
        alert("Subcategoria não encontrada.");
        return;
    }

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

    renderizarTabelaPagamentos();

    atualizarGrafico();

    configurarExclusao();

    configurarDragAndDrop();

    configurarDuploClique();

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
