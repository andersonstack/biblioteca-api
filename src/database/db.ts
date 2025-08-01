import mysql from "mysql2/promise";

export const connectionDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      port: 3307,
      password: "123456",
      user: "root",
      database: "biblioteca_bd",
    });
    return connection;
  } catch (error) {
    console.log(`Erro ao conectar com o banco de dados: ${error}`);
  }
};
