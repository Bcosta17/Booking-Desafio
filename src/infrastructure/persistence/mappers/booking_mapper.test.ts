import { BookingEntity } from "../entities/booking_entity";
import { PropertyEntity } from "../entities/property_entity";
import { UserEntity } from "../entities/user_entity";
import { BookingMapper } from "./booking_mapper";

describe("BookingMapper", () => {
    it("deve converter BookingEntity em Booking corretamente", () => {
        const propertyEntity = new PropertyEntity();
        propertyEntity.id = "1";
        propertyEntity.name = "Casa";
        propertyEntity.description = "Uma casa bonita";
        propertyEntity.maxGuests = 4;
        propertyEntity.basePricePerNight = 1000;

        const userEntity = new UserEntity();
        userEntity.id = "1";
        userEntity.name = "João";   

        const bookingEntity = new BookingEntity();
        bookingEntity.id = "1";
        bookingEntity.property = propertyEntity;
        bookingEntity.guest = userEntity;
        bookingEntity.startDate = new Date("2024-07-01");
        bookingEntity.endDate = new Date("2024-07-05");
        bookingEntity.guestCount = 2;
        bookingEntity.totalPrice = 4000;
        bookingEntity.status = "CONFIRMED";

        const booking = BookingMapper.toDomain(bookingEntity);

        expect(booking.getId()).toBe("1");
        expect(booking.getProperty().getId()).toBe("1");
        expect(booking.getGuest().getId()).toBe("1");
        expect(booking.getDateRange().getStartDate()).toEqual(new Date("2024-07-01"));
        expect(booking.getDateRange().getEndDate()).toEqual(new Date("2024-07-05"));
        expect(booking.getGuestCount()).toBe(2);
        expect(booking.getTotalPrice()).toBe(4000);
        expect(booking.getStatus()).toBe("CONFIRMED");
    });

    it("deve lançar erro de validação ao faltar campos obrigatórios no BookingEntity", () => {
        const propertyEntity = new PropertyEntity();
        propertyEntity.id = "1";
        propertyEntity.name = "Casa";
        propertyEntity.description = "Uma casa bonita";
        propertyEntity.maxGuests = 4;
        propertyEntity.basePricePerNight = 1000;

        const userEntity = new UserEntity();
        userEntity.id = "1";
        userEntity.name = "João";   

        const bookingEntity = new BookingEntity();
        bookingEntity.property = propertyEntity;
        bookingEntity.guest = userEntity;
        bookingEntity.startDate = new Date("2024-07-01");
        bookingEntity.endDate = new Date("2024-07-05");

        expect(() => BookingMapper.toDomain(bookingEntity)).toThrow("Dados da reserva incompletos");
    }) 

    it("deve converter Booking para BookingEntity corretamente", () => {
    const propertyEntity = new PropertyEntity();
    propertyEntity.id = "1";
    propertyEntity.name = "Casa";
    propertyEntity.description = "Uma casa bonita";
    propertyEntity.maxGuests = 4;
    propertyEntity.basePricePerNight = 1000;

    const userEntity = new UserEntity();
    userEntity.id = "1";
    userEntity.name = "João";

    const bookingEntity = new BookingEntity();
    bookingEntity.id = "1";
    bookingEntity.property = propertyEntity;
    bookingEntity.guest = userEntity;
    bookingEntity.startDate = new Date("2024-07-01");
    bookingEntity.endDate = new Date("2024-07-05");
    bookingEntity.guestCount = 2;
    bookingEntity.totalPrice = 4000;
    bookingEntity.status = "CONFIRMED";

    const booking = BookingMapper.toDomain(bookingEntity);

    const result = BookingMapper.toPersistence(booking);

    expect(result.id).toBe("1");
    expect(result.property.id).toBe("1");
    expect(result.guest.id).toBe("1");
    expect(result.startDate).toEqual(new Date("2024-07-01"));
    expect(result.endDate).toEqual(new Date("2024-07-05"));
    expect(result.guestCount).toBe(2);
    expect(result.totalPrice).toBe(4000);
    expect(result.status).toBe("CONFIRMED");
});
})