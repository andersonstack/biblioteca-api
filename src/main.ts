import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { createUserInBD, loginUserInBd } from "./database/db";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.listen(3000, () => {
  console.log("[!] Back-end rodando!");
});

app.post("/cadastro", async (req, res) => {
  const { userName, name, senha } = req.body;

  try {
    const auth = await createUserInBD(userName, name, senha);
    if (auth) {
      return void res
        .status(201)
        .json({ success: true, message: "Usuário criado com sucesso" });
    } else {
      return void res
        .status(401)
        .json({ sucess: false, message: "Usuário já existe no sistema!" });
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
    console.log(auth);

    if (auth) {
      console.log("Login bem sucedido!");

      const token = jwt.sign(
        { userName: auth.userName, id: auth.id },
        process.env.KEY!,
        { expiresIn: "1h" }
      );

      return void res.status(200).json({ success: true, token });
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
