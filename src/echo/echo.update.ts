import { UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  Ctx,
  Help,
  InjectBot,
  On,
  Message,
  Start,
  Update,
  Command,
  Action
} from 'nestjs-telegraf';
import { Telegraf, Markup } from 'telegraf';
import { EchoService } from './echo.service';
//import { GreeterBotName } from '../app.constants';
import { Context } from './interfaces/context.interface';
import { ReverseTextPipe } from './common/pipes/reverse-text.pipe';
import { ResponseTimeInterceptor } from './common/interceptors/response-time.interceptor';
import { AdminGuard } from './common/guards/admin.guard';
import { TelegrafExceptionFilter } from './common/filters/telegraf-exception.filter';
//import { TelegrafContext } from './interfaces/telegraf-context.interface';


const Url1 = "https://astronomer.ru/data/nick.jpg";
const Url2 = "https://astronomer.ru/data/zais.jpg";
const Url3 = "https://ha.fastbs02.keenetic.link/api/camera_proxy/camera.kamera_02_dom_secondstreamprofile?token=15f0382236c443bb8b34cbc096d34ee849d0c8ae13765e94f153c57e07cd0092";

@Update()
@UseInterceptors(ResponseTimeInterceptor)
@UseFilters(TelegrafExceptionFilter)
export class EchoUpdate {
  constructor(
    //@InjectBot(GreeterBotName)
    private readonly bot: Telegraf<Context>,
    private readonly echoService: EchoService,
  ) { }

  @Start()
  async onStart(): Promise<string> {
    const me = await this.bot.telegram.getMe();
    return `Hey, I'm ${me.first_name}`;
  }

  @Help()
  async onHelp(): Promise<string> {
    return 'Send me any text';
  }

  @Command('admin')
  @UseGuards(AdminGuard)
  onAdminCommand(@Ctx() ctx: Context) {
    console.log(">>> ctx:", ctx);
    ctx.reply(
      "Admin's place",
      Markup.inlineKeyboard([
        Markup.button.callback("Камера 1", "camera1"),
        Markup.button.callback("Камера 2", "camera2"),
        Markup.button.callback("Камера 15", "camera"),
      ]),
    );
  }

  @Command('pic')
  async picCommand(@Ctx() ctx: Context) {
    await ctx.reply('Навага - это вещь! 👍');
    await ctx.replyWithPhoto({ url: "https://astronomer.ru/data/nick.jpg" });
  }

  @Command("change")
  async changeCommand(@Ctx() ctx: Context) {
    ctx.replyWithPhoto(
      Url1,
      Markup.inlineKeyboard([
        Markup.button.callback("Change media", "swap_media"),
      ]),
    );
  }

  @Action(/camera(\d+)/gm)
  async camearAction(@Ctx() ctx: Context) {
    console.log(">>>>> ctx:", ctx);
    ctx.reply("Камера тут");
    ctx.replyWithPhoto(Url3, { caption: "Камера 1" });

  }

  @Action("swap_media")
  async swapMediaAction(@Ctx() ctx: Context) {
    ctx.editMessageMedia({
      type: "photo",
      media: Url2,
    });
  }

  @Action(/.+/gm)
  async defaultAction(@Ctx() ctx: Context) {
    console.log(">>>>> ctx:", ctx);
    ctx.reply("Перехватчик действий");
  }

  @On('text')
  onMessage(
    @Message('text', new ReverseTextPipe()) reversedText: string,
  ): string {
    return this.echoService.echo(reversedText);
  }
}