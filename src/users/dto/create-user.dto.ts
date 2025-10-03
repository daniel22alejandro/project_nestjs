import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ 
        type: String,
        example: 'Daniel Alejandro Yara', 
        description: 'El nombre de usuario del nuevo usuario' 
    })
    username: string;

    @Transform(({ value }) => value.trim())
    @IsNotEmpty()
    @ApiProperty({ 
        type: String,
        example: 'password123', 
        description: 'La contraseña del nuevo usuario' 
    })
    password: string;
} 