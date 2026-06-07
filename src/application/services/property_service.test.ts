import { PropertyService } from "../services/property_service";
import { FakePropertyRepository } from "../../infrastructure/repositories/fake_property_repository";
import { Property } from "../../domain/entities/property";

describe('Property Service', () => {
  let propertyService: PropertyService;
  let fakePropertyRepository: FakePropertyRepository;

  beforeEach(() => {
    fakePropertyRepository = new FakePropertyRepository();
    propertyService = new PropertyService(fakePropertyRepository);
  })

  it('deve retornar null quando um ID inválido for passado', async () => {
    const property = await propertyService.findPropertyById('999');
    expect(property).toBeNull();
  })

  it('deve retornar uma propriedade quando um ID válido for passado', async () => {
    const property = await propertyService.findPropertyById('1');
    expect(property).not.toBeNull();
    expect(property?.getId()).toBe('1');
    expect(property?.getName()).toBe('Casa na praia');
  })

  it('deve salvar uma nova propriedade com sucesso usando repositório fake e buscando novamente', async () => {
    const newProperty = new Property('3', 'Chácara no interior', 'Uma chácara tranquila no interior', 5, 150);
    await fakePropertyRepository.save(newProperty);

    const property = await propertyService.findPropertyById('3');
    expect(property).not.toBeNull();
    expect(property?.getId()).toBe('3');
    expect(property?.getName()).toBe('Chácara no interior');
  })

});