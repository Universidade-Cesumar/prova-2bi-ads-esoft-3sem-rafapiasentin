const API = 'https://6a28b3024e1e783349a5e7c9.mockapi.io/users';

window.onload = () => {
    carregarMateriais();
    document.getElementById('btn-cadastrar').addEventListener('click', cadastrar);
};

async function carregarMateriais() {
    try {
        const resposta = await fetch(API);
        if (!resposta.ok) throw new Error('Erro ao carregar dados.');
        let dados = await resposta.json();
        if (dados.length === 1 && Array.isArray(dados[0])) dados = dados[0];
        preencherLista(dados);
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
        li.textContent = `${item.produto || 'Sem nome'} — Qtd: ${item.quantidade ?? 0}`;
        li.dataset.id = item.id;
        lista.appendChild(li);
    });
}