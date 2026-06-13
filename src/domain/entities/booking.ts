import {User} from "./user";
import {Property} from "./property";
import {DateRange} from "../value_objects/date_range";
import { RefundRuleFactory } from "../cancellation/refund_rule_factory";
export class Booking {
  private readonly id: string;
  private readonly property: Property;
  private readonly user: User;
  private readonly dateRange: DateRange;
  private readonly guestCount: number;
  private status: 'CONFIRMED' | 'CANCELED' = 'CONFIRMED';
  private totalPrice: number;
  constructor(
    id: string,
    property: Property,
    user: User, 
    dateRange: DateRange,
    guestCount: number
  ) {
    if (guestCount <= 0) {
      throw new Error('O número de hóspedes deve ser maior que zero');
    }

    if (!property.isAvailable(dateRange)) {
      throw new Error('A propriedade não está disponível para o período selecionado');
    }

    property.validateMaxGuests(guestCount);
    
    this.id = id;
    this.property = property;
    this.user = user;
    this.dateRange = dateRange;
    this.guestCount = guestCount;
    this.totalPrice = property.calculateTotalPrice(dateRange);
    this.status = 'CONFIRMED';

    property.addBooking(this);
  }

  getId(): string {
    return this.id;
  }

  getProperty(): Property {
    return this.property;
  }

  getUser(): User {
    return this.user;
  }

  getDateRange(): DateRange {
    return this.dateRange;
  }

  getGuestCount(): number {
    return this.guestCount;
  } 

  getStatus(): 'CONFIRMED' | 'CANCELED' {
    return this.status;
  }

  getTotalPrice(): number {
    return this.totalPrice;
  }

  cancel(currentDate: Date): void {
    if (this.status === 'CANCELED') {
      throw new Error('A reserva já está cancelada');
    }

    const checkInDate = this.dateRange.getStartDate();
    const timeDiff = checkInDate.getTime() - currentDate.getTime();
    const daysUntilCheckIn = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    const refundRule = RefundRuleFactory.getRefundRule(daysUntilCheckIn);
    this.totalPrice = refundRule.calculateRefund(this.totalPrice);
    this.status = 'CANCELED';
  }

}