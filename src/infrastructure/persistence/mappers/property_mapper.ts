import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entities/property_entity";

export class PropertyMapper {

    private static validateEntity(data: {
        id: unknown;
        name: unknown;
        maxGuests: unknown;
        basePricePerNight: unknown;
    }): void {
        
        if (!data.id) {
            throw new Error("Id é obrigatório");
        }

        if (!data.name || String(data.name).trim() === "") {
            throw new Error("Nome é obrigatório");
        }

        if (typeof data.maxGuests !== "number" || data.maxGuests <= 0) {
            throw new Error("Número máximo de hóspedes é um número e deve ser maior que zero");
        }

        if (typeof data.basePricePerNight !== "number" || data.basePricePerNight <= 0) {
            throw new Error("Preço base por noite é número e deve ser maior que zero");
        }
    }

    static toDomain(entity: PropertyEntity): Property {
        
       this.validateEntity({
            id: entity.id,
            name: entity.name,
            maxGuests: entity.maxGuests,
            basePricePerNight: entity.basePricePerNight,
       })

        return new Property(
            entity.id,
            entity.name,
            entity.description,
            entity.maxGuests,
            Number(entity.basePricePerNight)
        );
    }


    static toPersistence(domain: Property): PropertyEntity {

       this.validateEntity({
            id: domain.getId(),
            name: domain.getName(),
            maxGuests: domain.getMaxGuests(),
            basePricePerNight: domain.getBasePricePerNight(),
       })

        const entity = new PropertyEntity();
        entity.id = domain.getId();
        entity.name = domain.getName();
        entity.description = domain.getDescription();
        entity.maxGuests = domain.getMaxGuests();
        entity.basePricePerNight = domain.getBasePricePerNight();
        return entity;
    }
}