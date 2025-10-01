import { Body, Controller, Get, Post, Param, ParseIntPipe, Delete, Patch } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';
import { createProfileDto } from './dto/create-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {}

    @Get()
    getUsers(){
        return this.usersService.getUsers();
    }



    // Cambio: la firma es Promise<User | null> porque el servicio puede devolver null (ej. findOne).
    // Evita el error TS2322 al intentar asignar Promise<User | null> a Promise<User>.
    @Get(':id')
    searchUser(@Param('id', ParseIntPipe) id: number) {
        console.log(id);
        console.log(typeof id);
        return this.usersService.searchUser(id);
    }


    @Post()
    createUser(@Body() newUser: CreateUserDto) {
        return this.usersService.createUser(newUser);
    }


    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.deleteUser(id);
    }

    @Patch(':id')
    updateUser(@Param('id', ParseIntPipe) id: number, @Body() user:UpdateUserDto) {
        return this.usersService.updateUser(id, user);
    }


    @Post(':id/profile')
    createProfile(@Param('id', ParseIntPipe) id: number, @Body() profile: createProfileDto) {
        return this.usersService.createProfile(id, profile);
    }

}
