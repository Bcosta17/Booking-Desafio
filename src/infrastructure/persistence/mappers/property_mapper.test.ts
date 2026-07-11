import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entities/property_entity";
import { PropertyMapper } from "./property_mapper";

describe("Property Mapper", () => {
    describe("toDomain", () => {
        it("deve mapear corretamente de PropertyEntity para Property", () => {
            const propertyEntity = new PropertyEntity();
            propertyEntity.id = "1";
            propertyEntity.name = "Casa";
            propertyEntity.description = "Uma casa bonita";
            propertyEntity.maxGuests = 4;
            propertyEntity.basePricePerNight = 1000;

            const property = PropertyMapper.toDomain(propertyEntity);

            expect(property.getId()).toBe("1");
            expect(property.getName()).toBe("Casa");
            expect(property.getDescription()).toBe("Uma casa bonita");
            expect(property.getMaxGuests()).toBe(4);
            expect(property.getBasePricePerNight()).toBe(1000);
        })

        it("deve lancar erro se o Id não for informado", () => {
            const propertyEntity = new PropertyEntity();
            propertyEntity.name = "Casa";
            propertyEntity.description = "Uma casa bonita";
            propertyEntity.maxGuests = 4;
            propertyEntity.basePricePerNight = 1000;

            expect(() => PropertyMapper.toDomain(propertyEntity)).toThrow("Id é obrigatório");
        })

        it("deve lancar erro se o name não for informado", () => {
            const propertyEntity = new PropertyEntity();
            propertyEntity.id = "1";
            propertyEntity.description = "Uma casa bonita";
            propertyEntity.maxGuests = 4;
            propertyEntity.basePricePerNight = 1000;

            expect(() => PropertyMapper.toDomain(propertyEntity)).toThrow("Nome é obrigatório");
        })

        it("deve lancar erro se o maxGuests não for informado", () => {
            const propertyEntity = new PropertyEntity();
            propertyEntity.id = "1";
            propertyEntity.name = "Casa";
            propertyEntity.description = "Uma casa bonita";
            propertyEntity.basePricePerNight = 1000;

            expect(() => PropertyMapper.toDomain(propertyEntity)).toThrow("Número máximo de hóspedes é um número e deve ser maior que zero");
        })
    
    })

    describe("toPersistence", () => {
        it("deve mapear corretamente de Property para PropertyEntity", () => {
            const property = new Property("1", "Casa", "Uma casa bonita", 4, 1000);        
            const propertyEntity = PropertyMapper.toPersistence(property);

            expect(propertyEntity.id).toBe("1");
            expect(propertyEntity.name).toBe("Casa");
            expect(propertyEntity.description).toBe("Uma casa bonita");
            expect(propertyEntity.maxGuests).toBe(4);
            expect(propertyEntity.basePricePerNight).toBe(1000);
        })

        it("deve lancar erro se o Id não for informado", () => {
            const property = {
                getId: () => "",
                getName: () => "Casa",
                getDescription: () => "Uma casa bonita",
                getMaxGuests: () => 4,
                getBasePricePerNight: () => 1000,
            } as unknown as Property;

            expect(() => PropertyMapper.toPersistence(property)).toThrow("Id é obrigatório");
        })
    })
})
