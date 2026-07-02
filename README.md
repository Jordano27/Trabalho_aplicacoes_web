# API de Adoção de Pets

API RESTful em Node.js para gerenciamento de usuários, pets e adoções.

## Stack

- Node.js
- Express
- MySQL
- JWT
- bcrypt
- Jest
- ESLint
- Prettier

## Estrutura

- `src/app.js`: configuração da aplicação Express
- `server.js`: inicialização do servidor
- `src/routes`: rotas da API
- `src/controllers`: entrada HTTP e tratamento de respostas
- `src/services`: regras de negócio
- `src/models`: acesso ao banco
- `src/middlewares`: autenticação e autorização
- `src/config`: configuração do banco e do JWT
- `src/database`: scripts de banco

## Requisitos

- Node.js 18+
- MySQL/MariaDB
- npm

## Instalação

1. Instale as dependências:

```bash
npm install
```

2. Crie o arquivo `.env` com base em `.env.example`.

3. Ajuste os dados do banco e a `JWT_SECRET`.

## Variáveis de ambiente

Exemplo:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=pets_db
JWT_SECRET=sua_chave_jwt_forte_e_secreta
PORT=3000
```

Importante:

- `JWT_SECRET` não pode ficar vazio.
- A aplicação falha ao iniciar se a secret não existir.

## Banco de dados

### Criar estrutura

```bash
npm run db:setup
```

### Criar usuário admin inicial

```bash
npm run db:seed
```

Credenciais padrão do seed:

- Email: EMAIL_ADMIN_
- Senha: SENHA_ADMIN_

## Executar

```bash
npm start
```

## Autenticação

O login retorna um JWT válido por 1 hora.

Header esperado nas rotas protegidas:

```http
Authorization: Bearer <token>
```

## Rotas principais

### Autenticação

- `POST /login`

### Usuários

- `POST /users` cria usuário
- `GET /users` lista usuários
- `GET /users/:id` busca usuário por ID
- `PUT /users/:id` atualiza usuário
- `DELETE /users/:id` remove usuário

### Pets

- `GET /pets/available` lista pets disponíveis
- `GET /pets` lista todos os pets
- `GET /pets/:id` busca pet por ID
- `POST /pets` cria pet
- `PUT /pets/:id` atualiza pet
- `DELETE /pets/:id` remove pet

### Adoções

- `GET /adoptions` lista adoções
- `POST /adoptions` realiza adoção

## Regras de negócio

- Apenas usuários autenticados acessam rotas protegidas.
- Apenas `admin` acessa as rotas administrativas.
- Cadastro público cria apenas `adopter`.
- Um pet só pode ser adotado quando estiver `available`.
- A adoção atualiza o status do pet para `adopted`.
- A operação de adoção usa transação e evita duplicidade do par `usuário + pet`.

## Testes

## Lint e formatação

### Verificar lint

```bash
npm run lint
```

### Corrigir lint

```bash
npm run lint:fix
```

### Formatar

```bash
npm run format
```

## Postman

- Coleção: [`postman/API-Adocao-Pets.postman_collection.json`](postman/API-Adocao-Pets.postman_collection.json)

Ao importar:

1. Importe primeiro o ambiente.
2. Importe a coleção.
3. Selecione o ambiente local no canto superior direito do Postman.
4. Rode `Login Admin` e `Login Adopter` para preencher `adminToken` e `adopterToken` automaticamente.

## Observações

- A chave JWT deve ser mantida apenas no `.env`.
- O arquivo `.env.example` serve somente como modelo.
- O schema do banco já define a relação entre `users`, `pets` e `adoptions`.
