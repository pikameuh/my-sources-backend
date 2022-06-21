import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DateManager } from "./date-manager.entity";
import { Role } from "./role.entity";
import { Token } from "./token.entity";


@Index(['pseudo', 'username'])
@Entity() // sql table == 'coffee'  --> @Entity('xxx') then sql table == 'xxx'
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    // @Column()
    // logged: boolean;

    @Column()
    activated: boolean;

    // @Index()
    @Column()
    username: string;

    @Column()
    pseudo: string;

    @Column()
    email: string;

    @Column()
    password: string;

    // @Column('json', {nullable: true})
    // d_update: Date[];

    // @Column('json', {nullable: true})
    // d_connection: Date[];

    // @Column({ default: 0})
    // recommendations: number;

    // @Column('json', {nullable: true})
    // flavors: string[];

    

    @JoinTable()
    @ManyToOne(    
        type => Role, 
        role => role.user,
        {
            cascade: true, // insert automatically the flavor input into Flavor DB if not exists already
        }
    )
    role: Role;
    // @Column()
    // role: string;

    // @Column()
    // register_token: string;

    @Column()
    is_registered: boolean;

   
    @JoinColumn()
    @OneToOne(() => Token)
    token: Token;

    @JoinColumn()
    @OneToOne(() => DateManager)
    dateManager: DateManager;
}

