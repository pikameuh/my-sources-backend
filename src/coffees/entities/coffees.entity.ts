import { Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Flavor } from "./flavor.entity";

@Index(['name', 'brand'])
@Entity() // sql table == 'coffee'  --> @Entity('xxx') then sql table == 'xxx'
export class Coffee {
    @PrimaryGeneratedColumn()
    id: number;

    // @Index()
    @Column()
    name: string;

    @Column()
    brand: string;

    // @Column('json', {nullable: true})
    // flavors: string[];

    @Column({ default: 0})
    recommendations: number;

    @JoinTable()
    @ManyToMany(
        type => Flavor, 
        flavor => flavor.coffees,
        {
            cascade: true, // insert automatically the flavor input into Flavor DB if not exists already
        })
    flavors: Flavor[];
}