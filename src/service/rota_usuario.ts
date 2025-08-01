import jwt from "jsonwebtoken";
import { app } from "../main";
import { createUserInBD, loginUserInBd } from "../database/database_usuario";

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
