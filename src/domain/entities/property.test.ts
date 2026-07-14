import { Property } from "./property";
import { DateRange } from "../value_objects/date_range";
import { Booking } from "./booking";
import { User } from "./user";

describe('Property Entity', () => {

    it('deve criar uma instância de Property com todos os atributos', () => {
        const property = new Property(
            '1', 
            'Casa de Praia', 
            'Uma casa de praia aconchegante', 
            4, 
            200
        );

        expect(property.getId()).toBe('1');
        expect(property.getName()).toBe('Casa de Praia');
        expect(property.getDescription()).toBe('Uma casa de praia aconchegante');
        expect(property.getMaxGuests()).toBe(4);
        expect(property.getBasePricePerNight()).toBe(200);
    });

    it('deve lança um erro se o nome for vazio', () => {
        expect(() => new Property('1', '', 'Descrição', 4, 200)).toThrow('O nome é obrigatório');
    });

    it('deve lança um erro se o id for vazio', () => {
        expect(() => new Property('', 'Casa de Praia', 'Descrição', 4, 200)).toThrow('O id é obrigatório');
    })

    it ('deve lançar um erro se o número máximo de hóspedes for zero ou negativo', () => {
        expect(() => new Property('1', 'Casa de Praia', 'Descrição', 0, 200)).toThrow('O número máximo de hóspedes deve ser maior que zero');
        expect(() => new Property('1', 'Casa de Praia', 'Descrição', -1, 200)).toThrow('O número máximo de hóspedes deve ser maior que zero');
    });

    it('deve validar o número máximo de hóspedes', () =>{
        expect(() => {
            const property = new Property('1', 'Casa de Praia', 'Descrição', 5, 200);
            property.validateMaxGuests(6);
        }).toThrow('Número máximo de hóspedes excedido. Máximo permitido é 5');
    })

    it ('deve lançar um erro se o preço base por noite for zero ou negativo', () => {
        expect(() => new Property('1', 'Casa de Praia', 'Descrição', 2, 0)).toThrow('O preço base por noite deve ser maior que zero');
        expect(() => new Property('1', 'Casa de Praia', 'Descrição', 2, -1)).toThrow('O preço base por noite deve ser maior que zero');
    });

    it('não deve aplicar desconto para estadias menores que 7 noites', () => {
        const property = new Property('1', 'Apartamento', 'Apartamento confortável', 2, 100);
        const dateRange = new DateRange(new Date('2024-07-01'), new Date('2024-07-05')); // 4 noites
        const totalPrice = property.calculateTotalPrice(dateRange);
        
        expect(totalPrice).toBe(400);
    });

        it('deve aplicar desconto para estadias de 7 noites ou mais', () => {
        const property = new Property('1', 'Apartamento', 'Apartamento confortável', 2, 100);
        const dateRange = new DateRange(new Date('2024-07-01'), new Date('2024-07-08')); // 4 noites
        const totalPrice = property.calculateTotalPrice(dateRange);
        
        expect(totalPrice).toBe(630);
    });

    it('deve verificar disponibilidade da propriedade para um intervalo de datas', () => {
        const property = new Property('1', 'Casa de Praia', 'Descrição', 4, 200);
        const user = new User('1', 'João');
        const dateRange = new DateRange(new Date('2024-07-01'), new Date('2024-07-05'));

        const dateRange2 = new DateRange(new Date('2024-07-03'), new Date('2024-07-07'));

        new Booking('1', property, user, dateRange, 2);

        expect(property.isAvailable(dateRange)).toBe(false);
        expect(property.isAvailable(dateRange2)).toBe(false);
    
    });
});