import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TelegrafExecutionContext, TelegrafException } from 'nestjs-telegraf';
import { Context } from '@/interfaces/context.interface';

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly ADMIN_IDS = [1655038489];

  canActivate(context: ExecutionContext): boolean {
    const ctx = TelegrafExecutionContext.create(context);
    const { from } = ctx.getContext<Context>();

    /*     if (from && this.ADMIN_IDS.includes(from.id)){
          return true;
        } else {
          throw new TelegrafException('You are not admin 😡');
        } */

    const isAdmin = this.ADMIN_IDS.includes(from!.id);
    if (!isAdmin) {
      throw new TelegrafException('You are not admin 😡');
    }

    console.log('AdminGuard from.id:', from!.id);

    return true;
  }
}
