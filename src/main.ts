import express from "express";
import cors from "cors";
import { createUserInBD, loginUserInBd } from "./database/db";

const app = express();
app.use(cors());
app.use(express.json());

app.listen(3000, () => {
  console.log("[!] Back-end rodando!");
});

app.post("/usuario", async (req, res) => {
  const { userName, name, senha } = req.body;

  try {
    const auth = await createUserInBD(userName, name, senha);
    if (auth) {
      console.log("Requisição concluída");
      return void res
        .status(201)
        .json({ success: true, message: "Usuário criado com sucesso" });
    }
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return void res
      .status(500)
      .json({ success: false, message: "Erro ao criar usuário" });
  }
});

app.post("/login", async (req, res) => {
  const { userName, senha } = req.body;

  try {
    const auth = await loginUserInBd(userName, senha);

    if (auth) {
      console.log("Login bem sucedido!");
      return void res.status(200).json({ success: true });
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
