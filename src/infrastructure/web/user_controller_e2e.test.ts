import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { UserService } from "../../application/services/user_service";
import { UserEntity } from "../persistence/entities/user_entity";
import { TypeOrmUserRepository } from "../repositories/typeorm_user_repository";
import { UserControllerE2E } from "./user_controller_e2e";

const app = express();
app.use(express.json());

let dataSource: DataSource;
let userRepository: TypeOrmUserRepository;
let userService: UserService;
let userController: UserControllerE2E;

beforeAll(async () => {
    dataSource = new DataSource({
        type: "sqlite",
        database: ":memory:",
        dropSchema: true,
        entities: [UserEntity],
        synchronize: true,
        logging: false,
    })

    await dataSource.initialize();

    userRepository = new TypeOrmUserRepository(dataSource.getRepository(UserEntity));
    userService = new UserService(userRepository);
    userController = new UserControllerE2E(userService);

    app.post('/users', (req, res, next) => {
        userController.createUser(req, res).catch((err: any) => next(err));
    })

})

afterAll(async () => {
    await dataSource.destroy();
});


describe("User Controller E2E", () => {
    beforeAll( async () => {
        const userRepo = dataSource.getRepository(UserEntity);

        await userRepo.clear();
    })

    it("deve criar um usuário com sucesso", async () => {
        const response = await request(app).post('/users').send({
            id: "1",
            name: "John Doe"
        })

        expect(response.status).toBe(201);
        expect(response.body.user).toHaveProperty("id")
    })

    it("deve retornar erro com código 400 e mensagem 'O campo nome é obrigatório.' ao enviar um nome vazio", async () => {
        const response = await request(app).post("/users").send({
            id:"2",
            name: ""
        })
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("O campo nome é obrigatório.");
    })

})
