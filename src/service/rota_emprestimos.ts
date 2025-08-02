import { app } from "../main";
import { getBooksUserInBd, borrowABack } from "../database/database_livrousuario";

app.post("/livrosEmprestimos", async (req, res) => {
  const userName = req.body.userName as string;

  const livrosEmprestados = await getBooksUserInBd(userName);
  if (livrosEmprestados?.length != 0) {
    return void res.status(200).json({ sucess: true, livrosEmprestados: livrosEmprestados });
  } else return void res.status(400).json({ sucess: false });
});

app.post("/fazerEmprestimo", async (req, res) => {
  const {idUser, idBook} = req.body;

  const result = borrowABack(idUser, idBook);

  if (result != null) return void res.status(200).json({sucess: true});
  return void res.status(400).json({error: true});
  
})
