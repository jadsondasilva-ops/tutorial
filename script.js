// ==========================================================
// DADOS
// ==========================================================

const essenciais = [
    { nome: "Aluguel", valor: 1200 },
    { nome: "Internet", valor: 100 },
    { nome: "Energia", valor: 180 },
    { nome: "Água", valor: 70 }
];

const ocasionais = [
    { nome: "Cinema", valor: 80 },
    { nome: "Restaurante", valor: 140 },
    { nome: "Roupas", valor: 200 }
];

const investimentos = [
    { nome: "WEGE3", valor: 1200 },
    { nome: "BBAS3", valor: 800 },
    { nome: "VALE3", valor: 600 }
];

const cartoes = [
    { nome: "Nubank", valor: 560 },
    { nome: "Inter", valor: 320 }
];

const pagamentos = [
    { nome: "Seguro", valor: 200, pago: true },
    { nome: "Academia", valor: 90, pago: true },
    { nome: "Spotify", valor: 22, pago: false },
    { nome: "Prime Video", valor: 20, pago: false }
];

const receita = 6000;

// ==========================================================
// PREENCHER TABELAS
// ==========================================================

function preencherTabela(id, dados, possuiPago = false) {

    const tbody = document.getElementById(id);

    dados.forEach(item => {

        const tr = document.createElement("tr");

        if (possuiPago) {

            tr.innerHTML = `
                <td>${item.nome}</td>
                <td>R$ ${item.valor.toFixed(2)}</td>
                <td>${item.pago ? "✅" : "❌"}</td>
            `;

        } else {

            tr.innerHTML = `
                <td>${item.nome}</td>
                <td>R$ ${item.valor.toFixed(2)}</td>
            `;

        }

        tbody.appendChild(tr);

    });

}

preencherTabela("tbEssenciais", essenciais);
preencherTabela("tbOcasionais", ocasionais);
preencherTabela("tbInvestimentos", investimentos);
preencherTabela("tbCartoes", cartoes);
preencherTabela("tbPagamentos", pagamentos, true);

// ==========================================================
// SALDO
// ==========================================================

function soma(lista){

    return lista.reduce((t, item)=> t + item.valor, 0);

}

const totalDespesas =
    soma(essenciais) +
    soma(ocasionais) +
    soma(cartoes) +
    soma(pagamentos);

const saldo = receita - totalDespesas;

document.getElementById("saldoAtual").innerText =
    saldo.toLocaleString("pt-BR", {
        minimumFractionDigits:2
    });

// ==========================================================
// CANVAS - PIZZA
// ==========================================================

const pizza = document.getElementById("pizza");
const ctx = pizza.getContext("2d");

pizza.width = 350;
pizza.height = 350;

const valores = [
    soma(essenciais),
    soma(ocasionais),
    soma(investimentos)
];

const cores = [
    "#4EA5FF",
    "#FFA726",
    "#2ECC71"
];

const total = valores.reduce((a,b)=>a+b,0);

let inicio = 0;

for(let i=0;i<valores.length;i++){

    const angulo = (valores[i]/total) * Math.PI*2;

    ctx.beginPath();

    ctx.moveTo(175,175);

    ctx.arc(
        175,
        175,
        120,
        inicio,
        inicio + angulo
    );

    ctx.fillStyle = cores[i];

    ctx.fill();

    inicio += angulo;

}

// ==========================================================
// LEGENDA
// ==========================================================

ctx.font="16px Arial";

ctx.fillStyle="#4EA5FF";
ctx.fillRect(15,15,18,18);
ctx.fillStyle="white";
ctx.fillText("Essenciais",45,30);

ctx.fillStyle="#FFA726";
ctx.fillRect(15,45,18,18);
ctx.fillStyle="white";
ctx.fillText("Ocasionais",45,60);

ctx.fillStyle="#2ECC71";
ctx.fillRect(15,75,18,18);
ctx.fillStyle="white";
ctx.fillText("Investimentos",45,90);

// ==========================================================
// CANVAS - META MOTO
// ==========================================================

const moto = document.getElementById("moto");
const ctx2 = moto.getContext("2d");

moto.width = 350;
moto.height = 300;

const meta = 40000;
const guardado = 14010;

const largura = 260;

const porcentagem = guardado/meta;

ctx2.fillStyle="#444";
ctx2.fillRect(40,120,largura,40);

ctx2.fillStyle="#2ECC71";
ctx2.fillRect(
    40,
    120,
    largura*porcentagem,
    40
);

ctx2.fillStyle="white";

ctx2.font="18px Arial";

ctx2.fillText("Meta da Moto",40,80);

ctx2.fillText(

`R$ ${guardado.toLocaleString("pt-BR")} / R$ ${meta.toLocaleString("pt-BR")}`,

40,

190

);

// ==========================================================
// FIM
// ==========================================================