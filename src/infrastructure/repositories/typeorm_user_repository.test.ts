import { User } from "../../domain/entities/user";
import { DataSource, Repository } from "typeorm";
import { UserEntity } from "../persistence/entities/user_entity";
import { TypeOrmUserRepository} from "./typeorm_user_repository";

describe("TypeORM User Repository", () => {
    let dataSource: DataSource;
    let userRepository: TypeOrmUserRepository;
    let repository: Repository<UserEntity>;

    beforeAll(async () => {
        dataSource = new DataSource({
            type: "sqlite",
            database: ":memory:",
            dropSchema: true,
            entities: [UserEntity],
            synchronize: true,
            logging: false,
        });
        await dataSource.initialize();
        repository = dataSource.getRepository(UserEntity);
        userRepository = new TypeOrmUserRepository(repository);
    })

    afterAll(async () => {
        await dataSource.destroy();
    });

    it("deve salvar um usuário com sucesso", async () => {
        const user = new User( "1", "John Doe");
        await userRepository.save(user);

        const savedUser = await repository.findOne({where: { id: "1" } });
        expect(savedUser).not.toBeNull();
        expect(savedUser?.id).toBe("1");
    })
    
    it("deve retornar um usuário quando um ID válido for fornecido", async () => {
        const user = new User("1", "John Doe");
        await userRepository.save(user);

        const foundUser = await userRepository.findById("1");
        expect(foundUser).not.toBeNull();
        expect(foundUser?.getId()).toBe("1");
    });

    it("deve retornar null quando um ID inválido for fornecido", async () => {
        const foundUser = await userRepository.findById("999");
        expect(foundUser).toBeNull();
    });
}); 
      