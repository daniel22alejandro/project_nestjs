import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePostDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    content: string;

    @IsInt({ message: 'El authorId debe ser un número entero.' })
    @IsNotEmpty({ message: 'El authorId es obligatorio.' })
    authorId: number;
}
