import dotenv from 'dotenv';
dotenv.config();
import { Client, PermissionsBitField, Message, GuildBasedChannel } from 'discord.js';
import { CATEGORY_NAME, ADMIN_ROLE_NAME } from './constant.js';

const ticketCreate = async (message: Message, client: Client) => {
    if (!client.user) {
        return
    }

    try {
        const guild = message.guild;
        const member = message.member;

        if (!guild || !member) {
            return
        }

        /* Check if channel with name CATEGORY_NAME is exist, if not create a new one */
        let category = guild.channels.cache.find(
            /* 4 = GuildCategory */
            (ch: GuildBasedChannel) => ch.type === 4 && ch.name.toLowerCase() === CATEGORY_NAME.toLowerCase()
        );
        if (!category) {
            category = await guild.channels.create({
                name: CATEGORY_NAME,
                type: 4,
            });
        }

        /* Check if ticket already exists */
        const existing = guild.channels.cache.find(
            (ch: GuildBasedChannel) =>
                ch.parentId === category.id &&
                ch.name === `ticket-${member.user.username.toLowerCase()}`
        );
        if (existing) {
            await message.reply(`You already have a ticket: ${existing.toString()}`);
            return;
        }

        /* Find Role */
        const adminRole = guild.roles.cache.find((role) => role.name === ADMIN_ROLE_NAME);

        const channel = await guild.channels.create({
            name: `ticket-${member.user.username}`,
            type: 0,
            parent: category.id,
            permissionOverwrites: [
                {
                    id: guild.roles.everyone,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: member.id,
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ReadMessageHistory,
                    ],
                },
                {
                    id: client.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
                ...(adminRole
                    ? [
                        {
                            id: adminRole.id,
                            allow: [
                                PermissionsBitField.Flags.ViewChannel,
                                PermissionsBitField.Flags.SendMessages,
                                PermissionsBitField.Flags.ReadMessageHistory,
                            ],
                        },
                    ]
                    : []),
            ],
        });

        await channel.send(`Your private support channel has been created: ${channel.toString()}`);
        await channel.send(`Hello ${member}, how can we assist you?`);
        
    } catch (err) {
        console.error('Failed to create channel:', err);
        message.reply("❌ I don't have permission to create channels. Please allow me to :<");
    }
};

export default ticketCreate;