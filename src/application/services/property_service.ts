import { Property } from "../../domain/entities/property";
import { PropertyRepository } from "../../domain/repositories/property_repository";
import { CreatePropertyDTO } from "../dtos/Create_property_dto";

export class PropertyService {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async findPropertyById(id: string): Promise<Property | null> {
    return this.propertyRepository.findById(id);
  }

  async CreateProperty(propertyDTO : CreatePropertyDTO): Promise<Property> {
    const property = new Property(
      propertyDTO.id,
      propertyDTO.name,
      propertyDTO.description,
      propertyDTO.maxGuests,
      propertyDTO.basePricePerNight
    );

    await this.propertyRepository.save(property);
    return property;
  }
  
}