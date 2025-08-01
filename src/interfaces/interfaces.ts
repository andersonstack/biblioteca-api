export interface Livro {
  id: number;
  titulo: string;
  ano: number;
  descricao: string;
  imagem_caminho: string;
  disponibilidade: boolean;
}

export interface UsuarioSemSenha {
  id: number;
  userName: string;
  name: string;
  role: string;
}

export interface UsuarioComSenha extends UsuarioSemSenha {
  senha: string;
}


export interface LivroEmprestimo {
  titulo: string;
  imagem_caminho: string;
  data_vencimento: Date;
  data_emprestimo: Date;
}