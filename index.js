import { config } from "dotenv";
config();

import { InlineKeyboard, Bot, GrammyError, HttpError, Keyboard } from "grammy";
const webAppUrl = "https://biznewschannel.com/";
const bot = new Bot(process.env.BOT_API_KEY);

bot.command("start", async (ctx) => {
  const startKeyboard = new Keyboard()
    .text("HTML")
    .row()
    .text("CSS")
    .row()
    .text("JavaScript")
    .resized();
  await ctx.reply("Hello! ");
  await ctx.reply("What do you want to learn?",{
    reply_markup: startKeyboard,
  });
});

bot.hears(["HTML", "CSS", "JavaScript"], async (ctx) => {
  const inlineKeyboard = new InlineKeyboard()
    .text("Click me", 
    JSON.stringify({
         type:ctx.message.text,
         questionId: 1,
         }),
    )
    .text("Отменить", "cancel");
  await ctx.reply(`Hello! ${ctx.message.text} `, {
    reply_markup: inlineKeyboard,
  });
});

bot.on("callback_query:data", async (ctx) => {
 if(ctx.callbackQuery.data === "cancel"){
   await ctx.reply("Canceled")
   await ctx.answerCallbackQuery()
   return;
 }
 const callbackData = JSON.parse(ctx.callbackQuery.data);
 await ctx.reply(` ${callbackData.type} - составляющая веб-страницы`);
 await ctx.answerCallbackQuery()
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

bot.start();