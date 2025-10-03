import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { createProfileDto } from './dto/create-profile.dto';
import { Profile } from './entities/profile.entity';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(Profile) private profileRepository: Repository<Profile>
    ) {}

    async createUser(user: CreateUserDto){

        const userFound = await this.usersRepository.findOne({
            where: {
                username: user.username
            }
        })

        if(userFound) {
            throw new HttpException('Usuario ya existe', HttpStatus.CONFLICT);
        }

        //const salt = 10;
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(user.password, salt);

        const newUser = this.usersRepository.create({
            ...user,
            password: hashed
        });

        const saved = await this.usersRepository.save(newUser);
        // no devolver la contraseña
        // alternativa: delete saved.password;
        const { password, ...result } = saved as any;
        return { message: 'Usuario creado correctamente', data: result };
    }

    // Devuelve el usuario incluyendo la contraseña (necesario para autenticación)
    async findByUsernameWithPassword(username: string) {
        return this.usersRepository.findOne({
            where: { username },
            select: ['id', 'username', 'password', 'rol']
        });
    }

    getUsers(){
        return this.usersRepository.find({relations: ['posts', 'profile']}).then(users => ({  contador: users.length, message: 'Listado de usuarios', data: users}));
    }

    async searchUser(id: number){
         const userFound= await this.usersRepository.findOne({
            where: { id }, relations: ['profile', 'posts']  // Asegura que las relaciones 'profile' y 'posts' se carguen con el usuario
        });

        if(!userFound) {
            throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
        }
        return { message: 'Usuario encontrado', data: userFound };
    }

    async deleteUser(id: number){
        const userFound = await this.usersRepository.delete({id});

        if(userFound.affected === 0) {
            throw new HttpException('Usuario no encontrado, no se puede eliminar', HttpStatus.NOT_FOUND);
        }  
        return { message: 'Usuario eliminado correctamente', data: userFound };
    }

    async updateUser(id: number, user: UpdateUserDto){
        const userFound = await this.usersRepository.findOne({
            where: {id}
        });
        if(!userFound) {
            throw new HttpException('Usuario no encontrado, no se puede actualizar', HttpStatus.NOT_FOUND);
        }
        const updatedUser = Object.assign(userFound, user);
        const saved = await this.usersRepository.save(updatedUser);
        return { message: 'Usuario actualizado correctamente', data: saved };
    }


    async createProfile(id: number, profile: createProfileDto){

        const userFound = await this.usersRepository.findOne({
            where: {id}
        })

        if(!userFound){
            throw new HttpException('Usuario no encontrado, no se puede crear perfil', HttpStatus.NOT_FOUND);
        }  
        
        const newProfile = this.profileRepository.create(profile);
        const savedProfile = await this.profileRepository.save(newProfile);
        userFound.profile = savedProfile;
        const userProfile = await this.usersRepository.save(userFound);
        return { message: 'Perfil creado correctamente', data: userProfile };


    }



}
