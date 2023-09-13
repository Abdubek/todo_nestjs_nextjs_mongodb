import {IsNotEmpty, IsString, MaxLength, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @ApiProperty({
        maxLength: 30
    })
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @ApiProperty({
        minLength: 6
    })
    password: string;
}
