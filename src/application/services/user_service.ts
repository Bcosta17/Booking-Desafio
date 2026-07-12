import { UserRepository } from '../../domain/repositories/user_repository';
import { User } from "../../domain/entities/user";
import { CreateUserDto } from '../dtos/create_user_dtos';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    const user = new User(userDto.id, userDto.name);

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    await this.userRepository.save(user);
    return user
    
  }
}