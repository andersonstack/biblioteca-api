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

  const query = `
    INSERT INTO livros (titulo, ano, descricao, imagem_caminho, disponibilidade)
    VALUES (?, ?, ?, ?, 1)
  `;

  const [result] = await connection!.execute(query, [
    titulo,
    ano,
    descricao,
    imagem,
  ]);

  await connection!.end();

  return result;
};

export const updateBookInBd = async (livro: Livro) => {
  const connection = await connectionDB();

  console.log(livro);

  const query = `
    UPDATE livros
      SET
        titulo = ?,
        ano = ?,
        descricao = ?,
        imagem_caminho = ?,
        disponibilidade = ?
      WHERE id = ?
  `;

  const [result] = await connection!.execute(query, [
    livro.titulo, livro.ano, livro.descricao, livro.imagem_caminho, livro.disponibilidade, livro.id
  ]);

  await connection!.end();

  return result;
};
