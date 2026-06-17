# Sistema de Estoque — Enfermagem (SENAC Zona Norte)

Sistema web simples para controle de insumos do setor de Enfermagem, desenvolvido como atividade avaliativa. Permite cadastrar materiais, retirar (dar baixa) e repor quantidades, além de excluir itens — sempre validando que o estoque não fique negativo.

## Sobre o projeto

O sistema foi pensado para o dia a dia da Enfermeira responsável pelo controle de materiais (luvas, seringas, gazes, etc.), substituindo uma planilha manual por uma interface simples conectada a uma API. Os dados são persistidos em um backend simulado (MockAPI), então toda alteração feita na tela é refletida no servidor.

## Funcionalidades

- **Cadastrar material**: registra um novo item com nome e quantidade inicial.
- **Listar materiais**: exibe todos os itens cadastrados, com a quantidade em destaque.
- **Editar item** (botão "Editar" em cada linha, abre um painel com duas ações):
  - **Baixar**: retira do estoque a quantidade informada no campo "Quantidade a Retirar" (topo da página).
  - **Adicionar**: repõe estoque a partir de uma quantidade informada no próprio painel.
- **Excluir material**: remove o item da lista e do servidor.

## Regras de negócio

A função `validarRetirada(estoqueAtual, quantidadeRetirada)` garante que uma retirada só é aceita quando:
- a quantidade retirada é maior que zero (não aceita zero ou negativo);
- a quantidade retirada não é maior do que o estoque disponível.

Se qualquer uma dessas condições falhar, a operação é bloqueada e o usuário recebe um aviso.

## Tecnologias utilizadas

- **HTML5** — estrutura da página
- **CSS3** (Flexbox, layout responsivo) — estilo visual
- **JavaScript** (Vanilla, ES6+, Fetch API, async/await) — lógica do sistema e integração com a API
- **MockAPI** — API REST fake usada para simular o backend e persistir os dados

## Estrutura de arquivos
.

├── index.html   # Estrutura da página (formulário, lista, campos)

├── style.css    # Estilos visuais e responsividade

├── main.js      # Lógica do sistema, regras de negócio e chamadas à API

└── README.md    # Este arquivo

## Como rodar o projeto

Não há dependências para instalar — é HTML, CSS e JavaScript puros.

1. Clone o repositório:
git clone <https://github.com/Universidade-Cesumar/prova-2bi-ads-esoft-3sem-rafapiasentin.git>
2. Entre na pasta do projeto.
3. Abra o arquivo `index.html` no navegador (duplo clique) ou use a extensão **Live Server** do VS Code para evitar problemas de carregamento de arquivos locais.
4. É necessária conexão com a internet, pois os dados são lidos e salvos em uma API externa (MockAPI).

## API utilizada

Endpoint base: `https://6a28b3024e1e783349a5e7c9.mockapi.io/users`

| Método | Ação                                          |
|--------|-----------------------------------------------|
| GET    | Lista todos os materiais cadastrados          |
| POST   | Cadastra um novo material                     |
| PUT    | Atualiza a quantidade de um material existente|
| DELETE | Remove um material                            |

## Responsável pelo setor

Enfermeira Camila — SENAC Zona Norte

## Desenvolvimento

Projeto desenvolvido em sprints, com commits semânticos (`feat:`, `fix:`, etc.) registrando a evolução do trabalho.