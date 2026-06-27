import { Property } from "./property";
import { User } from "./user";
import { DateRange } from "../value_objects/date_range";
import { Booking } from "./booking";

describe('Booking Entity', () => {
  
    it('deve criar uma instância de Booking com todos os atributos', () => {
      const property = new Property('1', 'Casa de Praia', 'Uma casa de praia aconchegante', 4, 200);
      const user = new User('1', 'João');
      const dateRange = new DateRange(new Date('2024-07-01'), new Date('2024-07-05'));
      const booking = new Booking('1', property, user, dateRange, 2);

      expect(booking.getId()).toBe('1');
      expect(booking.getProperty()).toBe(property);
      expect(booking.getGuest()).toBe(user);
      expect(booking.getDateRange()).toBe(dateRange);
      expect(booking.getGuestCount()).toBe(2);
    });

    it('deve lançar um erro se o número de hóspedes for zero ou negativo', () => {
      const property = new Property('1', 'Casa', 'descrição', 5, 150);
      const user = new User('1', 'João');
      const dateRange = new DateRange(new Date('2024-07-01'), new Date('2024-07-05'));

      expect(() => new Booking('1', property, user, dateRange, 0)).toThrow('O número de hóspedes deve ser maior que zero');
    });

    it('deve lançar um erro se o número de hóspedes for maior que o máximo permitido', () => {
      const property = new Property('1', 'Casa', 'descrição', 5, 150);
      const user = new User('1', 'João');
      const dateRange = new DateRange(new Date('2024-07-01'), new Date('2024-07-05'));

      expect(() => new Booking('1', property, user, dateRange, 6)).toThrow('Número máximo de hóspedes excedido. Máximo permitido é 5');
    });

    it('deve calcular o preço total com desconto',() => {
      // Padrão AAA é uma forma de organizar os testes unitários para garantir clareza e manutenção. 
      // Arrange - Configura o cenário do teste.
      const property = new Property('1', 'Casa', 'descrição', 5, 150);
      const user = new User('1', 'João');
      const dateRange = new DateRange(new Date('2024-07-01'), new Date('2024-07-10'));
      
      // Act - Executa a ação que queremos testar.
      const booking = new Booking('1', property, user, dateRange, 4);
      const result = booking.getTotalPrice()
      
      // Assert - Verifica se o resultado é o esperado.
      expect(result).toBe(150*9*0.9); 
     
    })

    it('Não deve realizar o agendamento, quando uma propriedade já tiver uma reserva confirmada para o mesmo período', () => {
      // Arrange
      const property = new Property('1', 'Casa', 'descrição', 5, 150);
      const user1 = new User('1', 'João');
      const dateRange1 = new DateRange(new Date('2024-07-01'), new Date('2024-07-10'));
      const booking1 = new Booking('1', property, user1, dateRange1, 4);

      const user2 = new User('2', 'Maria');
      const dateRange2 = new DateRange(new Date('2024-07-05'), new Date('2024-07-15'));

      expect(() => new Booking('3', property, user2, dateRange2, 4))
        .toThrow('A propriedade não está disponível para o período selecionado');
    });

    it('deve cancelar uma reserva sem reembolso quando faltam menos de 1 dia para o check-in', () => {
      const property = new Property('1', 'Casa', 'descrição', 5, 150);
      const user = new User('1', 'João');
      const dateRange = new DateRange(new Date('2024-07-20'), new Date('2024-07-22'));
      const booking = new Booking('1', property, user, dateRange, 4);
      
      const currentDate = new Date('2024-07-20');

      booking.cancel(currentDate);

      expect(booking.getStatus()).toBe('CANCELED');
      expect(booking.getTotalPrice()).toBe(300);
    });

    it('deve cancelar uma reserva com reembolso total quando faltam mais de 7 dias para o check-in', () => {
      const property = new Property('1', 'Casa', 'descrição', 5, 300);
      const user = new User('1', 'João');
      const dateRange = new DateRange(new Date('2024-07-20'), new Date('2024-07-22'));
      const booking = new Booking('1', property, user, dateRange, 4);
      
      const currentDate = new Date('2024-07-10');

      booking.cancel(currentDate);

      expect(booking.getStatus()).toBe('CANCELED');
      expect(booking.getTotalPrice()).toBe(0);
    });

    it('deve cancelar uma reserva com reembolso parcial quando a data estiver entre 1 e 7 dias para o check-in', () => {
      const property = new Property('1', 'Casa', 'descrição', 5, 300);
      const user = new User('1', 'João');
      const dateRange = new DateRange(new Date('2024-07-20'), new Date('2024-07-22'));
      const booking = new Booking('1', property, user, dateRange, 4);
      
      const currentDate = new Date('2024-07-15');

      booking.cancel(currentDate);

      expect(booking.getStatus()).toBe('CANCELED');
      expect(booking.getTotalPrice()).toBe(300 * 0.5 * 2); 
    });   

    it('não deve permitir cancelar uma reserva já cancelada', () => {
      const property = new Property('1', 'Casa', 'descrição', 5, 300);
      const user = new User('1', 'João');
      const dateRange = new DateRange(new Date('2024-07-20'), new Date('2024-07-22'));
      const booking = new Booking('1', property, user, dateRange, 4);
      
      const currentDate = new Date('2024-07-15');

      booking.cancel(currentDate);
      expect(() => booking.cancel(currentDate)).toThrow('A reserva já está cancelada');
    });
});