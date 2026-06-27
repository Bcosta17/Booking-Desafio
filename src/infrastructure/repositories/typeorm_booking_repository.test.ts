import { DataSource, Repository } from "typeorm";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { UserEntity } from "../persistence/entities/user_entity";
import { Booking } from "../../domain/entities/booking";
import { Property } from "../../domain/entities/property";
import { User } from "../../domain/entities/user";
import { DateRange } from "../../domain/value_objects/date_range";
import { TypeORMBookingRepository } from "./typeorm_booking_repository";
import { BookingEntity } from "../persistence/entities/booking_entity";

describe("TypeORM Booking Repository", () => {
    let dataSource: DataSource;
    let bookingRepository: TypeORMBookingRepository;
    let repository: Repository<BookingEntity>;

    beforeAll(async () => {
        dataSource = new DataSource({
            type: "sqlite",
            database: ":memory:",
            dropSchema: true,
            entities: [PropertyEntity, UserEntity, BookingEntity],
            synchronize: true,
            logging: false,
        });
        await dataSource.initialize();
        bookingRepository = new TypeORMBookingRepository(dataSource.getRepository(BookingEntity));
    })

    afterAll(async () => {
        await dataSource.destroy();
    });

    it("deve salvar uma reserva com sucesso", async () => {
        const propertyRepository = dataSource.getRepository(PropertyEntity);
        const userRepository = dataSource.getRepository(UserEntity);

        const propertyEntity = propertyRepository.create({
            id: "1",
            name: "Casa",
            description: "Uma casa bonita",
            maxGuests: 4,
            basePricePerNight: 200,
        });
        await propertyRepository.save(propertyEntity);
        
        const userEntity = userRepository.create({
            id: "1",
            name: "João",
        });
        await userRepository.save(userEntity);

        const property = new Property("1", "Casa", "Uma casa bonita", 200, 4);
        const user = new User("1", "João");
        const dateRange = new DateRange(new Date("2023-01-01"), new Date("2023-01-05"));

        const booking = new Booking("1",property, user, dateRange, 4);
        await bookingRepository.save(booking);

        const savedBooking = await bookingRepository.findById("1");
        expect(savedBooking).not.toBeNull();
        expect(savedBooking?.getId()).toBe("1");
        expect(savedBooking?.getProperty().getId()).toBe("1");
    })

    it("deve retornar null ao buscar uma reserva inexistente", async () => {
        const savedBooking = await bookingRepository.findById("2")
        expect(savedBooking).toBeNull();
    })

    it("deve salvar uma reserva com sucesso - fazendo cancelamento posteriormente", async () => {
        const propertyRepository = dataSource.getRepository(PropertyEntity);
        const userRepository = dataSource.getRepository(UserEntity);

        const propertyEntity = propertyRepository.create({
            id: "1",
            name: "Casa",
            description: "Uma casa bonita",
            maxGuests: 4,
            basePricePerNight: 200,
        });
        await propertyRepository.save(propertyEntity);
        
        const userEntity = userRepository.create({
            id: "1",
            name: "João",
        });
        await userRepository.save(userEntity);

        const property = new Property("1", "Casa", "Uma casa bonita", 200, 4);
        const user = new User("1", "João");
        const dateRange = new DateRange(new Date("2023-01-05"), new Date("2023-01-10"));

        const booking = new Booking("1",property, user, dateRange, 4);
        await bookingRepository.save(booking);

        booking.cancel(new Date("2023-01-01"));
        await bookingRepository.save(booking)

        const updatedBooking = await bookingRepository.findById("1")

        expect(updatedBooking).not.toBeNull();
        expect(updatedBooking?.getStatus()).toBe("CANCELED")

    })
});