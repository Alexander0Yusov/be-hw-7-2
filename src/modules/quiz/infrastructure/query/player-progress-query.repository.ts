import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayerProgress } from '../../domain/player-progress/player-progress.entity';
import { GameStatuses } from '../../dto/game-pair-quiz/answer-status';
import { StatisticViewDto } from '../../dto/game-pair-quiz/statistic-view.dto';

@Injectable()
export class PlayerProgressQueryRepository {
  constructor(
    @InjectRepository(PlayerProgress)
    private readonly playerProgressQueryRepo: Repository<PlayerProgress>,
  ) {}

  async getStatisticByUserId(userId: string) {
    const stats = await this.playerProgressQueryRepo
      .createQueryBuilder('pp')
      .innerJoin('pp.game', 'g')
      .where('pp.userId = :userId', { userId: Number(userId) })
      .andWhere('g.status = :status', { status: GameStatuses.Finished })
      .select([
        'CAST(COALESCE(SUM(pp.score), 0) AS INTEGER) as "sumScore"',
        'CAST(COALESCE(AVG(pp.score), 0) AS FLOAT) as "avgScores"',
        'CAST(COUNT(pp.id) AS INTEGER) as "gamesCount"',
        `CAST(COALESCE(SUM(CASE WHEN pp.victoryStatus = 'Win' THEN 1 ELSE 0 END), 0) AS INTEGER) as "winsCount"`,
        `CAST(COALESCE(SUM(CASE WHEN pp.victoryStatus = 'Loss' THEN 1 ELSE 0 END), 0) AS INTEGER) as "lossesCount"`,
        `CAST(COALESCE(SUM(CASE WHEN pp.victoryStatus = 'Draw' THEN 1 ELSE 0 END), 0) AS INTEGER) as "drawsCount"`,
      ])
      .getRawOne();

    if (!stats || stats.gamesCount === 0) {
      return {
        sumScore: 0,
        avgScores: 0,
        gamesCount: 0,
        winsCount: 0,
        lossesCount: 0,
        drawsCount: 0,
      };
    }
    console.log(777777, stats);

    stats.avgScores = Math.round(stats.avgScores * 100) / 100;

    return stats;
  }
}
