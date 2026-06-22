const API = 'https://6a28b3024e1e783349a5e7c9.mockapi.io/users';

window.onload = () => {
    carregarMateriais();
    document.getElementById('btn-cadastrar').addEventListener('click', cadastrar);
    document.getElementById('input-busca').addEventListener('input', filtrarLista);

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

let todosMateriais = [];

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
    document.getElementById('total-itens').textContent = materiais.length;

    if (!materiais.length) {
        lista.innerHTML = '<li>Nenhum material cadastrado.</li>';
        return;
    }
    materiais.forEach(item => {
        const li = document.createElement('li');
        li.dataset.id = item.id;
        li.dataset.produto = item.produto || '';
        li.dataset.quantidade = item.quantidade ?? 0;

        if ((item.quantidade ?? 0) < 10) {
            li.classList.add('estoque-critico');
        }

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

function filtrarLista() {
    const termo = document.getElementById('input-busca').value.trim().toLowerCase();
    const filtrados = todosMateriais.filter(item =>
        (item.produto || '').toLowerCase().includes(termo)
    );
    preencherLista(filtrados);
}

async function cadastrar() {
    const nome = document.getElementById('input-nome').value.trim();
    const quantidade = document.getElementById('input-quantidade').value;

    if (!nome || !quantidade) {
        alert('Preencha o nome e a quantidade.');
        return;
    }

    try {
        const resposta = await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ produto: nome, quantidade: Number(quantidade) })
        });
        if (!resposta.ok) throw new Error('Erro ao cadastrar.');
        document.getElementById('input-nome').value = '';
        document.getElementById('input-quantidade').value = '';
        carregarMateriais();
    } catch (erro) {
        alert(erro.message);
    }
}

function validarRetirada(estoqueAtual, quantidadeRetirada) {
    return quantidadeRetirada > 0 && quantidadeRetirada <= estoqueAtual;
}

async function baixarEstoque(botao) {
    const li = botao.closest('li');
    const inputRetirada = document.getElementById('input-retirada');
    const quantidadeRetirada = Number(inputRetirada.value);

    if (!validarRetirada(Number(li.dataset.quantidade), quantidadeRetirada)) {
        alert('Quantidade inválida para retirada.');
        return;
    }

    try {
        const resposta = await fetch(`${API}/${li.dataset.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                produto: li.dataset.produto, 
                quantidade: Number(li.dataset.quantidade) - quantidadeRetirada 
            })
        });
        if (!resposta.ok) throw new Error('Erro ao atualizar estoque.');
        inputRetirada.value = '';
        carregarMateriais();
    } catch (erro) {
        alert(erro.message);
    }
}

async function excluirMaterial(botao) {
    const li = botao.closest('li');
    if (!confirm('Tem certeza que deseja excluir este material?')) return;

    try {
        const resposta = await fetch(`${API}/${li.dataset.id}`, { method: 'DELETE' });
        if (!resposta.ok) throw new Error('Erro ao excluir material.');
        carregarMateriais();
    } catch (erro) {
        alert(erro.message);
    }
}

async function adicionarEstoque(botao) {
    const li = botao.closest('li');
    const inputAdicionar = li.querySelector('.input-adicionar');
    const quantidadeAdicionar = Number(inputAdicionar.value);

    if (!quantidadeAdicionar || quantidadeAdicionar <= 0) {
        alert('Informe uma quantidade válida para adicionar.');
        return;
    }

    try {
        const resposta = await fetch(`${API}/${li.dataset.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                produto: li.dataset.produto, 
                quantidade: Number(li.dataset.quantidade) + quantidadeAdicionar 
            })
        });
        if (!resposta.ok) throw new Error('Erro ao atualizar estoque.');
        inputAdicionar.value = '';
        carregarMateriais();
    } catch (erro) {
        alert(erro.message);
    }
}