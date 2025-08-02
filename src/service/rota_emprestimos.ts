import { app } from "../main";
import { getBooksUserInBd, borrowABack, returnTheBook } from "../database/database_livrousuario";

app.post("/livrosEmprestimos", async (req, res) => {
  const userName = req.body.userName as string;

  const livrosEmprestados = await getBooksUserInBd(userName);
  if (livrosEmprestados?.length != 0) {
    return void res.status(200).json({ sucess: true, livrosEmprestados: livrosEmprestados });
  } else return void res.status(400).json({ sucess: false });
});

app.post("/fazerEmprestimo", async (req, res) => {
  const {idUser, idBook} = req.body;

  const result = await borrowABack(idUser, idBook);

  if (result != false) return void res.status(200).json({sucess: true});
  return void res.status(400).json({sucess: false});
  
})

app.post("/devolverEmprestimo", async (req, res) => {
  const {idEmprestimo, idBook} = req.body;
  
  const devolucao = await returnTheBook(idEmprestimo, idBook);

  if (devolucao != false) return void res.status(200).json({ sucess: true });
  return void res.status(400).json({ sucess: false });
})
