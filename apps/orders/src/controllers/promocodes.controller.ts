import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApplyPromocodeDto, CreatePromocodeDto } from '../dto';
import { PromocodesService } from '../services';
import { JwtGuard, Role, Roles, RolesGuard } from '@app/common';

@Controller('orders/promocodes')
export class PromocodesController {
  constructor(private readonly promocodesService: PromocodesService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  createPromocode(@Body() createPromocodeDto: CreatePromocodeDto) {
    return this.promocodesService.createPromocode(createPromocodeDto);
  }

  @Put(':promocodeId/apply')
  @UseGuards(JwtGuard)
  applyPromocode(
    @Param('promocodeId') promocodeId: string,
    @Body() applyPromocodeDto: ApplyPromocodeDto,
  ) {
    return this.promocodesService.applyPromocode(
      promocodeId,
      applyPromocodeDto,
    );
  }
}
