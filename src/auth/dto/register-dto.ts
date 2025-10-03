import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";


export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty()

    password: string;
}