import { DataSource, Repository } from "typeorm";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { UserEntity } from "../persistence/entities/user_entity";
import { Property } from "../../domain/entities/property";
import { TypeOrmPropertyRepository } from "./typeorm_property_repository";
import { BookingEntity } from "../persistence/entities/booking_entity";

describe("TypeORM Property Repository", () => {
    let dataSource: DataSource;
    let propertyRepository: TypeOrmPropertyRepository;
    let repository: Repository<PropertyEntity>;

    beforeAll(async () => {
        dataSource = new DataSource({
            type: "sqlite",
            database: ":memory:",
            dropSchema: true,
            entities: [UserEntity, PropertyEntity, BookingEntity],
            synchronize: true,
            logging: false,
        });
        await dataSource.initialize();
        repository = dataSource.getRepository(PropertyEntity);
        propertyRepository = new TypeOrmPropertyRepository(repository);
    })

    afterAll(async () => {
        await dataSource.destroy();
    });

    it("deve salvar uma propriedade com sucesso", async () => {
        const property = new Property("1", "Casa", "Uma casa bonita", 1000, 4);
        
        await propertyRepository.save(property);

        const savedProperty = await repository.findOne({ where: { id: "1" } });
        expect(savedProperty).not.toBeNull();
        expect(savedProperty?.id).toBe("1");
    });

    it("deve retornar uma propriedade quando um ID válido for fornecido", async () => {
        const property = new Property("1", "Casa", "Uma casa bonita", 1000, 4);
        await propertyRepository.save(property);    

        const foundProperty = await propertyRepository.findById("1");
        expect(foundProperty).not.toBeNull();
        expect(foundProperty?.getId()).toBe("1");
    });

    it("deve retornar null quando um ID inválido for fornecido", async () => {
        const foundProperty = await propertyRepository.findById("999");
        expect(foundProperty).toBeNull();
    });

});