<h1 align="center">
  <img alt="AgroMart" title="AgroMart" src="https://raw.githubusercontent.com/Hackathon-FGA-2020/Desafio-3-Grupo-6-mobile/master/src/assets/images/logo_0.5.png"/>
</h1>

# 🌱 API

## Funcionalidades
- Criação de conta de usuário e Autenticação;
- Gerenciar lojas;
- Gerenciar assinantes;
- Gerenciar cestas;
- Gerenciar endereços;
- Gerenciar extratos;
- Gerenciar planos;
- Gerenciar produtos avulsos;

## :rocket: Principais Tecnologias Utilizadas

- [Node.js](https://nodejs.org/en/)
- [Strapi](https://github.com/strapi/strapi)

---
## Pré requesitos do sistema
Para executar que o projeto seja executado localmente, são necessárias algumas configurações:
- [node.js](https://nodejs.org/en/) entre as versões ">=10.16.0 <=14.x.x"
- [yarn](https://yarnpkg.com/getting-started/install)
-  [Docker](https://docs.docker.com/engine/installation/) e [Docker Compose](https://docs.docker.com/compose/install/) para execuçaão banco de dados **Postgres**

---
## Como executar o projeto localmente

Clone o repositorio:

```
git clone https://github.com/AgroMart/api.git
```

Acesse a pasta do projeto:

```
cd api
```

Instale as dependências:

```
npm run build
# ou
yarn build
```

Crie e inicie o container de serviço do banco de dados:

```
docker-compose up
```

Inicie CMS (Strapi) do projeto:

```
npm run develop
# ou
yarn develop
```

---
## Cliente Mobile

Os dados são providos para o nosso próprio aplicativo disponível em https://github.com/AgroMart/mobile-client

---

## Como Contribuir

- Se você for um colaborador externo, dê um fork no projeto.
- Crie sua branch e envie seu código nela.
- Faça um pull request da sua branch para a devel.

---

## Licença:

Esse projeto utiliza a licença GNU GENERAL PUBLIC LICENSE. Para mais informações [clique aqui](https://github.com/AgroMart/api/blob/master/LICENSE)
