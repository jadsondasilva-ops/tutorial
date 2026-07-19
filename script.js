//==========================================
// DADOS
//==========================================

const despesasEssenciais = [

    { nome:"Aluguel", valor:800 },
    { nome:"Luz", valor:170 },
    { nome:"Água", valor:90 },
    { nome:"Internet", valor:110 },
    { nome:"Celular", valor:65 }

];

const despesasOcasionais = [

    { nome:"Cinema", valor:90 },
    { nome:"Lazer", valor:200 },
    { nome:"Restaurante", valor:170 }

];

const investimentos = [

    { nome:"WEGE3", valor:1400 },
    { nome:"BBAS3", valor:950 },
    { nome:"VALE3", valor:800 }

];

const cartoes = [

    { nome:"Nubank", valor:620 },
    { nome:"Inter", valor:230 }

];

const pagamentos = [

    { nome:"Academia", valor:90 },
    { nome:"Seguro", valor:150 },
    { nome:"Spotify", valor:22 }

];

const salario = 6000;


//==========================================
// FUNÇÕES
//==========================================

function soma(lista){

    return lista.reduce((total,item)=> total + item.valor,0);

}


function preencherTabela(id,dados){

    const tabela = document.getElementById(id);

    tabela.innerHTML = "";

    dados.forEach(item => {

        tabela.innerHTML += `
            <tr>
                <td>${item.nome}</td>
                <td>R$ ${item.valor.toFixed(2)}</td>
            </tr>
        `;

    });

    const linhasExtras = 16 - dados.length;

    for (let i = 0; i < linhasExtras; i++) {

        tabela.innerHTML += `
            <tr>
                <td>&nbsp;</td>
                <td></td>
            </tr>
        `;
    }

}

preencherTabela("tbEssenciais",despesasEssenciais);

preencherTabela("tbOcasionais",despesasOcasionais);

preencherTabela("tbInvestimentos",investimentos);

preencherTabela("tbCartoes",cartoes);

preencherTabela("tbPagamentos",pagamentos);

document.getElementById("totalEssenciais").innerHTML =
"R$ " + soma(despesasEssenciais).toLocaleString("pt-BR");

document.getElementById("totalOcasionais").innerHTML =
"R$ " + soma(despesasOcasionais).toLocaleString("pt-BR");

document.getElementById("totalInvestimentos").innerHTML =
"R$ " + soma(investimentos).toLocaleString("pt-BR");

const saldo =

salario

-

soma(despesasEssenciais)

-

soma(despesasOcasionais)

-

soma(cartoes)

-

soma(pagamentos);

document.getElementById("saldo").innerHTML =

"R$ "

+

saldo.toLocaleString("pt-BR",{

minimumFractionDigits:2

});

//==========================================
// GRÁFICO DE DISTRIBUIÇÃO
//==========================================

const graficoPizza = document
.getElementById("graficoPizza");

new Chart(graficoPizza, {

    type: "pie",

    data: {

        labels: [

            "Essenciais",

            "Ocasionais",

            "Investimentos"

        ],

        datasets: [{

            data: [

                soma(despesasEssenciais),

                soma(despesasOcasionais),

                soma(investimentos)

            ],

            backgroundColor: [

                "#d76b6b",

                "#d8a15c",

                "#6b87d8"

            ],

            borderColor:"#111318",

            borderWidth:3

        }]

    },

    options:{

        responsive:true,

        plugins:{

            legend:{

                position:"bottom",

                labels:{

                    color:"white",

                    padding:20,

                    font:{

                        size:14

                    }

                }

            }

        }

    }

});