import { Booking } from "../../domain/entities/booking";
import { BookingRepository } from "../../domain/repositories/booking_repository";
import { CreateBookingDTO } from "../dtos/create_bookings_dto";
import { PropertyService } from "./property_service";
import { UserService } from "./user_service";
import { DateRange } from "../../domain/value_objects/date_range";
import { v4 as uuidv4 } from 'uuid';

export class BookingService {
    constructor(
        private readonly bookingRepository: BookingRepository,
        private readonly propertyService: PropertyService,
        private readonly userService: UserService
    ) {}

    async createBooking(bookingDTO: CreateBookingDTO): Promise<Booking> {
        const property = await this.propertyService.findPropertyById(bookingDTO.propertyId);
        if (!property) {
            throw new Error('Propriedade não encontrada.');
        }

        const guest = await this.userService.findUserById(bookingDTO.guestId);
        if (!guest) {
            throw new Error('Usuário não encontrado.');
        }

        const dateRange = new DateRange(bookingDTO.startDate, bookingDTO.endDate);

        const booking = new Booking(
            uuidv4(),
            property,
            guest,
            dateRange,
            bookingDTO.guestCount
        );

        await this.bookingRepository.save(booking);
        return booking;
    }
    
    async cancelBooking(bookingId: string): Promise<void> {
        const booking = await this.bookingRepository.findById(bookingId);
        
        if (!booking) {
            throw new Error('Reserva não encontrada.');
        }

        booking?.cancel(new Date());

        await this.bookingRepository.save(booking!);
    }
}