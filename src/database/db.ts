import mysql from "mysql2/promise";

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
  user: String,
  nome: String,
  senha: String
) => {
  const connection = await connectionDB();

  if (connection != undefined) {
    try {
      const query = `
                INSERT INTO usuario (user_name, name, senha)
                    VALUES (?, ?, ?)
            `;
      await connection.execute(query, [user, nome, senha]);
      console.log(`Usuário '${user} adicionado com sucesso!'`);
      connection.end();
    } catch (error) {
      console.log(`Erro ao criar o usuário ${user}: ${nome}`);
      connection.end();
    }
  }
};

export const loginUserInBd = async (
  userName: string,
  senha: string
): Promise<boolean> => {
  const connection = await connectionDB();
  const query = "SELECT * FROM usuarios WHERE userName = ? AND senha = ?";
  const [rows] = await connection!.execute(query, [userName, senha]);

  return (rows as any[]).length > 0;
};
