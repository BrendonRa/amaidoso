export interface User {
  id?: number
  nome: string
  cpf: string
  email: string
  senha: string
}

export interface Idoso extends User {
  dataNasc: DataTransfer
  sexo: string
  idResponsavel: number
}

export interface Responsavel extends User {
  telefone: string
}