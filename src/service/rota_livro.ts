import multer from "multer";
import { app } from "../main";
import { getBooksInBd, saveBookInBd, updateBookInBd } from "../database/database_livro";
import { baixarImagem } from "../utils/settings";
import { Livro } from "../interfaces/interfaces";

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


app.get("/livros", async (req, res) => {
  const listaLivros = await getBooksInBd();
  if (listaLivros?.length != 0) {
    return void res.status(200).json({ sucess: true, livros: listaLivros });
  } else return void res.status(500).json({ sucess: false });
});

app.post("/cadastrarLivro", upload.single('imagem'), async (req, res) => {
  const {titulo, descricao, ano, imagem: imagemLink, disponivel} = req.body;

  let caminhoImagem = ''

  if (req.file) {
    // Envio upload
    caminhoImagem = `/uploads/${req.file.filename}`;
  } else if (imagemLink && imagemLink.startsWith('http')) {
    // Envio link
    const imagemBaixada: Promise<string> = baixarImagem(imagemLink);
    caminhoImagem = (await imagemBaixada).toString();
    
    if (caminhoImagem.length == 0)
      return void res.status(400).json({ erro: 'Erro ao baixar imagem externa' });

  } else {
    return void res.status(400).json({ erro: 'Imagem não enviada ou inválida' });
  }

  const addBD = await saveBookInBd(titulo, descricao, Number(ano), caminhoImagem);

  if (addBD != null) 
    return void res.status(201).json({sucess: "Livro cadastrado!"});
  return void res.status(501).json({ error: "Erro ao adicionar o livro no banco de dados" });
});

app.post("/atualizarLivro", upload.single('imagem'), async (req, res) => {
  const {id, titulo, descricao, ano, imagem: imagemLink, disponivel} = req.body;

  let caminhoImagem = '';
  if (req.file) {
     // Envio upload
     caminhoImagem = `/uploads/${req.file.filename}`;
   } else if (imagemLink && imagemLink.startsWith('http')) {
     // Envio link
     const imagemBaixada: Promise<string> = baixarImagem(imagemLink);
     caminhoImagem = (await imagemBaixada).toString();

     if (caminhoImagem.length == 0)
       return void res.status(400).json({ erro: 'Erro ao baixar imagem externa' });

   } else {
     return void res.status(400).json({ erro: 'Imagem não enviada ou inválida' });
   }

   const updateLivro: Livro = {
    id: id,
    titulo: titulo,
    descricao: descricao,
    ano: Number(ano),
    imagem_caminho: caminhoImagem,
    disponibilidade: disponivel
   }

   const updateBD = await updateBookInBd(updateLivro);

   if (updateBD != null) 
     return void res.status(201).json({sucess: "Livro editado!"});
   return void res.status(501).json({ error: "Erro ao editar o livro no banco de dados" });
});