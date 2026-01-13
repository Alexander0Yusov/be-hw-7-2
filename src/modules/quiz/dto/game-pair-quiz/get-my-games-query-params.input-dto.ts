//dto для запроса списка юзеров с пагинацией, сортировкой, фильтрами
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseQueryParams } from '../../../../core/dto/base.query-params.input-dto';
import { MyGamesSortField } from './my-games-sort-field';
import { GameStatuses } from './answer-status';

//наследуемся от класса BaseQueryParams, где уже есть pageNumber, pageSize и т.п., чтобы не дублировать эти свойства
export class GetMyGamesQueryParams extends BaseQueryParams {
  @IsEnum(MyGamesSortField)
  sortBy: MyGamesSortField = MyGamesSortField.PairCreatedDate;

  // @IsEnum(GameStatuses)
  // @IsOptional()
  // status: GameStatuses | null = null;
}
