import { connectionDB } from "./db";
import { Livro } from "../interfaces/interfaces";

export const getBooksInBd = async (): Promise<Livro[] | null> => {
  const connection = await connectionDB();
  const [rows] = await connection!.execute(
    "SELECT id, titulo, ano, descricao, imagem_caminho, disponibilidade FROM livros"
  );
  const livrosLista = rows as Livro[];
  if (livrosLista.length === 0) {
    await connection!.end();
    return null;
  };

  await connection!.end();
  return livrosLista;
};


export const saveBookInBd = async (
  titulo: string,
  descricao: string,
  ano: number,
  imagem: string
): Promise<any> => {
  const connection = await connectionDB();

  const insertQuery = `
    INSERT INTO livros (titulo, ano, descricao, imagem_caminho, disponibilidade)
    VALUES (?, ?, ?, ?, 1)
  `;

  const [result]: any = await connection!.execute(insertQuery, [
    titulo,
    ano,
    descricao,
    imagem,
  ]);

  const insertedId = result.insertId;

  const [rows]: any = await connection!.execute(
    `SELECT * FROM livros WHERE id = ?`,
    [insertedId]
  );

  await connection!.end();

  return rows[0];
};

export const updateBookInBd = async (livro: Livro): Promise<Livro | null> => {
  const connection = await connectionDB();

  const updateQuery = `
    UPDATE livros
      SET
        titulo = ?,
        ano = ?,
        descricao = ?,
        imagem_caminho = ?,
        disponibilidade = ?
      WHERE id = ?
  `;

  const [result]: any = await connection!.execute(updateQuery, [
    livro.titulo,
    livro.ano,
    livro.descricao,
    livro.imagem_caminho,
    livro.disponibilidade,
    livro.id,
  ]);

  if (result.affectedRows === 0) {
    await connection!.end();
    return null;
  }

  const [rows]: any = await connection!.execute(
    `SELECT * FROM livros WHERE id = ?`,
    [livro.id]
  );

  await connection!.end();

  return rows[0];
};

