import multer from "multer";
import { app } from "../main";
import { getBooksInBd, saveBookInBd, updateBookInBd } from "../database/database_livro";
import { Livro } from "../interfaces/interfaces";
import { autenticarToken, verificarAdmin } from "../middlewares/auth";
import { storage, cloudinary } from "../middlewares/cloudinary";

const upload = multer({ storage }); // CloudinaryStorage via multer

// 📚 Listar livros
app.get("/livros", async (req, res) => {
  const listaLivros = await getBooksInBd();
  if (listaLivros?.length != 0) {
    return void res.status(200).json({ sucess: true, livros: listaLivros });
  } else {
    return void res.status(500).json({ sucess: false });
  }
});

// ➕ Cadastrar livro
app.post("/cadastrarLivro", autenticarToken, verificarAdmin, upload.single('imagem'), async (req, res) => {
  const { titulo, descricao, ano, imagem: imagemLink, disponivel } = req.body;

  let caminhoImagem = "";

  try {
    if (req.file) {
      caminhoImagem = req.file.path;
    } else if (imagemLink && imagemLink.startsWith("http")) {
      // Upload via link externo
      const resultado = await cloudinary.uploader.upload(imagemLink, {
        folder: "biblioteca-livros",
        format: "webp",
        transformation: [{ width: 500, height: 700, crop: "limit" }],
      });
      caminhoImagem = resultado.secure_url;
    } else {
      return void res.status(400).json({ erro: "Imagem não enviada ou inválida" });
    }

    const addBD = await saveBookInBd(titulo, descricao, Number(ano), caminhoImagem);

    if (addBD != null) {
      const livroResponse: Livro = {
        id: addBD.id,
        titulo: addBD.titulo,
        ano: addBD.ano,
        descricao: addBD.descricao,
        imagem_caminho: addBD.imagem_caminho,
        disponibilidade: addBD.disponibilidade
      };

      return void res.status(201).json({ sucess: "Livro cadastrado!", livro: livroResponse });
    } else {
      return void res.status(501).json({ error: "Erro ao adicionar o livro no banco de dados" });
    }
  } catch (error) {
    console.error("Erro ao cadastrar livro:", error);
    return void res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// ✏️ Atualizar livro
app.post("/atualizarLivro", autenticarToken, verificarAdmin, upload.single('imagem'), async (req, res) => {
  const { id, titulo, descricao, ano, imagem: imagemLink, disponivel } = req.body;

  let caminhoImagem = "";

  try {
    if (req.file) {
      caminhoImagem = req.file.path;
    } else if (imagemLink && imagemLink.startsWith("http")) {
      const resultado = await cloudinary.uploader.upload(imagemLink, {
        folder: "biblioteca-livros",
        format: "webp",
        transformation: [{ width: 500, height: 700, crop: "limit" }],
      });
      caminhoImagem = resultado.secure_url;
    } else {
      return void res.status(400).json({ erro: "Imagem não enviada ou inválida" });
    }

    const updateLivro: Livro = {
      id: id,
      titulo: titulo,
      descricao: descricao,
      ano: Number(ano),
      imagem_caminho: caminhoImagem,
      disponibilidade: disponivel ?? 1,
    };

    const updateBD = await updateBookInBd(updateLivro);

    if (updateBD != null) {
      return void res.status(201).json({ sucess: "Livro editado!", livro: updateLivro });
    } else {
      return void res.status(501).json({ error: "Erro ao editar o livro no banco de dados" });
    }
  } catch (error) {
    console.error("Erro ao editar livro:", error);
    return void res.status(500).json({ error: "Erro interno no servidor" });
  }
});
