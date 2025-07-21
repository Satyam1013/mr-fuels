import { Body, Controller, Get, Post } from "@nestjs/common";
import { HomeService } from "./home.service";
import { CreateHomeDto } from "./home.dto";

@Controller("home")
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Post()
  async create(@Body() body: CreateHomeDto) {
    return this.homeService.create(body);
  }

  @Get()
  async getAll() {
    return this.homeService.findAll();
  }
}
