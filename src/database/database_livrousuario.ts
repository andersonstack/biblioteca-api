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
