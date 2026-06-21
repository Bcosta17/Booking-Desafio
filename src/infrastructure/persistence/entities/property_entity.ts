import {Entity, PrimaryColumn, Column} from "typeorm";

@Entity("properties")
export class PropertyEntity {
    
    @PrimaryColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column({name: "max_guests"})
    maxGuests!: number;

    @Column({name: "base_price_per_night", type: "decimal"})
    basePricePerNight!: number;
}