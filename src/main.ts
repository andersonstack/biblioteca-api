import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { createUserInBD, loginUserInBd, getBooksInBd, getBooksUserInBd } from "./database/db";
import path from "path";
import multer from 'multer';
import { baixarImagem } from "./utils/settings";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

/* Configurando onde as imagens serão salvas */
const storage = multer.diskStorage({
  destination: "./src/uploads/",
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });
///

app.listen(3000, () => {
  console.log("[!] Back-end rodando!");
});

app.post("/cadastro", async (req, res) => {
  const { userName, name, senha } = req.body;

  const auth = await createUserInBD(userName, name, senha);

  if (auth === 201) 
    return void res.status(201).json({ success: true, message: "Usuário criado com sucesso" });

  if (auth === 401) 
    return void res.status(400).json({ success: false, message: "Usuário já existe no sistema!" });
  
  return void res.status(500).json({ success: false, message: "Erro ao criar usuário" });
  
});

app.post("/login", async (req, res) => {
  const { userName, senha } = req.body;

  try {
    const auth = await loginUserInBd(userName, senha);

    if (auth) {
      console.log("Login bem sucedido!");

      const name = auth["name"];
      const userName = auth["userName"];
      const role = auth["role"];

      const token = jwt.sign(
        { userName: auth.userName, id: auth.id, role: auth.role },
        process.env.KEY!,
        { expiresIn: "1h" }
      );
      return void res.status(200).json({ success: true, token, name, userName, role });
    } else {
      console.log("Falha ao entrar!");
      return void res
        .status(401)
        .json({ success: false, message: "Credenciais inválidas" });
    }
  } catch (error) {
    console.error("Erro no login:", error);
    return void res
      .status(500)
      .json({ success: false, message: "Erro interno no servidor" });
  }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/livros", async (req, res) => {
  const listaLivros = await getBooksInBd();
  if (listaLivros?.length != 0) {
    return void res.status(200).json({ sucess: true, livros: listaLivros });
  } else return void res.status(500).json({ sucess: false });
});

app.post("/livrosEmprestimos", async (req, res) => {
  const userName = req.body.userName as string;

  const livrosEmprestados = await getBooksUserInBd(userName);
  if (livrosEmprestados?.length != 0) {
    return void res.status(200).json({ sucess: true, livrosEmprestados: livrosEmprestados });
  } else return void res.status(400).json({ sucess: false });
});

app.post("/cadastrarLivro", upload.single('imagem'), async (req, res) => {
  const {titulo, descricao, ano, imagem: imagemLink} = req.body;

  let caminhoImagem = ''

  if (req.file) {
    // Envio upload
    caminhoImagem = `src/uploads/${req.file.filename}`;
  } else if (imagemLink && imagemLink.startsWith('http')) {
    // Envio link
    const imagemBaixada: Promise<string> = baixarImagem(imagemLink);
    caminhoImagem = (await imagemBaixada).toString();
    
    if (caminhoImagem.length == 0)
      return void res.status(400).json({ erro: 'Erro ao baixar imagem externa' });

  } else {
    return void res.status(400).json({ erro: 'Imagem não enviada ou inválida' });
  }

  return void res.status(201).json({sucess: "Livro cadastrado!"});
})
