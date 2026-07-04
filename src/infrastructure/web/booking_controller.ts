import { CreateBookingDTO } from "../../application/dtos/create_bookings_dto";
import { BookingService } from "../../application/services/booking_service";
import { Request, Response} from "express";
export class BookingController {
    private bookingService: BookingService;

    constructor(bookingService: BookingService) {
        this.bookingService = bookingService;
    }

    async createBooking(req: Request, res: Response): Promise<Response> {
        try {
            const starDate  = new Date(req.body.startDate);
            const endDate = new Date(req.body.endDate);
            
            if (isNaN(starDate.getTime()) || isNaN(endDate.getTime())) {
                return res.status(400).json({ error: "Data de início ou fim inválida" });
            }

            const dto: CreateBookingDTO = {
                propertyId: req.body.propertyId,
                guestId: req.body.guestId,
                startDate: starDate,
                endDate: endDate,
                guestCount: req.body.guestCount
            }

            const booking = await this.bookingService.createBooking(dto);

            return res.status(201).json({
                message: "Booking created successfully",
                booking:{
                    id: booking.getId(),
                    propertyId: booking.getProperty().getId(),
                    guestId: booking.getGuest().getId(),
                    startDate: booking.getDateRange().getStartDate(),
                    endDate: booking.getDateRange().getEndDate(),
                    guestCount: booking.getGuestCount(),
                    status: booking.getStatus(),
                    totalPrice: booking.getTotalPrice()
                },
            })
        } catch (error: any) {
            return res.status(400).json({ error: error.message || "An unexpected error occurred"});
        }

    }
}