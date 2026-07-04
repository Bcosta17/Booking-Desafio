import express from 'express';
import request from 'supertest';
import { DataSource} from 'typeorm';
import { TypeORMBookingRepository } from '../repositories/typeorm_booking_repository';
import { TypeOrmPropertyRepository } from '../repositories/typeorm_property_repository';
import { TypeOrmUserRepository } from '../repositories/typeorm_user_repository';
import { BookingService } from '../../application/services/booking_service';
import { PropertyService } from '../../application/services/property_service';
import { UserService} from '../../application/services/user_service';
import { BookingEntity } from '../persistence/entities/booking_entity';
import { PropertyEntity } from '../persistence/entities/property_entity';
import { UserEntity } from '../persistence/entities/user_entity';
import { BookingController } from './booking_controller';

const app = express();
app.use(express.json());

let dataSource: DataSource;
let bookingRepository: TypeORMBookingRepository;
let propertyRepository: TypeOrmPropertyRepository;
let userRepository: TypeOrmUserRepository;
let bookingService: BookingService;
let propertyService: PropertyService;
let userService: UserService;
let bookingController: BookingController;

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
    
    bookingRepository = new TypeORMBookingRepository(dataSource.getRepository(BookingEntity));
    propertyRepository = new TypeOrmPropertyRepository(dataSource.getRepository(PropertyEntity));
    userRepository = new TypeOrmUserRepository(dataSource.getRepository(UserEntity));

    propertyService = new PropertyService(propertyRepository);
    userService = new UserService(userRepository);
    bookingService = new BookingService(bookingRepository, propertyService, userService);

    bookingController = new BookingController(bookingService);

    app.post('/bookings', (req, res, next) => {
        bookingController.createBooking(req, res).catch((err) => next(err));
    })

    //app.post('/bookings/:id', (req, res, next) => {
    //    bookingController.cancelBooking(req, res, next).catch((err) => next(err));
    //})

})

afterAll(async () => {
    await dataSource.destroy();
});


describe('BookingController', () => {
    beforeAll(async () => {
        const propertyRepo = dataSource.getRepository(PropertyEntity);
        const userRepo = dataSource.getRepository(UserEntity);
        const bookingRepo = dataSource.getRepository(BookingEntity);

        await bookingRepo.clear();
        await propertyRepo.clear();
        await userRepo.clear();

        await propertyRepo.save({
            id: "1",
            name: "Casa",
            description: "Uma casa bonita",
            maxGuests: 4,
            basePricePerNight: 200,
        });

        await userRepo.save({
            id: "1",
            name: "João",
        });
    })
        
    it('deve criar uma reserva com sucesso', async () => {
            const response = await request(app).post('/bookings').send({
                propertyId: "1",
                guestId: "1",
                startDate: "2023-01-01",
                endDate: "2023-01-05",
                guestCount: 4,
            })
            expect(response.status).toBe(201);
            expect(response.body.booking).toHaveProperty('id');
    })

     it('deve retornar 400 ao tentar criar uma reserva com data de inicio inválida', async () => {
            const response = await request(app).post('/bookings').send({
                propertyId: "1",
                guestId: "1",
                startDate: "2023-13-01",
                endDate: "2023-01-05",
                guestCount: 4,
            })
            expect(response.status).toBe(400);
            
    })

    it('deve retornar 400 ao tentar criar uma reserva com data de fim inválida', async () => {
       const response = await request(app).post('/bookings').send({
           propertyId: "1",
           guestId: "1",
           startDate: "2023-01-01",
           endDate: "23-02-31",
           guestCount: 4,
       })
       expect(response.status).toBe(400);
       expect(response.body.error).toBe("Data de início ou fim inválida");
            
    })

    it('deve retornar 400 ao tentar criar uma reserva sem quantidade de hóspedes', async () => {
       const response = await request(app).post('/bookings').send({
           propertyId: "1",
           guestId: "1",
           startDate: "2023-01-01",
           endDate: "2023-02-24",
           guestCount: 0,
       })
       expect(response.status).toBe(400);
       expect(response.body.error).toBe("O número de hóspedes deve ser maior que zero");
            
    })

    it('deve retornar 400 ao tentar criar uma reserva com propriedade inexistente', async () => {
       const response = await request(app).post('/bookings').send({
           propertyId: "999",
           guestId: "1",
           startDate: "2023-01-01",
           endDate: "2023-02-24",
           guestCount: 0,
       })
       expect(response.status).toBe(400);
       expect(response.body.error).toBe("Propriedade não encontrada.");
            
    })
})