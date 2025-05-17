import dotenv from 'dotenv';
dotenv.config();
import { Client, GatewayIntentBits, Partials, PermissionsBitField, Message, Events, GuildBasedChannel, Guild } from 'discord.js';
import ticketCreate from './ticket-creation.js';
import createRoles from './auto-create-role.js';
import destroyTicket from './destroy-ticket.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

client.once(Events.ClientReady, (readyClient) => {
  if (!readyClient.user) {
    return
  }
  console.log(`Logged in as `, readyClient.user.tag);
});

client.on(Events.MessageCreate, async (message: Message) => {
  if (message.author.bot) return;

  const messageContent = message.content;
  switch (messageContent) {
    case '!support':
      ticketCreate(message, client);
      break;
    case '!initTask':
      createRoles(message, client);
      break;
    case '!destroy':
      destroyTicket(message, client);
      break;
    default:
      break;
  }
});

client.login(process.env.DISCORD_TOKEN);