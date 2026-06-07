import { CreateBookingDTO } from "../../application/dtos/create_bookings_dto";
import { Booking } from "../../domain/entities/booking";
import { FakeBookingRepository } from "../../infrastructure/repositories/fake_booking_repository";
import { BookingService } from "./booking_service";
import { PropertyService } from "./property_service";
import { UserService } from "./user_service";

jest.mock('./property_service');
jest.mock('./user_service');

describe('Booking Service', () => {
  let bookingService: BookingService;
  let fakeBookingRepository: FakeBookingRepository;
  let mockPropertyService: jest.Mocked<PropertyService>;
  let mockUserService: jest.Mocked<UserService>;
  
  beforeEach(() => {
    const mockPropertyRepository = {} as any;
    const mockUserRepository = {} as any;

    mockPropertyService = new PropertyService(mockPropertyRepository) as jest.Mocked<PropertyService>;
    mockUserService = new UserService(mockUserRepository) as jest.Mocked<UserService>;

    fakeBookingRepository = new FakeBookingRepository();

    bookingService = new BookingService(
      fakeBookingRepository,
      mockPropertyService,
      mockUserService,
    );
 
  });

  it('deve criar uma reserva com sucesso usando repositório fake', async () => {
  