import { app } from "../main";
import { getBooksUserInBd, borrowABack, returnTheBook } from "../database/database_livrousuario";
import { autenticarToken, AuthenticatedRequest, verificarAdmin } from "../middlewares/auth";

app.post("/livrosEmprestimos", async (req, res) => {
  const userName = req.body.userName as string;

  const livrosEmprestados = await getBooksUserInBd(userName);
  if (livrosEmprestados?.length != 0) {
    return void res.status(200).json({ sucess: true, livrosEmprestados: livrosEmprestados });
  } else return void res.status(400).json({ sucess: false });
});

app.post("/fazerEmprestimo", autenticarToken, verificarAdmin, async (req: AuthenticatedRequest, res) => {
  const idBook = req.body.idBook as number;
  const userName = req.user?.userName;

  if (!userName) {
    return void res.status(403).json({ success: false, message: "Usuário não autenticado" });
  }

  const result = await borrowABack(userName, idBook);
  if (result !== false) return void res.status(200).json({ success: true });

  return void res.status(400).json({ success: false });
});

app.post("/devolucao", autenticarToken, verificarAdmin, async (req: AuthenticatedRequest, res) => {
  const titleBook = req.body.titleBook as string;
  const userName = req.user?.userName;

  if (!userName) {
    return void res.status(403).json({ success: false, message: "Usuário não autenticado" });
  }

  const devolucao = await returnTheBook(userName, titleBook);
  if (devolucao !== false) return void res.status(200).json({ success: true });

  return void res.status(400).json({ success: false });
});
