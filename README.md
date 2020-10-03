# api-node-mongodb-send-email

Projeto para testar cadastro de usuários com confirmação de email e recuperação de login utilizando base de dados MongoDB.

## Tecnologias utilizadas neste projeto

Diretos:

    * Node.js (12.18.4)
    * express (4.17.1)  
    * mongoose (5.10.7)
    * nodemon (2.0.4)
    * bcryptjs (2.4.3)
    * jsonwebtoken (8.5.1)
    
Indiretos:

    * VSCode
    * Yarn (1.22.5)
    * MongoDB
    * Docker (19.03.13)
    * Insomnia (2020.4.1)

## Como rodar este projeto

Dentro da pasta raiz

    `
    yarn init
    yarn start
    `

## Pré-requisitos

### Instalação MongoDB

Com docker instalado utilizar os comandos do [link](https://gist.github.com/sganzerla/936fa20d3332c6107333e9aa969d5904) para rodar o MongoDB em um container.

### Cliente MongoDB

Para checar as coleções cadastradas no banco de dados pode-se utilizar o plugin oficial [MongoDB](https://marketplace.visualstudio.com/items?itemName=mongodb.mongodb-vscode) no VSCode

## Realizar chamadas API com Insomnia

### Criar variáveis de url

![image]('./resources/insomnia/environment1.png)

![image]('./resources/insomnia/environment2.png)

### Criar requisição post 

![image]('./resources/insomnia/requestpost1.png')

![image]('./resources/insomnia/requestpost2.png')

#### Cadastrar usuários

![image]('./resources/insomnia/requestpost3.png')

#### Realizar login

![image]('./resources/insomnia/auth-post.png')

### Acessar url com autenticação

![image]('./resources/insomnia/get-project.png')
