import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import {Field, ObjectType} from 'type-graphql'

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column('text', { unique: true })
    email: string;
    
    @Field()
    @Column('text', { unique: true })
    username: string;

    @Column()
    password: string;

}
