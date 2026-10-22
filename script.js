const formulario = document.getElementById('formulario');
const campoDescricao = document.querySelector('#descricao');
const campoValor = document.querySelector('#valor');
const campoTipo = document.querySelector('#tipo');
const lista = document.querySelector('#movimentacoes');
const saldoNaTela = document.querySelector('#saldo');
const receitasNaTela = document.querySelector("#total-receitas");
const despesasNaTela = document.querySelector("#despesas");

let saldoEmCentavos = 0;

const dadosSalvos = localStorage.getItem("movimentacoes");
const movimentacoes = dadosSalvos ? 
JSON.parse(dadosSalvos) 
: [];

const moeda = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const descricao = campoDescricao.value.trim();
    const valor = Number(campoValor.value);
    const tipo = campoTipo.value;
    const valorEmCentavos = Math.round(valor * 100);

    if (descricao === "" || !Number.isFinite(valor) || valorEmCentavos <= 0) {
        alert("Por favor, preencha uma descrição e um valor maior que zero.");
        return;
    }

    const movimentacao = {
        descricao: descricao,
        valorEmCentavos: valorEmCentavos,
        tipo: tipo,
    };
    
    movimentacoes.push(movimentacao);
    localStorage.setItem("movimentacoes", JSON.stringify(movimentacoes));
    
    atualizarTela();
    formulario.reset();
    campoDescricao.focus();
}); 

function atualizarTela() {
    lista.textContent = "";
    saldoEmCentavos = 0;
    let totalReceitas = 0;
    let totalDespesas = 0;

 movimentacoes.forEach(function (movimentacao, indice) {
    const centavos = movimentacao.valorEmCentavos ?? movimentacao.valor;

    if (movimentacao.tipo === "receita") {
        saldoEmCentavos += centavos;
        totalReceitas += centavos;
    } else {
        saldoEmCentavos -= centavos;
        total += centavos;
    }

    // A criação do item e do botão continua aqui.

    const item = document.createElement('li');
    const sinal = movimentacao.tipo === "receita" ? "+" : "-";

    const texto = document.createElement('span');

    texto.textContent = `${movimentacao.descricao} - ${sinal} ${moeda.format(centavos / 100)}`;

    const botaoExcluir = document.createElement('button');
    botaoExcluir.type = "button";
    botaoExcluir.textContent = "Excluir";
    botaoExcluir.classList.add("botao-excluir");

    botaoExcluir.addEventListener("click", function() {
        const confirmou = window.confirm(
            `Tem certeza que deseja excluir "${movimentacao.descricao}"?`
        );
        if (!confirmou) {
            return;
        }
        
        movimentacoes.splice(indice, 1);

        localStorage.setItem(
            "movimentacoes",
            JSON.stringify(movimentacoes)
        );

        atualizarTela();
    });

    item.appendChild(texto);
    item.appendChild(botaoExcluir);
    lista.appendChild(item);
});

saldoNaTela.textContent = moeda.format(saldoEmCentavos / 100);
receitasNaTela.textContent = moeda.format(totalReceitas / 100);
despesasNaTela.textContent = moeda.format(totalDespesas / 100);
}

atualizarTela();

async function verificarAPI() {
    try {
        const resposta = await fetch("./api/status.php");

        if (!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }
    
        const dados = await resposta.json();

        console.log("status:", dados.status);
        console.log("Mensagem:", dados.mensagem);

    } catch (erro) {
        console.error("Erro ao conectar com PHP:", erro);
    }
}

verificarAPI();