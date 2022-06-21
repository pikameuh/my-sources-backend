import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";


// @Index(['pseudo', 'username'])
@Entity() // sql table == 'coffee'  --> @Entity('xxx') then sql table == 'xxx'
export class Token {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    register_token: string;

    @Column()
    reset_pwd_token: string;
}
