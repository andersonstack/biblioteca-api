// Bibliotecas
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// Banco de dados
import { getBooksUserInBd } from "./database/database_livrousuario";


dotenv.config();
export const app = express();
app.use(cors());
app.use(express.json());


app.listen(3000, () => {
  console.log("[!] Back-end rodando!");
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/livrosEmprestimos", async (req, res) => {
  const userName = req.body.userName as string;

  const livrosEmprestados = await getBooksUserInBd(userName);
  if (livrosEmprestados?.length != 0) {
    return void res.status(200).json({ sucess: true, livrosEmprestados: livrosEmprestados });
  } else return void res.status(400).json({ sucess: false });
});
