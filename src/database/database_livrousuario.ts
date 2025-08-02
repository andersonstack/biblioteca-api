import { connectionDB } from "./db";
import { LivroEmprestimo } from "../interfaces/interfaces";

export const getBooksUserInBd = async (
  userName: string
): Promise<LivroEmprestimo[] | null> => {
  const connection = await connectionDB();

  const query = `
    SELECT l.titulo, l.imagem_caminho, lu.data_emprestimo, lu.data_vencimento, lu.devolucao
    FROM livros l
    JOIN livroUsuario lu ON l.id = lu.livro_id
    JOIN usuarios u ON u.id = lu.user_id
    WHERE u.userName = ?
  `;

  const [rows] = await connection!.execute(query, [userName]);
  const livrosEmprestimos = rows as LivroEmprestimo[];

  if (livrosEmprestimos.length === 0) {
    await connection!.end();
    return null;
  };

  await connection!.end();
  return livrosEmprestimos;
};

export const borrowABack = async (idUser: number, idBook: number) => {
  const connection = await connectionDB();

  const query = `
    INSERT INTO livroUsuario (user_id, livro_id, data_emprestimo, data_vencimento)
      VALUES (?, ?, ?, ?)
  `;

  const dataEmprestimo = new Date();
  const copiaDataEmprestimo = new Date(dataEmprestimo);
  const dataDevolucao = new Date(copiaDataEmprestimo.setDate(copiaDataEmprestimo.getDate() + 15));
  const dataEmprestimoFormat = dataEmprestimo.toISOString().substring(0, 10);
  const dataDevolucaoFormat = dataDevolucao.toISOString().substring(0, 10);

  const [rows] = await connection!.execute(query, [idUser, idBook, dataEmprestimoFormat, dataDevolucaoFormat]);

  await connection!.end();
  return rows;
};

export const returnTheBook = async (
  idEmprestimo: number
) => {
  const connection = await connectionDB();

  const query = `
    UPDATE livroUsuario lu SET devolucao = 1 WHERE lu.id = ?
  `
  const [rows] = await connection!.execute(query, [idEmprestimo]);

  await connection!.end();

  return rows;
}
