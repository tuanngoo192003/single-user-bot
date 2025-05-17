import dotenv from 'dotenv';
dotenv.config();
import { Client, Message } from 'discord.js';

const destroyTicket = async (message: Message, client: Client) => {
    if (!client.user) {
        return
    }

    try {
        const guild = message.guild;
        const member = message.member;

        if (!guild || !member) {
            return
        }

        const owner = await guild.fetchOwner();

        if (owner.id !== member.id) {
            message.reply("❌ You are not the owner of this server, only him/her can allow me to do this action :(((");
            return
        }

        const thisChannel = message.channel;
        const replyMessage = await message.reply("✅ Ticket channel will be deleted in 5 seconds...");

        let countdown = 5;

        const interval = setInterval(async () => {
            countdown--;

            if (countdown > 0) {
                await replyMessage.edit(`⏳ Ticket channel will be deleted in ${countdown} seconds...`);
            } else {
                clearInterval(interval);
                await thisChannel.delete();
            }
        }, 1000);

    } catch (err) {
        console.error('Failed to destroy channel:', err);
        message.reply("❌ I don't have permission to destroy channels. Please allow me to :<");
    }
};

export default destroyTicket;