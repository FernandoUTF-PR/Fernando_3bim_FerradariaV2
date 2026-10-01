const URL_API = 'http://localhost:3001';

let oQueEstaFazendo = '';
let formaPagamento = null;
bloquearAtributos(true);

async function inicializar() {
    await listar();
}

async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/formaPagamento/${chave}`);
        const data = await resposta.json();
        return data.sucesso ? data.formaPagamento : null;
    } catch (erro) {
        return null;
    }
}

async function procure() {
    const id_forma_pagamento = document.getElementById("inputID_forma_pagamento").value;
    if (!id_forma_pagamento) {
        mostrarAviso("Deve conter pagamento, seu caloteiro / ladrão.");
        return;
    }

    document.getElementById("inputID_forma_pagamento").value = id_forma_pagamento;
    formaPagamento = await procurePorChavePrimaria(id_forma_pagamento);
    oQueEstaFazendo = '';
    
    if (formaPagamento) {
        mostrarDadosPagamento(formaPagamento);
        visibilidadeDosBotoes('inline', 'none', 'inline', 'inline', 'none');
        mostrarAviso("Achou no banco, pode alterar ou excluir");
    } else {
        limparAtributos();
        visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');
        mostrarAviso("Não achou no banco, pode inserir");
    }
}

function inserir() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'inserindo';
    mostrarAviso("INSERINDO - Digite o nome do pagamento e clique em salvar");
}

function alterar() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'alterando';
    mostrarAviso("ALTERANDO - Digite o novo nome e clique em salvar");
}

function excluir() {
    bloquearAtributos(true);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - Clique em salvar para confirmar a exclusão");
}

async function salvar() {
    const id_forma_pagamento = document.getElementById("inputID_forma_pagamento").value;
    const nome_forma_pagamento = document.getElementById("inputNome_forma_pagamento").value;

    const dadosPagamento = { id_forma_pagamento, nome_forma_pagamento };

    try {
        if (oQueEstaFazendo === 'inserindo') {
            const resp = await fetch(`${URL_API}/formaPagamento`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosPagamento) });
            const data = await resp.json();
            if (!data.sucesso) return mostrarAviso(data.mensagem);
            mostrarAviso("Inserido no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'alterando') {
            const resp = await fetch(`${URL_API}/formaPagamento/${id_forma_pagamento}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosPagamento) });
            const data = await resp.json();
            if (!data.sucesso) return mostrarAviso(data.mensagem);
            mostrarAviso("Alterado no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'excluindo') {
            const resposta = await fetch(`${URL_API}/formaPagamento/${id_forma_pagamento}`, { method: 'DELETE' });
            const data = await resposta.json();
            if (!data.sucesso) {
                mostrarAviso(data.mensagem || "Erro ao excluir no servidor.");
                return;
            }
            mostrarAviso("Excluído do Banco de Dados!");
        }

        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        document.getElementById("inputID_forma_pagamento").value = "";
        listar();
    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

async function listar() {
   
    try {
        const resposta = await fetch(`${URL_API}/formaPagamento/listar`);
        const data = await resposta.json();
        if (data.sucesso) {
            let texto = "";
            for (let linha of data.formaPagamento) {
                texto += `<b>[${linha.id_forma_pagamento}]</b> - ${linha.nome_forma_pagamento}<br>`;
            }
            document.getElementById("outputSaida").innerHTML = texto || "Nenhuma forma de pagamento cadastrado.";
        } else {
            document.getElementById("outputSaida").innerHTML = `Erro no banco: ${data.mensagem}`;
        }
    } catch (erro) {
        alert("diabo n mora nesse detalhe");
        console.error("Erro ao listar:", erro);
        document.getElementById("outputSaida").innerHTML = "Servidor offline ou erro de conexão (CORS).";
    }
}

function cancelarOperacao() {
    limparAtributos();
    bloquearAtributos(true);
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
    mostrarAviso("Cancelou a operação");
}

function mostrarAviso(mensagem) {
    document.getElementById("divAviso").innerHTML = mensagem;
}

function mostrarDadosPagamento(formaPagamento) {
    document.getElementById("inputID_forma_pagamento").value = formaPagamento.id_forma_pagamento;
    document.getElementById("inputNome_forma_pagamento").value = formaPagamento.nome_forma_pagamento;
    bloquearAtributos(true);
}

function limparAtributos() {
    formaPagamento = null;
    oQueEstaFazendo = '';
    document.getElementById("inputNome_forma_pagamento").value = "";
    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("inputID_forma_pagamento").readOnly = !soLeitura;
    document.getElementById("inputNome_forma_pagamento").readOnly = soLeitura;
}

function visibilidadeDosBotoes(btP, btI, btA, btE, btS) {
    document.getElementById("btProcure").style.display = btP;
    document.getElementById("btInserir").style.display = btI;
    document.getElementById("btAlterar").style.display = btA;
    document.getElementById("btExcluir").style.display = btE;
    document.getElementById("btSalvar").style.display = btS;
    document.getElementById("btCancelar").style.display = btS;
}