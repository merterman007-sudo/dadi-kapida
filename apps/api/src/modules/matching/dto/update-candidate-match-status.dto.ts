import { MatchStatus } from "@prisma/client";
import { IsEnum } from "class-validator";

export class UpdateCandidateMatchStatusDto {
  @IsEnum(MatchStatus)
  status!: MatchStatus;
}
