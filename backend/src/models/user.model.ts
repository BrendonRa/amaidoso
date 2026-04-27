export interface User {
  senha: string
}

export interface Idoso extends User {
  nome_idoso: string,
  data_nasc: DataTransfer,
  cpf: string,
  id_resposavel: Number
}

export interface Responsavel extends User {
  nome_responsavel: string,
  email: string
}