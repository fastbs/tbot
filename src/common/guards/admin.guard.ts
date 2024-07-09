import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { TelegrafExecutionContext, TelegrafException } from "nestjs-telegraf";
import { Context } from "@/interfaces/context.interface";

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly ADMIN_IDS = [1655038489, 5174898144];

  canActivate(context: ExecutionContext): boolean {
    const ctx = TelegrafExecutionContext.create(context);
    const { from } = ctx.getContext<Context>();

    const isAdmin = this.ADMIN_IDS.includes(from!.id);
    if (!isAdmin) {
      console.log(">>> NOT Admin Id:", from!.id);
      throw new TelegrafException("You are not admin 😡");
    }

    console.log("AdminGuard from.id:", from!.id);

    return true;
  }
}
