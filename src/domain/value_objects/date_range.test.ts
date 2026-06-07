import { DateRange } from './date_range';

describe('DateRange Value Object', () => {
  
  it('deve lançar um erro se a data de término for antes da data de início', () => {
    expect(() => {
      new DateRange(new Date('2024-12-25'), new Date('2024-12-24'));
    }).toThrow('A data de término deve ser posterior à data de início');
  })
  
  it('deve criar uma instância de DateRange com data de início e data de término, e verificar o retorno dessas datas', () => {
    const startDate = new Date('2024-12-24');
    const endDate = new Date('2024-12-25');
    const dateRange = new DateRange(startDate, endDate);
    expect(dateRange.getStartDate()).toEqual(startDate);
    expect(dateRange.getEndDate()).toEqual(endDate);
  });

  it('deve calcular o total de noites corretamente', () => {  
    const startDate = new Date('2024-12-24');
    const endDate = new Date('2024-12-27');
    const dateRange = new DateRange(startDate, endDate);

    const totalNights = dateRange.getTotalNights();
    expect(totalNights).toBe(3);

    const startDate1 = new Date('2024-12-20');
    const endDate1 = new Date('2024-12-27');
    const dateRange1 = new DateRange(startDate1, endDate1);

    const totalNights1 = dateRange1.getTotalNights();
    expect(totalNights1).toBe(7);
  });

  it('deve verificar se dois intervalos de datas se sobrepõem', () => {
    const dateRange1 = new DateRange(new Date('2024-12-24'), new Date('2024-12-27'));
    const dateRange2 = new DateRange(new Date('2024-12-26'), new Date('2024-12-29'));

    const overlaps = dateRange1.overlaps(dateRange2);

    expect(overlaps).toBe(true);
  });

  it('deve lançar erro se a data de início e término forem iguais', () => {
    const date = new Date('2024-12-24');

    expect(() => new DateRange(date, date))
      .toThrow('a data de início e término não podem ser iguais.');
  } )

});