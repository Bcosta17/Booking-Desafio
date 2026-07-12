import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { PropertyService } from "../../application/services/property_service";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { TypeOrmPropertyRepository } from "../repositories/typeorm_property_repository";
import { PropertyControllerE2E } from "./property_controller_e2e";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { UserEntity } from "../persistence/entities/user_entity";

const app = express();
app.use(express.json());

let dataSource: DataSource;
let propertyRepository: TypeOrmPropertyRepository;
let propertyService: PropertyService;
let propertyController: PropertyControllerE2E;

beforeAll(async () => {
    dataSource = new DataSource({
        type: "sqlite",
        database: ":memory:",
        dropSchema: true,
        entities: [PropertyEntity, BookingEntity, UserEntity],
        synchronize: true,
        logging: false,
    });
    
    await dataSource.initialize();
    
    propertyRepository = new TypeOrmPropertyRepository(dataSource.getRepository(PropertyEntity));
    propertyService = new PropertyService(propertyRepository);
    propertyController = new PropertyControllerE2E(propertyService);

    app.post('/property', (req, res, next) => {
    propertyController.createProperty(req, res).catch((err) => next(err));
});
})

afterAll(async () => {
    await dataSource.destroy();
});

describe('PropertyController', () => {
    beforeAll(async () => {
        const propertyRepo = dataSource.getRepository(PropertyEntity);
        await propertyRepo.clear();
    })

    it("deve criar uma propriedade com sucesso", async () => {
        const response = await request(app).post('/property').send({
           id: "1",
           name: "Casa",
           description: "Uma casa bonita",
           maxGuests: 4,
           basePricePerNight: 200,
        });

        expect(response.status).toBe(201);
        expect(response.body.property).toHaveProperty("id");
    })
    it("deve retornar erro com código 400 e mensagem 'O nome da propriedade é obrigatório.' ao enviar um nome vazio", async () =>{
        const response = await request(app).post('/property').send({
           id: "1",
           description: "Uma casa bonita",
           maxGuests: 4,
           basePricePerNight: 200,
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("O nome da propriedade é obrigatório.");
        
    });
    it("deve retornar erro com código 400 e mensagem 'A capacidade máxima deve ser maior que zero.' ao enviar maxGuests igual a zero ou negativo", async () => {
        const response = await request(app).post('/property').send({
            id: "1",
            name: "Casa",
            description: "Uma casa bonita",
            maxGuests: 0,
            basePricePerNight: 200,
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("A capacidade máxima deve ser maior que zero.");
    });
    
    it("deve retornar erro com código 400 e mensagem 'O preço base por noite é obrigatório.' ao enviar basePricePerNight ausente", async () => {
        const response = await request(app).post('/property').send({
            id: "1",
            name: "Casa",
            description: "Uma casa bonita",
            maxGuests: 4,
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("O preço base por noite é obrigatório.");
    });
})