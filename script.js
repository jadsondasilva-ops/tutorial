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
// SLOTS - PAGAMENTO
//==================================================

let slotsPagamentos = new Array(10).fill("");

//==================================================
// SUBCATEGORIAS
//==================================================

function carregarSubcategorias(){
    const lista = document.getElementById("listaSubcategorias");
    lista.innerHTML = "";
    for(const categoria in dados){
        dados[categoria].forEach(item => {
            const opcao = document.createElement("option");
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
// SINCRONIZAR PAGAMENTOS (COM FILTRO ANTI-DUPLICATAS)
//==================================================
function sincronizarPagamentos() {
    const pagamentosAtuais = [...pagamentos];
    pagamentos.length = 0;
    const descricoesVistas = new Set();
    Object.values(dados).flat().forEach(item => {
        const nomeItem = item.descricao.trim();
        if (!descricoesVistas.has(nomeItem)) {
            descricoesVistas.add(nomeItem);
            const existente = pagamentosAtuais.find(p => p.descricao === nomeItem);
            pagamentos.push({
                descricao: nomeItem,
                valor: Number(item.valor),
                vencimento: existente ? existente.vencimento : "",
                pago: existente ? existente.pago : false
            });
        }
    });
}

function salvarDados() {
    sincronizarPagamentos();
    localStorage.setItem("dados", JSON.stringify(dados));
    localStorage.setItem("saldoTotal", saldoTotal);
    localStorage.setItem("orcamento", JSON.stringify(orcamento));
    localStorage.setItem("lancamentos", JSON.stringify(lancamentos));
    localStorage.setItem("pagamentos", JSON.stringify(pagamentos));
    localStorage.setItem("slotsPagamentos", JSON.stringify(slotsPagamentos));
}

function carregarDados() {
    const dadosSalvos = localStorage.getItem("dados");
    const saldoSalvo = localStorage.getItem("saldoTotal");
    const orcamentoSalvo = localStorage.getItem("orcamento");
    const lancamentosSalvos = localStorage.getItem("lancamentos");
    const pagamentosSalvos = localStorage.getItem("pagamentos");
    const slotsSalvos = localStorage.getItem("slotsPagamentos");

    if (dadosSalvos) Object.assign(dados, JSON.parse(dadosSalvos));
    if (saldoSalvo) saldoTotal = Number(saldoSalvo);
    if (orcamentoSalvo) Object.assign(orcamento, JSON.parse(orcamentoSalvo));
    if (lancamentosSalvos) lancamentos = JSON.parse(lancamentosSalvos);
    if (pagamentosSalvos) {
        const pagamentosCarregados = JSON.parse(pagamentosSalvos);
        pagamentos.push(...pagamentosCarregados);
    }
    if (slotsSalvos) slotsPagamentos = JSON.parse(slotsSalvos);
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
const btnNovoLancamento = document.getElementById("btnNovoLancamento");
const modalNovoLancamento = document.getElementById("modalNovoLancamento");
const dataNovoLancamento = document.getElementById("dataNovoLancamento");
const cancelarNovoLancamento = document.getElementById("cancelarNovoLancamento");
const salvarNovoLancamento = document.getElementById("salvarNovoLancamento");
const subcategoriaNovoLancamento = document.getElementById("subcategoriaNovoLancamento");
const descricaoNovoLancamento = document.getElementById("descricaoNovoLancamento");
const cartaoNovoLancamento = document.getElementById("cartaoNovoLancamento");
const pagamentoNovoLancamento = document.getElementById("pagamentoNovoLancamento");
const valorNovoLancamento = document.getElementById("valorNovoLancamento");
const tbLancamentos = document.getElementById("tbLancamentos");
const botoesTransferir = document.querySelectorAll(".btnTransferir");

//==================================================
// ABA FINANCEIRO
//==================================================
linkFinanceiro.addEventListener("click", (evento) => {
    evento.preventDefault();
    document.querySelector(".dashboard").classList.add("oculto");
    paginaFinanceiro.classList.remove("oculto");
});

//==================================================
// NOVO LANÇAMENTO - ABRIR
//==================================================
btnNovoLancamento.addEventListener("click", () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    dataNovoLancamento.value = `${ano}-${mes}-${dia}`;
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
// ABRIR MODAL (NOVA DESPESA)
//==================================================
botoesAdicionar.forEach(botao => {
    botao.addEventListener("click", () => {
        modoEdicao = false;
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
function fecharModal(){ modal.classList.add("oculto"); }

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
    if(e.key === "Enter") salvarSaldo();
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
            const lancamentosFiltrados = lancamentos.filter(l => 
                l.subcategoria.toLowerCase() === item.descricao.toLowerCase()
            );
            let valorFuturo = "";
            if(lancamentosFiltrados.length > 0){
                const totalGasto = lancamentosFiltrados.reduce((acc, l) => acc + l.valor, 0);
                const restante = item.valor - totalGasto;
                valorFuturo = `R$ ${restante.toFixed(2)}`;
            }
            tbody.innerHTML += `
            <tr class="linhaComExclusao" data-tabela="${nomeTabela}" data-indice="${i}" draggable="true" style="cursor: grab;">
                <td>${item.descricao}</td>
                <td class="futuro">${valorFuturo}</td>
                <td class="valor">R$ ${item.valor.toFixed(2)}</td>
                <td class="acoes"><button class="btnExcluir">✕</button></td>
            </tr>
            `;
        }else{
            tbody.innerHTML += `<tr class="linhaVazia"><td>&nbsp;</td><td></td><td></td><td></td></tr>`;
        }
    }
}

//==================================================
// DESENHAR TABELA DE PAGAMENTOS
//==================================================
function renderizarTabelaPagamentos() {
    const tbody = document.querySelector(".painelDireito #tbPagamentos");
    if (!tbody) return;
    tbody.innerHTML = "";
    const MAX_LINHAS = 10;
    for(let i = 0; i < MAX_LINHAS; i++){
        const descricaoSalva = slotsPagamentos[i] || "";
        let itemSelecionado = null;
        let indiceSelecionado = "";
        let opcoesHTML = `<option value="" style="background:#2B3240;color:#FFF;">Selecione...</option>`;
        pagamentos.forEach((item, index) => {
            const selected = (item.descricao === descricaoSalva) ? "selected" : "";
            if (selected) {
                itemSelecionado = item;
                indiceSelecionado = index;
            }
            opcoesHTML += `<option value="${index}" style="background:#2B3240;color:#FFF;" ${selected}>${item.descricao}</option>`;
        });
        let valorHTML = "";
        let vencimentoHTML = "";
        let checkHTML = `<input type="checkbox" class="checkPagamento" disabled style="opacity:0.3;accent-color:#34D16A;cursor:pointer;width:16px;height:16px;">`;
        if (itemSelecionado) {
            valorHTML = `R$ ${itemSelecionado.valor.toFixed(2)}`;
            if (itemSelecionado.vencimento) {
                const data = new Date(itemSelecionado.vencimento + "T00:00:00");
                vencimentoHTML = data.toLocaleDateString("pt-BR");
            }
            checkHTML = `<input type="checkbox" class="checkPagamento" style="opacity:1;accent-color:#34D16A;cursor:pointer;width:16px;height:16px;" ${itemSelecionado.pago ? "checked" : ""}>`;
        }
        tbody.innerHTML += `
            <tr class="linhaPagamento" data-indice="${i}">
                <td style="padding:5px;width:45%;">
                    <select class="selectPagamento" style="width:100%; border:none; background:#2B3240; padding:6px; border-radius:5px; color:#FFF; outline:none; cursor:pointer; font-family:inherit; font-size:12px;">
                        ${opcoesHTML}
                    </select>
                </td>
                <td class="valorPagamento valor" style="text-align:right; padding:5px; width:25%;">${valorHTML}</td>
                <td class="vencimentoPagamento" style="text-align:center; padding:5px; width:15%; cursor:pointer;">${vencimentoHTML}</td>
                <td style="text-align:center; padding:5px; width:15%;">
                    ${checkHTML}
                    <button class="btnExcluirPagamento" title="Limpar linha">✕</button>
                </td>
            </tr>
        `;
    }
    document.querySelectorAll(".painelDireito .selectPagamento").forEach(select => {
        select.addEventListener("change", e => {
            const pagamentoIndex = e.target.value;
            const tr = e.target.closest("tr");
            const indiceLinha = Number(tr.dataset.indice);
            const tdValor = tr.querySelector(".valorPagamento");
            const tdVencimento = tr.querySelector(".vencimentoPagamento");
            const checkbox = tr.querySelector(".checkPagamento");
            if(pagamentoIndex === ""){
                slotsPagamentos[indiceLinha] = "";
                tdValor.innerHTML = "";
                tdVencimento.innerHTML = "";
                checkbox.disabled = true;
                checkbox.style.opacity = "0.3";
                checkbox.checked = false;
                salvarDados();
                return;
            }
            const item = pagamentos[pagamentoIndex];
            slotsPagamentos[indiceLinha] = item.descricao;
            tdValor.innerHTML = `R$ ${item.valor.toFixed(2)}`;
            if(item.vencimento){
                const data = new Date(item.vencimento + "T00:00:00");
                tdVencimento.innerHTML = data.toLocaleDateString("pt-BR");
            }else{
                tdVencimento.innerHTML = "";
            }
            checkbox.disabled = false;
            checkbox.style.opacity = "1";
            checkbox.checked = item.pago;
            salvarDados();
        });
    });
    document.querySelectorAll(".painelDireito .vencimentoPagamento").forEach(td => {
        td.addEventListener("click", () => {
            const tr = td.closest("tr");
            const select = tr.querySelector(".selectPagamento");
            if(select.value === "") return;
            const indice = Number(select.value);
            const pagamento = pagamentos[indice];
            if(td.querySelector("input")) return;
            const input = document.createElement("input");
            input.type = "date";
            input.value = pagamento.vencimento || "";
            input.style.width = "100%"; input.style.boxSizing = "border-box"; input.style.background = "#2B3240"; input.style.color = "#FFF"; input.style.border = "1px solid #66B3FF"; input.style.borderRadius = "5px"; input.style.padding = "5px"; input.style.outline = "none"; input.style.fontFamily = "inherit"; input.style.fontSize = "12px";
            td.innerHTML = "";
            td.appendChild(input);
            input.focus();
            let salvo = false;
            function salvarVencimento(){
                if(salvo) return;
                salvo = true;
                pagamentos[indice].vencimento = input.value;
                salvarDados();
                if(input.value){
                    const data = new Date(input.value + "T00:00:00");
                    td.innerHTML = data.toLocaleDateString("pt-BR");
                }else{
                    td.innerHTML = "";
                }
            }
            input.addEventListener("keydown", e => { if(e.key === "Enter"){ e.preventDefault(); salvarVencimento(); input.blur(); } });
            input.addEventListener("blur", salvarVencimento);
        });
    });
    document.querySelectorAll(".painelDireito .checkPagamento").forEach(checkbox => {
        checkbox.addEventListener("change", e => {
            const tr = e.target.closest("tr");
            const select = tr.querySelector(".selectPagamento");
            if(select.value !== ""){
                const indice = Number(select.value);
                pagamentos[indice].pago = e.target.checked;
                salvarDados();
            }
        });
    });
    document.querySelectorAll(".painelDireito .btnExcluirPagamento").forEach(botao => {
        botao.addEventListener("click", e => {
            const tr = e.target.closest("tr");
            const select = tr.querySelector(".selectPagamento");
            if (select.value === "") return;
            select.value = "";
            select.dispatchEvent(new Event("change"));
        });
    });   
}

function configurarExclusao() {
    document.querySelectorAll(".btnExcluir").forEach(botao => {
        botao.addEventListener("click", (e) => {
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
// DRAG AND DROP
//==================================================
let linhaArrastada = null;
function configurarDragAndDrop() {
    const linhas = document.querySelectorAll(".linhaComExclusao[draggable='true']");
    linhas.forEach(linha => {
        linha.addEventListener("dragstart", function(e) {
            linhaArrastada = this;
            e.dataTransfer.effectAllowed = "move";
            setTimeout(() => this.classList.add("arrastando"), 0);
        });
        linha.addEventListener("dragend", function() {
            linhaArrastada = null;
            this.classList.remove("arrastando");
        });
        linha.addEventListener("dragover", function(e) {
            e.preventDefault();
            if (linhaArrastada && this.dataset.tabela === linhaArrastada.dataset.tabela && this !== linhaArrastada) {
                this.classList.add("drag-over");
            }
        });
        linha.addEventListener("dragleave", function() {
            this.classList.remove("drag-over");
        });
        linha.addEventListener("drop", function(e) {
            e.preventDefault();
            this.classList.remove("drag-over");
            if (linhaArrastada && this.dataset.tabela === linhaArrastada.dataset.tabela && this !== linhaArrastada) {
                const tabela = this.dataset.tabela;
                const indexOrigem = Number(linhaArrastada.dataset.indice);
                const indexDestino = Number(this.dataset.indice);
                const itemMovido = dados[tabela].splice(indexOrigem, 1)[0];
                dados[tabela].splice(indexDestino, 0, itemMovido);
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
            try { item = dados[itemEditadoCategoria][itemEditadoIndice]; } 
            catch (erro) { item = pagamentos[itemEditadoIndice]; }
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
    if(valor <= 0){ alert("Informe um valor válido."); return; }
    if(orcamento[origem] < valor){ alert("A categoria de origem não possui orçamento suficiente."); return; }
    orcamento[origem] -= valor;
    orcamento[destino] += valor;
    salvarDados();
    atualizarTudo();
}
botoesTransferir.forEach(botao => {
    botao.addEventListener("click", () => {
        const destino = botao.dataset.destino;
        const valorId = "valor" + destino.charAt(0).toUpperCase() + destino.slice(1);
        const origemId = "origem" + destino.charAt(0).toUpperCase() + destino.slice(1);
        const valorNum = Number(document.getElementById(valorId).value);
        const origem = document.getElementById(origemId).value;
        transferirOrcamento(origem, destino, valorNum);
        document.getElementById(valorId).value = "";
    });
});

//==================================================
// TOTAIS
//==================================================
function atualizarTotais(){
    let gastosEssenciais = 0; let gastosOcasionais = 0; let gastosInvestimentos = 0;
    dados.essenciais.forEach(item => gastosEssenciais += item.valor);
    dados.ocasionais.forEach(item => gastosOcasionais += item.valor);
    dados.investimentos.forEach(item => gastosInvestimentos += item.valor);
    document.getElementById("totalEssenciais").innerHTML = "R$ " + orcamento.essenciais.toFixed(2);
    document.getElementById("totalOcasionais").innerHTML = "R$ " + orcamento.ocasionais.toFixed(2);
    document.getElementById("totalInvestimentos").innerHTML = "R$ " + orcamento.investimentos.toFixed(2);
    document.getElementById("saldoEssenciais").innerHTML = "R$ " + (orcamento.essenciais - gastosEssenciais).toFixed(2);
    document.getElementById("saldoOcasionais").innerHTML = "R$ " + (orcamento.ocasionais - gastosOcasionais).toFixed(2);
    document.getElementById("saldoInvestimentos").innerHTML = "R$ " + (orcamento.investimentos - gastosInvestimentos).toFixed(2);
    document.getElementById("saldo").innerHTML = "R$ " + saldoTotal.toFixed(2);
}

function atualizarTotaisLancados(){
    let gastosLancados = 0;
    lancamentos.forEach(item => gastosLancados += item.valor);
    const totalLancamentosElem = document.getElementById("totalLancamentos");
    if(totalLancamentosElem) totalLancamentosElem.innerHTML = "R$ " + (gastosLancados).toFixed(2);
}

//==================================================
// SALVAR ITEM
//==================================================
btnSalvar.addEventListener("click", () => {
    if(descricao.value.trim() === ""){ alert("Digite uma descrição."); return; }
    if(valor.value === ""){ alert("Digite um valor."); return; }
    if (modoEdicao) {
        const novaCategoria = categoria.value;
        const novoValor = Number(valor.value);
        const novaDescricao = descricao.value.trim();
        const descricaoAntiga = dados[itemEditadoCategoria][itemEditadoIndice].descricao;
        if (novaCategoria === itemEditadoCategoria) {
            dados[itemEditadoCategoria][itemEditadoIndice].descricao = novaDescricao;
            dados[itemEditadoCategoria][itemEditadoIndice].valor = novoValor;
        } else {
            dados[itemEditadoCategoria].splice(itemEditadoIndice, 1);
            dados[novaCategoria].push({ descricao: novaDescricao, valor: novoValor });
        }
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
        dados[categoria.value].push({ descricao: descricao.value.trim(), valor: Number(valor.value) });
    }
    carregarSubcategorias();
    salvarDados();
    atualizarTudo();
    fecharModal();
});

//==================================================
// GRÁFICO
//==================================================
let graficoPizza = null;
function atualizarGrafico() {
    let gastosEssenciais = 0; let gastosOcasionais = 0; let gastosInvestimentos = 0;
    dados.essenciais.forEach(item => gastosEssenciais += item.valor);
    dados.ocasionais.forEach(item => gastosOcasionais += item.valor);
    dados.investimentos.forEach(item => gastosInvestimentos += item.valor);
    const ctx = document.getElementById("graficoPizza");
    if(!ctx) return;
    if (graficoPizza) graficoPizza.destroy();
    graficoPizza = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["  ESSENCIAIS", "  OCASIONAIS", "  INVESTIMENTOS"],
            datasets: [{
                data: [orcamento.essenciais, orcamento.ocasionais, orcamento.investimentos],
                backgroundColor: ["#E53935", "#FB8C00", "#4A90E2"],
                borderWidth: 0,
                hoverOffset: 8,
                borderRadius: 4
            }]
        },
        options: {
            cutout: '70%', 
            radius: "90%",
            responsive: true,
            plugins: {
                tooltip: {
                    padding: 16,
                    titleFont: { family: "'Inter', sans-serif", size: 14 },
                    bodyFont: { family: "'Inter', sans-serif", size: 14 },
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
                        color: document.body.classList.contains("light-mode") ? "#555" : "#9DA5B4", 
                        usePointStyle: true, 
                        padding: 25, 
                        font: { family: "'Inter', sans-serif", size: 12 }
                    }
                }
            }
        }
    });
}

function identificarCategoria(subcategoria){
    for(const categoria in dados){
        const existe = dados[categoria].some(item => item.descricao.toLowerCase() === subcategoria.toLowerCase());
        if(existe) return categoria;
    }
    return null;
}

//==================================================
// DESENHAR LANÇAMENTOS
//==================================================
function renderizarLancamentos(){
    if(!tbLancamentos) return;
    tbLancamentos.innerHTML = "";
    lancamentos.forEach((lancamento, indice) => {
        const data = new Date(lancamento.data + "T00:00:00");
        const dataFormatada = data.toLocaleDateString("pt-BR");
        tbLancamentos.innerHTML += `
            <tr>
                <td>${dataFormatada}</td>
                <td><span class="subcategoria ${lancamento.categoria}">${lancamento.subcategoria}</span></td>
                <td>${lancamento.descricao}</td>
                <td>${lancamento.cartao}</td>
                <td>${lancamento.pagamento}</td>
                <td class="valorLancamento">R$ ${lancamento.valor.toFixed(2)}</td>
                <td class="acoesLancamento"><button class="btnExcluirLancamento" data-indice="${indice}">×</button></td>
            </tr>
        `;
    });
    document.querySelectorAll(".btnExcluirLancamento").forEach(botao => {
        botao.addEventListener("click", () => {
            const indice = Number(botao.dataset.indice);
            lancamentos.splice(indice, 1);
            salvarDados();
            renderizarLancamentos();
            atualizarTotaisLancados();
            atualizarTudo();
        });
    });
}

if(salvarNovoLancamento){
    salvarNovoLancamento.addEventListener("click", () => {
        if(dataNovoLancamento.value === ""){ alert("Informe a data."); return; }
        if(subcategoriaNovoLancamento.value.trim() === ""){ alert("Informe a subcategoria."); return; }
        if(descricaoNovoLancamento.value.trim() === ""){ alert("Informe a descrição."); return; }
        if(valorNovoLancamento.value === ""){ alert("Informe o valor."); return; }
        const subcategoria = subcategoriaNovoLancamento.value.trim();
        const categoriaLancamento = identificarCategoria(subcategoria);
        if(!categoriaLancamento){ alert("Subcategoria não encontrada."); return; }
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
}

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
    renderizarEntradaSaida();
}

//==================================================
// MODO CLARO
//==================================================
const btnConfiguracoes = document.getElementById("btnConfiguracoes");
if (localStorage.getItem("modoClaro") === "true") {
    document.body.classList.add("light-mode");
}
btnConfiguracoes.addEventListener("click", (evento) => {
    evento.preventDefault();
    document.body.classList.toggle("light-mode");
    const isLightMode = document.body.classList.contains("light-mode");
    localStorage.setItem("modoClaro", isLightMode);
    atualizarGrafico();
});

//==================================================
// ENTRADA E SAÍDA
//==================================================
const linkEntradaSaida = document.getElementById("linkEntradaSaida");
const paginaEntradaSaida = document.getElementById("paginaEntradaSaida");

if(linkEntradaSaida){
    linkEntradaSaida.addEventListener("click", (evento) => {
        evento.preventDefault();
        document.querySelector(".dashboard").classList.add("oculto");
        if(paginaFinanceiro) paginaFinanceiro.classList.add("oculto");
        paginaEntradaSaida.classList.remove("oculto");
        renderizarEntradaSaida();
    });
}
if(linkFinanceiro){
    linkFinanceiro.addEventListener("click", (evento) => {
        evento.preventDefault();
        document.querySelector(".dashboard").classList.add("oculto");
        if(paginaEntradaSaida) paginaEntradaSaida.classList.add("oculto");
        paginaFinanceiro.classList.remove("oculto");
    });
}
if(linkInicio){
    linkInicio.addEventListener("click", (evento) => {
        evento.preventDefault();
        if(paginaFinanceiro) paginaFinanceiro.classList.add("oculto");
        if(paginaEntradaSaida) paginaEntradaSaida.classList.add("oculto");
        document.querySelector(".dashboard").classList.remove("oculto");
    });
}

function renderizarEntradaSaida() {
    const tbody = document.getElementById("tbEntradaSaida");
    if(!tbody) return;
    tbody.innerHTML = "";
    const entradas = [{ descricao: "Saldo Total", valor: saldoTotal, classe: "entrada" }];
    const saidas = [];
    dados.essenciais.forEach(item => saidas.push({ ...item, classe: "essencial" }));
    dados.ocasionais.forEach(item => saidas.push({ ...item, classe: "ocasional" }));
    dados.investimentos.forEach(item => saidas.push({ ...item, classe: "investimento" }));
    
    const maxLinhas = Math.max(entradas.length, saidas.length);
    let totalEntrada = 0; let totalSaida = 0;
    
    for (let i = 0; i < maxLinhas; i++) {
        const entrada = entradas[i];
        const saida = saidas[i];
        const tr = document.createElement("tr");
        let html = "";
        if (entrada) {
            html += `
                <td class="bg-dark-${entrada.classe}" style="text-align: left;">${entrada.descricao}</td>
                <td class="bg-dark-${entrada.classe} borda-direita" style="text-align: right; font-weight: bold;">R$ ${entrada.valor.toFixed(2)}</td>
            `;
            totalEntrada += entrada.valor;
        } else {
            html += `<td class="borda-direita"></td><td class="borda-direita"></td>`;
        }
        if (saida) {
            html += `
                <td class="bg-dark-${saida.classe}" style="text-align: left;">${saida.descricao}</td>
                <td class="bg-dark-${saida.classe}" style="text-align: right; font-weight: bold;">R$ ${saida.valor.toFixed(2)}</td>
            `;
            totalSaida += saida.valor;
        } else {
            html += `<td></td><td></td>`;
        }
        tr.innerHTML = html;
        tbody.appendChild(tr);
    }
    const totalEntradaES = document.getElementById("totalEntradaES");
    const totalSaidaES = document.getElementById("totalSaidaES");
    if(totalEntradaES) totalEntradaES.innerText = `R$ ${totalEntrada.toFixed(2)}`;
    if(totalSaidaES) totalSaidaES.innerText = `R$ ${totalSaida.toFixed(2)}`;
    
    const saldoLiquido = totalEntrada - totalSaida;
    const elSaldo = document.getElementById("saldoFinalES");
    if(elSaldo){
        elSaldo.innerText = `R$ ${saldoLiquido.toFixed(2)}`;
        elSaldo.style.color = saldoLiquido >= 0 ? "#34D16A" : "#FF7272";
    }
}

// START
carregarDados();
carregarSubcategorias();
renderizarLancamentos();
atualizarTudo();
