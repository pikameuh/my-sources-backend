import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


// @Index(['pseudo', 'username'])
@Entity() // sql table == 'coffee'  --> @Entity('xxx') then sql table == 'xxx'
export class DateManager {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    d_creation: Date;

    @Column('json', {nullable: true})
    d_connections_succeeded: Date[];

    @Column('json', {nullable: true})
    d_connections_failed: Date[];

    @Column('json', {nullable: true})
    d_profile_updated: Date[];

    @Column('json', {nullable: true})
    d_activations: Date[];
}
