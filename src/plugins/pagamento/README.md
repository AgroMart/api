# Strapi Plugin Pagamento

O Strapi Plugin Pagament é um módulo da API Agromart desenvolvida no estudo da monografia de Giovanna Bottino. Com o objetivo de implementar um integrador de pagamento digital, desenvolvendo uma funcionalidade que permita a geração de uma URL de pagamento por meio de uma API, facilitando a gestão financeira e possibilitando transações seguras e eficientes. 

## Casos de Uso

A fim de representar os possíveis comportamentos da aplicação central em Strapi ao integrar com o novo serviço API de Pagamento em Node, foi usado o diagrama de casos de uso. Isso porque representam algumas funcionalidades que são significativas do sistema final. Essas funcionalidades são:

- Caso 1 - Escolher Gateway
- Caso 2 - Visualizar Extrato
- Caso 3 - Gerar link para Pagamento
- Caso 4 - Pagar

Para esse projeto, foi criado um diagrama com os atores: agricultor, administrador do sistema; o co-agricultor, usuário cliente que utiliza para pagamento. 

Na Figura de caso de uso, é possível ver o diagrama dos casos 1, 2, 3 e 4, cenário onde o ator agricultor escolhe o gateway de pagamento e gera link para o pagamento onde o co-agricultor pode pagar. Esse diagrama também indica que quando o caso 3 for executado, deve-se ter escolhido um gateway e o caso 4 poderá ser executado. Além disso, o agricultor pode visualizar o extrato. 

![casos-uso (1)](https://github.com/AgroMart/api/assets/31159235/00b3c90a-3e31-4285-8303-623bf3be4ca7)

## Visão de Dados

Auxiliando o entendimento da solução, foi feito uma diagrama de entidade. Esse diagrama,  equivale a visão de dados que descreve como o sistema persiste as informações. Descrevendo a decomposição em entidades que fornece informações sobre como o sistema é estruturado e relacionado.

- Pagamento: refere-se a como o pagamento foi realizado, e a url temporária gerada;
- Gateway: trata-se da entidade reservada para salvar informações sobre o Gateway de Pagamento utilizado e seu token de acesso

![classe](https://github.com/AgroMart/api/assets/31159235/e9f56726-a4c1-40cd-8198-ce6a125e8e88)

## Visão de Processo

Representando a visão do processo foi utilizado o diagrama de sequência que é um diagrama de UML dinâmica que mostra uma sequência de eventos. Isso é, enfatiza a ordenação temporal das mensagens ao mostrar interações na ordem em que ocorrem. Essa categoria de diagrama auxilia a entender os requisitos de um sistema. Além disso, mostra como mensagens são trocadas entre os componentes. 

Foram utilizados, porque permitem um melhor entendimento do projeto e aplicação. Com ele pode-se identificar como os objetos no sistema interagem entre si para implementar as funcionalidades.

Para esse projeto, foram criados 2 diagramas de sequência. Na Figura de sequencia de criar gateway é possível observar a sequência de eventos que ocorre para o registro de um gateway na perspectiva de AgroMart. Nesse processo é preciso que o Agricultor através da interface solicite a integração de um gateway ao seu token de acesso. Visando que esse token seja salvo no banco de dados, a interface do Strapi requisita à API que acione o banco de dados. Esse diagrama representa o caso de uso 1.

![seq1](https://github.com/AgroMart/api/assets/31159235/5d52fa63-8325-4dcf-8850-3fbfd0b24638)

Com o intuito de gerar a URL de pagamento, o caso de uso 3, na Figura de sequencia de gerar URL tem-se o processo que começa com a interação do usuário com a tela. O controlador de pagamentos é acionado que atribui o trabalho aos services de gateway e pagamento. Esses services buscam na base de dados as informações para serem enviadas à API de pagamento e após requisitar ao gateway encarregado. Por fim, se tudo ocorrer precisamente, será salvo as informações no banco de dados e retornado a URL gerada para o usuário.

![seq2](https://github.com/AgroMart/api/assets/31159235/cff82811-d73e-457b-99d1-2cbd15948b17)

## Gateway de Pagamento Integrados

Esse módulo de pagamento possui a integração com dois gateways de pagamento, eles são: Mercado Pago e PayPal. 

O módulo de pagamento foi desenvolvido genérico o suficiente para ser possível adicionar novas integrações. Para isso, basta adicionar no arquivo [gateway](https://github.com/AgroMart/api/blob/devel/src/plugins/pagamento/server/utils/gateway.js) na `const gatewayRequest` a configuração necessária para a integração via código de novos gateways: 


