import { UseFilters, UseGuards, UseInterceptors } from "@nestjs/common";
import {
  Ctx,
  Help,
  On,
  Message,
  Start,
  Update,
  Command,
  Action,
  Url,
} from "nestjs-telegraf";
import axios from "axios";
import cloneDeep from "lodash/clone";
import { Telegraf, Markup } from "telegraf";
import { DachaService } from "./dacha.service";
import { Context } from "telegraf";
import { ReverseTextPipe } from "@/common/pipes/reverse-text.pipe";
import { ResponseTimeInterceptor } from "@/common/interceptors/response-time.interceptor";
import { AdminGuard } from "@/common/guards/admin.guard";
import { TelegrafExceptionFilter } from "@/common/filters/telegraf-exception.filter";

import { Camera } from "@/entity/camera.entity";

const Url1 = "https://astronomer.ru/data/nick.jpg";
const Url2 = "https://astronomer.ru/data/zais.jpg";


@Update()
@UseInterceptors(ResponseTimeInterceptor)
@UseFilters(TelegrafExceptionFilter)
export class DachaUpdate {
  constructor(
    private readonly bot: Telegraf<Context>,
    private readonly dachaService: DachaService,
  ) { }

  @Start()
  async onStart(): Promise<string> {
    return "START!!!";
  }

  @Help()
  async onHelp(): Promise<string> {
    return "Я дачный бот. Чего надо?";
  }

  @Command("cameras")
  @UseGuards(AdminGuard)
  async onCamerasCommand(@Ctx() ctx: Context) {
    const cameras = await this.dachaService.findAllCameras();
    const buttons = [];
    const buttonsRow = [];
    cameras.forEach((cam, idx) => {
      buttonsRow.push(Markup.button.callback(cam.short_name, "camera" + cam.id));
      if (buttonsRow.length == 3) {
        buttons.push(cloneDeep(buttonsRow));
        buttonsRow.length = 0;
      }
    });
    if (buttonsRow.length) {
      buttons.push(cloneDeep(buttonsRow));
    }
    buttons.push([Markup.button.callback("Все камеры", "camera_all")]);

    ctx.reply("Наши камеры:", Markup.inlineKeyboard(buttons));
  }

  @Command("pic")
  async picCommand(@Ctx() ctx: Context) {
    await ctx.reply("Навага - это вещь! 👍");
    await ctx.replyWithPhoto({ url: Url1 });
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

  @Command("devices")
  async devicesCommand(@Ctx() ctx: Context) {
    const devices = await this.dachaService.findAllDevices();
    console.log(">>> devices:", devices);
    const buttons = [];
    devices.forEach((dev, idx) => {
      buttons.push([Markup.button.callback(dev.name, "device" + dev.id)]);
    });
    ctx.reply("Наши устройства:", Markup.inlineKeyboard(buttons));
  }

  @Command("controls")
  async controlsCommand(@Ctx() ctx: Context) {
    const devices = await this.dachaService.findAllControlledDevices();
    const buttons = [];
    devices.forEach((dev, idx) => {
      buttons.push([Markup.button.callback(dev.name, "control" + dev.id + "-state")]);
    });
    ctx.reply("Контролируемые устройства:", Markup.inlineKeyboard(buttons));
  }

  @Action(/camera(\d+)/gm)
  async cameraAction(@Ctx() ctx: Context) {
    if ("match" in ctx) {
      const camId: number = ctx.match[1];
      const cam = await this.dachaService.getCamera(camId);
      if (cam) {
        this.showCamPicture(cam, ctx);
      }
    }
  }

  @Action("camera_all")
  async cameraAllAction(@Ctx() ctx: Context) {
    const cams = await this.dachaService.findAllCameras();
    cams.forEach(async (cam) => this.showCamPicture(cam, ctx));
  }

  async showCamPicture(cam: Camera, ctx: Context) {
    const ha = () => { return axios.create({ baseURL: process.env.HA_API_URL }); }
    const cs = cam.second == "" ? cam.main : cam.second;
    ha().get("/states/" + cs, { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.HA_TOKEN } })
      .then((res) => ctx.replyWithPhoto(process.env.HA_URL + res.data.attributes.entity_picture, { caption: cam.name }))
      .catch((err: Error) => ctx.reply("Ошибка камеры " + cam.name + ":" + err.message));
  }

  @Action(/device(\d+)/gm)
  async deviceAction(@Ctx() ctx: Context) {
    if ("match" in ctx) {
      const devId: number = ctx.match[1];
      const dev = await this.dachaService.getDevice(devId);
      if (dev) {
        ctx.replyWithMarkdownV2(`Состояние устройства *${dev.name}:*`);
        dev.sensors.forEach(async (sensor) => {
          const ha = () => { return axios.create({ baseURL: process.env.HA_API_URL }); }
          ha().get("/states/" + sensor.object_id, { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.HA_TOKEN } })
            .then((res) => {
              console.log("res.data:", res.data);
              ctx.reply(`${sensor.name}: ${res.data.state} ${sensor.unit_of_measurement}`);
            })
            .catch((err: Error) => ctx.reply("Ошибка сенсора " + sensor.name + ":" + err.message));
        });
      }
    }
  }

  @Action(/control(\d+)((-(\w+))?(-(\w+))?)?/gm) //(/control(\d+)-(\w+)/gm)
  async controlAction(@Ctx() ctx: Context) {
    if ("match" in ctx) {
      console.log(">>> match:", ctx.match);
      
      const devId: number = ctx.match[1];
      const dev = await this.dachaService.getDevice(devId);
      if (dev) {
        const action: string = ctx.match[2];
        console.log(">>> action:", action);
        //switch(dev.)

        ctx.replyWithMarkdownV2(`Состояние устройства *${dev.name}:*`);
        dev.controls.forEach(async (control) => {
          const ha = () => { return axios.create({ baseURL: process.env.HA_API_URL }); }
          ha().get("/states/" + control.entity_id, { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.HA_TOKEN } })
            .then((res) => {
              console.log("res.data:", res.data);
              ctx.reply(`${control.name}: ${res.data.state}`);

/*               devices.forEach((dev, idx) => {
                buttons.push([Markup.button.callback(dev.name, "control" + dev.id)]);
              });
              ctx.reply("Контролируемые устройства:", Markup.inlineKeyboard(buttons)); */



            })
            .catch((err: Error) => ctx.reply("Ошибка " + control.name + ":" + err.message));
        });
      }
    }
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
    if ("match" in ctx) {
      ctx.reply("Перехватчик действий: " + ctx.match[0]);
    }
  }

  @On("text")
  onMessage(
    @Message("text", new ReverseTextPipe()) reversedText: string,
  ): string {
    return this.dachaService.echo(reversedText);
  }
}
