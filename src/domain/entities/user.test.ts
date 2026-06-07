import { User } from './user';

describe('User Entity', () => { 
  it('deve criar uma instância de User com ID e Nome', () => {
    const user = new User('1', 'bob jones');

    expect(user.getId()).toBe('1');
    expect(user.getName()).toBe('bob jones');
  });

  it('deve lançar um erro se o nome do usuário for vazio', () => {
    expect(() => new User('1', '')).toThrow('O nome do usuário não pode ser vazio');
  });

  it('deve lançar um erro se o ID for vazio', () => {
    expect(()=> new User('', 'bob jones')).toThrow('O id do usuário não pode ser vazio');
  })
  
});