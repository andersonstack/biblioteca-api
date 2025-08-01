import bcrypt from "bcrypt";
import { connectionDB } from "./db";
import { UsuarioComSenha, UsuarioSemSenha } from "../interfaces/interfaces";


export const createUserInBD = async (
  userName: string,
  name: string,
  senha: string
): Promise<201 | 401 | 500> => {
  const connection = await connectionDB();

  if (connection != undefined) {
    try {
      const query = `
        INSERT INTO usuarios (userName, name, senha)
        VALUES (?, ?, ?)
      `;
      const senhaHash = await bcrypt.hash(senha, 10);
      await connection.execute(query, [userName, name, senhaHash]);
      await connection.end();
      return 201;
    } catch (error: any) {

      if (error.code === "ER_DUP_ENTRY") {
        await connection.end();
        return 401;
      }

      await connection.end();
      return 500;
    }
  }

  await connection!.end();
  return 500;
};

export const loginUserInBd = async (
  userName: string,
  senha: string
): Promise<UsuarioSemSenha | null> => {
  const connection = await connectionDB();
  const query = "SELECT id, userName, name, senha, role FROM usuarios WHERE userName = ?";
  const [rows] = await connection!.execute(query, [userName]);

  const usuario = rows as UsuarioComSenha[];

  if (usuario.length === 0) {
    connection!.end();
    return null;
  };

  const usuarioBD = usuario[0];
  const senhaHash = await bcrypt.compare(senha, usuarioBD.senha);

  if (!senhaHash) {
    await connection!.end();
    return null;
  };

  const { senha: _, ...usuarioSemSenha } = usuarioBD;

  await connection!.end();
  return usuarioSemSenha;
};