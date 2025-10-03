import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateUserDto {
        @IsString()
        @ApiProperty({ 
            type: String,
            example: 'Daniel Alejandro Yara', 
            description: 'El nombre de usuario del nuevo usuario' 
        })
        username?: string;
    
        @ApiProperty({ 
            type: String,
            example: 'password123', 
            description: 'La contraseña del nuevo usuario' 
        })
        password?: string;
}

