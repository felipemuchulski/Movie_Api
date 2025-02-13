# Movie API

Este projeto consiste em uma API de filmes, construída com Node.js, Express, Knex.js e SQL Server. A API permite criar, listar, exibir e deletar notas de filmes, além de gerenciar usuários e tags associadas aos filmes.

## Funcionalidades
- **Gerenciamento de Usuários**: Criação e atualização de usuários com criptografia de senhas.
- **Notas de Filmes**: CRUD completo para notas de filmes.
- **Tags**: Gerenciamento de tags para cada nota.

## Estrutura do Projeto
- **server.js**: Configuração principal do servidor Express, tratamento de erros e conexão com o SQL Server.
- **controllers**: Lógica de negócios para usuários, notas e tags.
- **routes**: Rotas da API para cada entidade.
- **database/knex**: Migrations para criar as tabelas de `users`, `Movie_Notes` e `movie_tags`.
- **database/sqlserver**: Configuração de conexão com o banco SQL Server.
- **utils**: Classe `AppError` para tratamento de erros personalizados.

## Configuração do Banco de Dados
A API utiliza o SQL Server como banco de dados, com a configuração definida em `knexfile.js`, que inclui o cliente `mssql` e credenciais locais.

## Como Rodar o Projeto
1. Clone o repositório.
2. Instale as dependências com `npm install`.
3. Execute as migrations com `npx knex migrate:latest`.
4. Inicie o servidor com `npm start`.

## Rotas da API
- `/users` : Criar e atualizar usuários.
- `/notes` : Criar, listar, exibir e deletar notas.
- `/tags` : Listar tags associadas a um usuário.

## Segue estrutura das tabelas:
(image.png)
## Observação
- As credenciais do banco de dados estão definidas diretamente no código e devem ser protegidas em ambiente de produção.

---
