import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PlayerProgress,
  VictoryStatus,
} from '../../domain/player-progress/player-progress.entity';
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
      .where('pp.userId = :userId', { userId: Number(userId) })
      .andWhere('pp.victoryStatus IS NOT NULL')
      .select([
        'CAST(COALESCE(SUM(pp.score), 0) AS INTEGER) as "sumScore"',
        'CAST(COALESCE(AVG(pp.score), 0) AS FLOAT) as "avgScores"',
        'CAST(COUNT(pp.id) AS INTEGER) as "gamesCount"',
        `CAST(COALESCE(SUM(CASE WHEN pp.victoryStatus = :win THEN 1 ELSE 0 END), 0) AS INTEGER) as "winsCount"`,
        `CAST(COALESCE(SUM(CASE WHEN pp.victoryStatus = :loss THEN 1 ELSE 0 END), 0) AS INTEGER) as "lossesCount"`,
        `CAST(COALESCE(SUM(CASE WHEN pp.victoryStatus = :draw THEN 1 ELSE 0 END), 0) AS INTEGER) as "drawsCount"`,
      ])
      .setParameters({
        win: VictoryStatus.Win,
        loss: VictoryStatus.Loss,
        draw: VictoryStatus.Draw,
      })
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

    stats.avgScores = Math.round(stats.avgScores * 100) / 100;

    // console.log(77777, stats);

    return stats;
  }
}
