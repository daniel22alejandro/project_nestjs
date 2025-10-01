import { Injectable } from '@nestjs/common';
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
    const newPost = this.postRepository.create(post);
    return this.postRepository.save(newPost);

  }
  getPost(){}
}
