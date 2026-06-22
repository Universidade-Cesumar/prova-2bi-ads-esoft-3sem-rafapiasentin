const API = 'https://6a28b3024e1e783349a5e7c9.mockapi.io/users';

window.onload = () => {
    carregarMateriais();
    document.getElementById('btn-cadastrar').addEventListener('click', cadastrar);

    document.getElementById('input-busca').addEventListener('input', filtrarLista);
        let todosMateriais = [];
            function filtrarLista() {
            const termo = document.getElementById('input-busca').value.trim().toLowerCase();
            const filtrados = todosMateriais.filter(item =>
            (item.produto || '').toLowerCase().includes(termo)
        );
            preencherLista(filtrados);
        }

        document.getElementById('lista-materiais').addEventListener('click', (evento) => {
        if (evento.target.classList.contains('btn-baixar')) {
            baixarEstoque(evento.target);
        } else if (evento.target.classList.contains('btn-excluir')) {
            excluirMaterial(evento.target);
        } else if (evento.target.classList.contains('btn-editar')) {
            evento.target.closest('li').querySelector('.painel-edicao').classList.toggle('aberto');
        } else if (evento.target.classList.contains('btn-adicionar')) {
            adicionarEstoque(evento.target);
        }
    });
};

async function carregarMateriais() {
    try {
        const resposta = await fetch(API);
        if (!resposta.ok) throw new Error('Erro ao carregar dados.');
        let dados = await resposta.json();
        if (dados.length === 1 && Array.isArray(dados[0])) dados = dados[0];
        todosMateriais = dados;
        preencherLista(todosMateriais);
    } catch (erro) {
        document.getElementById('lista-materiais').innerHTML = `<li>Erro: ${erro.message}</li>`;
    }
}

function preencherLista(materiais) {
    const lista = document.getElementById('lista-materiais');
    lista.innerHTML = '';
    if (!materiais.length) {
        lista.innerHTML = '<li>Nenhum material cadastrado.</li>';
        return;
    }
     materiais.forEach(item => {
        const li = document.createElement('li');
        li.dataset.id = item.id;
        li.dataset.produto = item.produto || '';
        li.dataset.quantidade = item.quantidade ?? 0;

        const info = document.createElement('span');
        info.appendChild(document.createTextNode(`${item.produto || 'Sem nome'} `));
        const qtdSpan = document.createElement('span');
        qtdSpan.className = 'qtd-valor';
        qtdSpan.textContent = `Quantidade: ${item.quantidade ?? 0}`;
        info.appendChild(qtdSpan);
        const acoes = document.createElement('div');
        acoes.className = 'item-actions';
        acoes.appendChild(criarBotao('Editar', 'btn-editar'));
        acoes.appendChild(criarBotao('Excluir', 'btn-excluir'));

        const topo = document.createElement('div');
        topo.className = 'item-topo';
        topo.appendChild(info);
        topo.appendChild(acoes);

        const painel = document.createElement('div');
        painel.className = 'painel-edicao';
        painel.appendChild(criarBotao('Baixar', 'btn-baixar'));

        const grupoAdicionar = document.createElement('div');
        grupoAdicionar.className = 'adicionar-grupo';
        const inputAdicionar = document.createElement('input');
        inputAdicionar.type = 'number';
        inputAdicionar.className = 'input-adicionar';
        inputAdicionar.min = '1';
        inputAdicionar.placeholder = 'Qtd a adicionar';
        grupoAdicionar.appendChild(inputAdicionar);
        grupoAdicionar.appendChild(criarBotao('Adicionar', 'btn-adicionar'));
        painel.appendChild(grupoAdicionar);

        li.appendChild(topo);
        li.appendChild(painel);
        lista.appendChild(li);
    });
}

function criarBotao(texto, classe) {
    const btn = document.createElement('button');
    btn.className = classe;
    btn.textContent = texto;
    return btn;
}

async function cadastrar() {
    const nome = document.getElementById('input-nome').value.trim();
    const quantidade = document.getElementById('input-quantidade').value;

    if (!nome || !quantidade) {
        alert('Preencha o nome e a quantidade.');
        return;
    }

    const novoItem = {
        produto: nome,
        quantidade: Number(quantidade)
    };

    try {
        const resposta = await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoItem)
        });
        if (!resposta.ok) throw new Error('Erro ao cadastrar.');
        alert(' Material cadastrado com sucesso!');
        document.getElementById('input-nome').value = '';
        document.getElementById('input-quantidade').value = '';
        carregarMateriais();
    } catch (erro) {
        alert( + erro.message);
    }
}

function validarRetirada(estoqueAtual, quantidadeRetirada) {
    if (quantidadeRetirada <= 0) return false;
    if (quantidadeRetirada > estoqueAtual) return false;
    return true;
}

async function baixarEstoque(botao) {
    const li = botao.closest('li');
    const id = li.dataset.id;
    const produto = li.dataset.produto;
    const estoqueAtual = Number(li.dataset.quantidade);
    const quantidadeRetirada = Number(document.getElementById('input-retirada').value);

    if (!validarRetirada(estoqueAtual, quantidadeRetirada)) {
        alert('⚠️ Quantidade inválida para retirada.');
        return;
    }

    const novaQuantidade = estoqueAtual - quantidadeRetirada;

    try {
        const resposta = await fetch(`${API}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ produto, quantidade: novaQuantidade })
        });
        if (!resposta.ok) throw new Error('Erro ao atualizar estoque.');
        document.getElementById('input-retirada').value = '';
        carregarMateriais();
    } catch (erro) {
        alert( + erro.message);
    }
}

async function excluirMaterial(botao) {
    const li = botao.closest('li');
    const id = li.dataset.id;

    if (!confirm('Tem certeza que deseja excluir este material?')) return;

    try {
        const resposta = await fetch(`${API}/${id}`, { method: 'DELETE' });
        if (!resposta.ok) throw new Error('Erro ao excluir material.');
        carregarMateriais();
    } catch (erro) {
        alert( + erro.message);
    }
}

async function adicionarEstoque(botao) {
    const li = botao.closest('li');
    const id = li.dataset.id;
    const produto = li.dataset.produto;
    const estoqueAtual = Number(li.dataset.quantidade);
    const inputAdicionar = li.querySelector('.input-adicionar');
    const quantidadeAdicionar = Number(inputAdicionar.value);

    if (!quantidadeAdicionar || quantidadeAdicionar <= 0) {
        alert('Informe uma quantidade válida para adicionar.');
        return;
    }

    const novaQuantidade = estoqueAtual + quantidadeAdicionar;

    try {
        const resposta = await fetch(`${API}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ produto, quantidade: novaQuantidade })
        });
        if (!resposta.ok) throw new Error('Erro ao atualizar estoque.');
        inputAdicionar.value = '';
        carregarMateriais();
    } catch (erro) {
        alert( + erro.message);
    }
}
