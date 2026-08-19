<h1 align="center">
  <img alt="AgroMart" title="AgroMart" src="https://raw.githubusercontent.com/Hackathon-FGA-2020/Desafio-3-Grupo-6-mobile/master/src/assets/images/logo_0.5.png"/>
</h1>

# 🌱 API

Esta é a API Backend do projeto AgroMart, construída sobre o [Strapi](https://github.com/strapi/strapi).

A arquitetura do projeto foi reformulada para seguir estritamente o padrão **12-Factor App**, sendo distribuída como uma **Imagem Docker (Container as a Service - CaaS)**. Todo o processo de build e publicação de imagens está automatizado via CI/CD.

## 🚀 Como funciona a Implantação (CaaS)

A implantação não depende mais de scripts locais ou passos manuais. Toda vez que um commit for aprovado e inserido na branch `master` ou `main`, o GitHub Actions irá:
1. Montar a imagem Docker da aplicação (utilizando a estratégia *Multi-stage Build* para gerar um contêiner leve e seguro).
2. Fazer o *push* automático da versão compilada para o **GitHub Container Registry (GHCR)**.

### Variáveis de Ambiente Obrigatórias (Produção)
Para rodar a imagem gerada no seu provedor de nuvem (Google Cloud Run, AWS Fargate, Render, etc), você deve injetar obrigatoriamente as seguintes variáveis de ambiente no serviço:

- `DATABASE_URL`: String de conexão completa com o banco (ex: `postgres://user:password@host:5432/agromart_db`)
- `APP_KEYS`: Chaves separadas por vírgula para cookies/sessão
- `API_TOKEN_SALT`: Salt de segurança da API
- `ADMIN_JWT_SECRET`: Secret do JWT do painel administrativo
- `JWT_SECRET`: Secret do JWT de usuários

---

## 💻 Como executar o projeto localmente (DevEx)

### Pré-requisitos
- [Node.js](https://nodejs.org/en/) (Versão recomendada: >=18.x)
- [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
- [Docker](https://docs.docker.com/engine/installation/) e [Docker Compose](https://docs.docker.com/compose/install/)

### Passo a passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/AgroMart/api.git
   cd api
   ```

2. **Inicie o Banco de Dados Local (PostgreSQL):**
   Suba o banco localmente usando o Docker Compose. Não é necessário configurar o `.env` para esta etapa.
   ```bash
   docker-compose up -d
   ```

3. **Configure as Variáveis de Ambiente Locais:**
   Copie o arquivo de exemplo e edite se necessário (por padrão, a `DATABASE_URL` no `.env.example` já aponta para o container do Docker Compose recém-criado).
   ```bash
   cp .env.example .env
   ```

4. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn install
   ```

5. **Inicie o servidor de desenvolvimento (Strapi):**
   ```bash
   npm run develop
   # ou
   yarn develop
   ```

Se necessário rodar observando o front-end administrativo (útil ao desenvolver plugins):
```bash
npm run develop -- --watch-admin
```

### Acessando o Painel
Após o servidor iniciar, acesse o painel administrativo em: `http://localhost:1337/admin`

---

## 🧪 Como executar os testes de integração

O banco de dados de testes agora compartilha o mesmo fluxo do ambiente de desenvolvimento. Certifique-se de que o container do Postgres esteja rodando (`docker-compose up -d`) e execute:

```bash
npm test
# ou
yarn test
```

---

## 📱 Cliente Mobile

Os dados são providos para o nosso próprio aplicativo disponível em: [AgroMart/mobile-client](https://github.com/AgroMart/mobile-client)

---

## 🤝 Como Contribuir

- Se você for um colaborador externo, dê um fork no projeto.
- Crie sua branch e envie seu código nela.
- Faça um pull request da sua branch para a `master`.

---

## 📄 Licença

Esse projeto utiliza a licença GNU GENERAL PUBLIC LICENSE. Para mais informações [clique aqui](LICENSE).
