import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

interface UsuarioSemSenha {
  id: number;
  userName: string;
  name: string;
}

interface UsuarioComSenha extends UsuarioSemSenha {
  senha: string;
}

const connectionDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      port: 3307,
      password: "password",
      user: "root",
      database: "usuarios",
    });
    return connection;
  } catch (error) {
    console.log(`Erro ao conectar com o banco de dados: ${error}`);
  }
};

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
      connection.end();
      return 201;
    } catch (error) {
      console.log(`Erro ao criar o usuário ${userName}: ${name}`);
      connection.end();
      return 401;
    }
  }
  return 500;
};

export const loginUserInBd = async (
  userName: string,
  senha: string
): Promise<UsuarioSemSenha | null> => {
  const connection = await connectionDB();
  const query = "SELECT * FROM usuarios WHERE userName = ?";
  const [rows] = await connection!.execute(query, [userName]);

  const usuario = rows as UsuarioComSenha[];

  if (usuario.length === 0) return null;

  const usuarioBD = usuario[0];
  const senhaHash = await bcrypt.compare(senha, usuarioBD.senha);

  if (!senhaHash) return null;

  const { senha: _, ...usuarioSemSenha } = usuarioBD;

  return usuarioSemSenha;
};
