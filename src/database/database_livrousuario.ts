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

export const borrowABack = async (idUser: number, idBook: number): Promise<boolean> => {
  const connection = await connectionDB();

  const [livroDisponivelRows]: any = await connection!.execute(
    `SELECT disponibilidade FROM livros WHERE id = ?`,
    [idBook]
  ) ;

  const livroDisponivel = livroDisponivelRows[0]?.disponibilidade;

  if (livroDisponivel !== 1) {
    await connection?.end();
    return false;
  } 

  const dataEmprestimo = new Date();
  const copiaDataEmprestimo = new Date(dataEmprestimo);
  const dataDevolucao = new Date(copiaDataEmprestimo.setDate(copiaDataEmprestimo.getDate() + 15));
  const dataEmprestimoFormat = dataEmprestimo.toISOString().substring(0, 10);
  const dataDevolucaoFormat = dataDevolucao.toISOString().substring(0, 10);

  try {
    await connection!.beginTransaction();

    await connection!.execute(
      `INSERT INTO livroUsuario (user_id, livro_id, data_emprestimo, data_vencimento)
      VALUES (?, ?, ?, ?) `,
      [idUser, idBook, dataEmprestimoFormat, dataDevolucaoFormat]
    );

    await connection!.execute(
      `UPDATE livros SET disponibilidade = 0 WHERE id = ?`,
      [idBook]
    );

    await connection!.commit();

  } catch (error){
    await connection!.rollback();
    await connection!.end();
    console.log(`Erro na consulta de banco de dados: ${error}`);
    return false;
  }
  
  return true;
};

export const returnTheBook = async (
  idEmprestimo: number,
  idBook: number,
): Promise<boolean> => {
  const connection = await connectionDB();

  try {
    await connection!.beginTransaction();

    await connection!.execute(
      `UPDATE livroUsuario lu SET devolucao = 1 WHERE lu.id = ?`,
      [idEmprestimo]
    );

    await connection!.execute(
      `UPDATE livros l SET disponibilidade = 1 WHERE l.id = ?`,
      [idBook]
    );

    await connection!.commit();

  } catch (error) {
    await connection!.rollback();
    await connection!.end();
    console.log(`Erro na consulta de banco de dados: ${error}`);
    return false;
  }

  await connection!.end();

  return true;
}
