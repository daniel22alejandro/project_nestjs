import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto' ;  

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  createPost(@Body() creandoPost: CreatePostDto) {
    return this.postService.createPost(creandoPost);
  }

  @Get()
  getPost() {
    return this.postService.getPosts();
  }
}
