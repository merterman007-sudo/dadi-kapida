import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(page = 1, limit = 20, channel?: string) {
    return this.prisma.message.findMany({
      where: channel ? { channel } : undefined,
      skip: (Math.max(page, 1) - 1) * Math.max(limit, 1),
      take: Math.max(limit, 1),
      orderBy: { created_at: "desc" }
    });
  }

  findWebsiteSubmissions(limit = 50) {
    return this.prisma.websiteFormSubmission.findMany({
      where: {
        form_type: {
          in: ["contact_request", "callback_request", "newsletter_subscription"]
        }
      },
      take: Math.max(Math.min(limit, 100), 1),
      orderBy: { created_at: "desc" }
    });
  }

  async findOne(id: string) {
    const message = await this.prisma.message.findUnique({ where: { id } });
    if (!message) {
      throw new NotFoundException("Message not found");
    }
    return message;
  }

  create(dto: CreateMessageDto, actorUserId?: string) {
    return this.prisma.message.create({
      data: {
        ...dto,
        sent_at: dto.sent_at ? new Date(dto.sent_at) : undefined,
        created_by_user_id: actorUserId
      }
    });
  }

  async update(id: string, dto: UpdateMessageDto) {
    await this.findOne(id);
    return this.prisma.message.update({
      where: { id },
      data: {
        ...dto,
        sent_at: dto.sent_at ? new Date(dto.sent_at) : undefined
      }
    });
  }
}
