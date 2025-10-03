import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private userService: UsersService
  ){}

  async createPost(post: CreatePostDto){
    const userFound = await this.userService.searchUser(post.authorId);
    if(!userFound) {
       throw new HttpException('Usuario no encontrado, no se puede realizar el post', HttpStatus.NOT_FOUND);
    }
    const newPost = this.postRepository.create(post); 
    try {
      const postSave = await this.postRepository.save(newPost);
      return { message: 'Post creado correctamente', data: postSave };
    } catch (err) {
      // Manejar error de FK (usuario faltante) u otros errores de query
      const driverError = err?.driverError ?? err;
      const sqlMessage = driverError?.sqlMessage || driverError?.message || '';

      if (sqlMessage.includes('foreign key') || sqlMessage.includes('CONSTRAINT') || driverError?.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new HttpException('Fallo de integridad referencial: authorId no existe en users', HttpStatus.BAD_REQUEST);
      }

      // Fallback genérico
      throw new HttpException('Error al crear el post', HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }
  
  getPosts(){
    return this.postRepository.find({
      relations: ['author']  // Asegura que la relación 'author' se cargue con cada post  
    })
  }
}
