import { UserService } from "../../application/services/user_service";
import { Request, Response } from "express";
import { CreateUserDto } from "../../application/dtos/create_user_dtos";

export class UserControllerE2E {
    private userService: UserService;
    
    constructor(userService: UserService) {
        this.userService = userService;
    }

    async createUser(req: Request, res: Response): Promise<Response> {
        try {
            if (!req.body.name || req.body.name.trim() === "") {
                return res.status(400).json({ error: "O campo nome é obrigatório." });
            }

            const dto: CreateUserDto = {
                id: req.body.id,
                name: req.body.name
            }

            const user = await this.userService.createUser(dto);

            return res.status(201).json({
                message: "Usuário criado com sucesso",
                user: {
                    id: user.getId(),
                    name: user.getName()
                }
            });

        } catch (error: any) {
            return res.status(400).json({ error: error.message || "An unexpected error occurred"});
        }

    }
}