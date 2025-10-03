import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany, DeleteDateColumn } from 'typeorm';
import { Profile } from './profile.entity';
import { Post } from 'src/post/entities/post.entity';
import { Delete } from '@nestjs/common';

@Entity({name: 'users'})

export class User{
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true, nullable: false })
    username: string

    @Column({select: false  })  // Con esto evitamos que la contraseña se devuelva en las consultas normales
    password: string

    //@Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'}) escribir esto es lo mismo que usar el decorador: @CreateDateColumn()
    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date

    @Column({default: 'usuario'})
    rol: string

    @Column({nullable: true})
    authStrategy: String

    @OneToOne(() => Profile)
    @JoinColumn()
    profile: Profile

    @OneToMany(() => Post, post => post.author)
    posts: Post[]
}