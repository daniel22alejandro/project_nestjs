import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Profile } from './profile.entity';
import { Post } from 'src/post/entities/post.entity';

@Entity({name: 'users'})

export class User{
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    username: string

    @Column()
    password: string

    //@Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'}) escribir esto es lo mismo que usar el decorador: @CreateDateColumn()
    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @Column({nullable: true})
    authStrategy: String

    @OneToOne(() => Profile)
    @JoinColumn()
    profile: Profile

    @OneToMany(() => Post, post => post.author)
    posts: Post[]
}