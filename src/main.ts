// Bibliotecas
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
export const app = express();
app.use(cors());
app.use(express.json());

import "./service/rota_emprestimos";
import "./service/rota_livro";
import "./service/rota_usuario";

app.listen(process.env.APP_PORT!, () => {
  console.log("[!] Back-end rodando!");
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/health", (req, res) => {
  res.status(200).send("Ok");
});
