import dotenv from 'dotenv';
dotenv.config();
import { Client, Message } from 'discord.js';
import { BOT_ROLE_NAME, ADMIN_ROLE_NAME } from './constant.js';


const createRoles = async (message: Message, client: Client) => {
    try {
        const guild = message.guild;
        const member = message.member;

        if (!guild || !member) {
            return
        }

        const owner = await guild.fetchOwner();

        if(owner.id !== member.id) {
            message.reply("❌ You are not the owner of this server, only him/her can allow me to do this action :(((");
            return 
        }

        /* Create ADMIN role for owner */
        const roleAdmin = await guild.roles.create({
            name: ADMIN_ROLE_NAME,
            color: '#992D22',
            permissions: [
                'ManageChannels',
                'ViewChannel',
                'SendMessages',
                'EmbedLinks',
                'ReadMessageHistory',
            ],
            reason: 'Auto-created admin role for server owner',
        });

        await owner.roles.add(roleAdmin);

        console.log(`Created and assigned 'ADMIN' role to owner of this server`);
        message.reply("✅ Created and assigned 'ADMIN' role to owner of guild ${guild.name}");

        /* Create SingleUser role for bot */
        const roleBot = await guild.roles.create({
            name: BOT_ROLE_NAME,
            color: '#9B59B6',
            permissions: [
                'ManageChannels',
                'ViewChannel',
                'SendMessages',
                'EmbedLinks',
                'ReadMessageHistory',
            ],
            reason: 'Auto-created bot role with limited permissions',
        });

        const bot = await guild.members.fetchMe();
        await bot.roles.add(roleBot);

        console.log(`Created and assigned 'SingleUser' role to me ahihi :>`);
        message.reply("✅ Created and assigned 'SingleUser' role to me ahihi :>");

    } catch (error) {
        console.error('Error creating or assigning ADMIN role:', error);
        message.reply("❌ I don't have permission to create roles. Please allow me to huhu :<");
    }
};

export default createRoles; 