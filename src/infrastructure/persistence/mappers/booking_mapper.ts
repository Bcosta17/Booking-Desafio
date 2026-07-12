import { Booking } from "../../../domain/entities/booking";
import { Property } from "../../../domain/entities/property";
import { DateRange } from "../../../domain/value_objects/date_range";
import { BookingEntity } from "../entities/booking_entity";
import { PropertyMapper } from "./property_mapper";
import { UserMapper } from "./user_mapper";

export class BookingMapper {

    static toDomain(entity: BookingEntity, property?: Property): Booking {

        if (!entity.id || !entity.property || !entity.guest || !entity.startDate || !entity.endDate || !entity.guestCount) {
            throw new Error("Dados da reserva incompletos");
        }

        const guest = UserMapper.toDomain(entity.guest);
        const dateRange = new DateRange(entity.startDate, entity.endDate)
        const booking = new Booking(
            entity.id,
            property || PropertyMapper.toDomain(entity.property),
            guest,
            dateRange,
            entity.guestCount
        )

        booking["totalPrice"] = Number(entity.totalPrice);
        booking["status"] = entity.status;

        return booking;
    }

    static toPersistence(domain: Booking): BookingEntity {

        if (!domain.getId() || !domain.getProperty() || !domain.getGuest() || !domain.getDateRange().getStartDate() || !domain.getDateRange().getEndDate() || !domain.getGuestCount()) {
            throw new Error("Dados da reserva incompletos");
        }
        
        const booking = new BookingEntity();
        booking.id = domain.getId();
        booking.property = PropertyMapper.toPersistence(domain.getProperty());
        booking.guest = UserMapper.toPersistence(domain.getGuest());
        booking.startDate = domain.getDateRange().getStartDate();
        booking.endDate = domain.getDateRange().getEndDate();
        booking.guestCount = domain.getGuestCount();
        booking.totalPrice = domain.getTotalPrice();
        booking.status = domain.getStatus();
        
        return booking;
    }

}