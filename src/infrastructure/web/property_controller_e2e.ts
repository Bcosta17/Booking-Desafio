import { Request, Response} from "express";
import { PropertyService } from "../../application/services/property_service";
import { CreatePropertyDTO } from "../../application/dtos/Create_property_dto";

export class PropertyControllerE2E {
    private propertyService: PropertyService;

    constructor(propertyService: PropertyService) {
        this.propertyService = propertyService;
    }

    async createProperty(req: Request, res: Response): Promise<Response> {
        try {
            if (!req.body.name || req.body.name.trim() === "") {
                return res.status(400).json({ error: "O nome da propriedade é obrigatório." });
            }

            if (!req.body.maxGuests || req.body.maxGuests <= 0) {
                return res.status(400).json({ error: "A capacidade máxima deve ser maior que zero." });
            }

            if (!req.body.basePricePerNight) {
                return res.status(400).json({ error: "O preço base por noite é obrigatório." });
            }

            const dto: CreatePropertyDTO = {
                id: req.body.id,
                name: req.body.name,
                description: req.body.description,
                maxGuests: req.body.maxGuests,
                basePricePerNight: req.body.basePricePerNight
            };

            const property = await this.propertyService.CreateProperty(dto);

            return res.status(201).json({
                message: "Propriedade criada com sucesso",
                property: {
                    id: property.getId(),
                    name: property.getName(),
                    description: property.getDescription(),
                    maxGuests: property.getMaxGuests(),
                    basePricePerNight: property.getBasePricePerNight()
                }
            });


        } catch (error: any) {
            return res.status(400).json({ error: error.message || "An unexpected error occurred" });
        }
    }
}