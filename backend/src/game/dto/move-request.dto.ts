import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class MoveRequestDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    moves: string[];
}
