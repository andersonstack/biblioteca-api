# 📚 Biblioteca - BACKEND

Repositório responsável pela API da aplicação **Biblioteca**, que atende às requisições do front-end disponível em:  
👉 [Biblioteca - Deploy](https://biblioteca-neon.vercel.app/)

---

## 🚀 Tecnologias Utilizadas

A API foi desenvolvida com **TypeScript** e banco de dados **MySQL**, utilizando os seguintes pacotes:

| Pacote                      | Função Principal                              |
| --------------------------- | --------------------------------------------- |
| `express`                   | Estrutura para criação da API REST            |
| `axios`                     | Cliente HTTP para comunicação com outras APIs |
| `bcrypt`                    | Criptografia de senhas                        |
| `cloudinary`                | Armazenamento de imagens na nuvem             |
| `cors`                      | Permitir requisições cross-origin             |
| `dotenv`                    | Ocultar variáveis sensíveis (ambiente)        |
| `jsonwebtoken`              | Geração e validação de tokens de autenticação |
| `multer`                    | Upload de arquivos                            |
| `multer-storage-cloudinary` | Integração entre Multer e Cloudinary          |
| `mysql2`                    | Driver de conexão com banco de dados MySQL    |
| `path`                      | Manipulação de caminhos de diretório          |

---

## 📁 Estrutura do Projeto (sugerida)

. <br>
├── dist <br>
│ ├── database <br>
│ ├── interfaces <br>
│ ├── middlewares <br>
│ ├── service <br>
│ ├── uploads <br>
│ └── utils <br>
└── src <br>
├── database <br>
├── interfaces <br>
├── middlewares <br>
├── service <br>
├── uploads <br>
└── utils <br>

---

## 🖥️ Funcionalidades

### Rotas de admin

Feito por usuários que possuem permissões de `admi`. É autentificado pelo seu `token`.

| Rota             | Funcionalidade                                                           |
| ---------------- | ------------------------------------------------------------------------ |
| /fazerEmprestimo | Insere novos empréstimos no bacno de dados                               |
| /devolucao       | Marca o empréstimo como devolvido                                        |
| /cadastrarLivro  | Cadastrar um livro com suas informações `titulo, descricao, ano, imagem` |
| /atualizarLivro  | Atualiza um livro no banco de dados                                      |

### Rotas comuns

| Rota               | Funcionalidade                            |
| ------------------ | ----------------------------------------- |
| /livros            | Retorna todos os livros do banco de dados |
| /livrosEmprestimos | Retorna os empréstimos do usuário logado  |
| /login             | Rota de login                             |
| /cadastro          | Rota para fazer cadastro                  |

---

## 🧪 Como Executar Localmente

```bash
    git clone https://github.com/andersonstack biblioteca-api.git
    cd biblioteca-api
    npm install
    npm run dev
```

Porta: `http://localhost:3000`

## 🔗 Front-End

Este backend atende ao front-end da aplicação disponível em:

[https://github.com/andersonstack/biblioteca](https://github.com/andersonstack/biblioteca)

## 📄 Licença

Este projeto está licenciado sob a MIT License.
