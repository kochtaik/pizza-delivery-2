import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApplyPromocodeDto, CreatePromocodeDto } from './dto';
import { PromocodesService } from './promocodes.service';
import { JwtGuard, Role, Roles, RolesGuard } from '@app/common';

@Controller('orders/promocodes')
export class PromocodesController {
  constructor(private readonly promocodesService: PromocodesService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard, JwtGuard)
  createPromocode(@Body() createPromocodeDto: CreatePromocodeDto) {
    return this.promocodesService.createPromocode(createPromocodeDto);
  }

  @Put(':promocodeId/apply')
  @UseGuards(JwtGuard)
  applyPromocode(
    @Param('promocodeId') promocodeId: string,
    applyPromocodeDto: ApplyPromocodeDto,
  ) {
    return this.promocodesService.applyPromocode(
      promocodeId,
      applyPromocodeDto,
    );
  }
}
