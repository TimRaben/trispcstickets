const Discord = require('discord.js');
const client = new Discord.Client({partials: ["MESSAGE", "USER", "REACTION"]});
const enmap = require('enmap');
const {token, prefix} = require('./config.json');
const fs = require("fs");

setInterval(() => {
    const statuses = [
        `trispcs.com`,
        `Tickets`,
        `Twitch.tv/Trispcs`,
        `Trispcs Community`,
        `tiktok.com/trispcs`,
    ]

    const status = statuses[Math.floor(Math.random() * statuses.length)]
    client.user.setActivity(status, { type: "WATCHING"}) // Can Be WATCHING, STREAMING, LISTENING
}, 4500) // Second You Want to Change Status, This Cahnges Every 2 Seconds

const settings = new enmap({
    name: "settings",
    autoFetch: true,
    cloneLevel: "deep",
    fetchAll: true
});

client.on('ready', () => {
    console.log('ready')
});

client.on('message', async message => {
    if(message.author.bot) return;
    if(message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command == "ticket-setup") {
        // ticket-setup #channel

        let channel = message.mentions.channels.first();
        if(!channel) return message.reply("Verkeerd Commando! Gebruik: `!ticket-setup #channel`");

        let sent = await channel.send(new Discord.MessageEmbed()
            .setTitle("Trispcs Tickets - Aanmaken")
            .setDescription("\nJe kan een ticket aanmaken door op een van de Emoji's onder dit bericht te klikken! We hebben momenteel 5 categorieën die je hieronder ziet staan! Via hier kan je de categorie selecteren wie jij nodig hebt bijvoorbeeld Vragen of Klachten! Zodra je je ticket hebt aangemaakt helpen we je zo z.s.m. met je vraag/opmerking!\n\n**❓ - Vragen**\n**🎁 - Event Aanmeldingen**\n**📋 - Sollicitatie**\n**⚡ - Management Ticket & Staff Klachten** *(In een Management Ticket kunnen alleen Managers of hoger! Hierin kan je een Klacht indienen over een bepaald Stafflid of andere dingen!)*\n**🎫 - Overige**\n\n**Ticket Regels:**\n\nZodra je een ticket aanmaakt dien je je aan een aantal dingen te houden!\n- Respecteer het Support Team en laat hun in hun waarde\n- Gelieve niet te Spammen in een ticket!\n- Het is niet toegestaan om onnodig Staff te taggen!\n- Wij helpen je met alle liefde maar gelieve geduld te hebben!")
            .setFooter("Trispcs Tickets")
            .setColor("00ff00")
        );

        sent.react('❓');
        sent.react('🎁');
        sent.react('📋');
        sent.react('⚡');
        sent.react('🎫')
        settings.set(`${message.guild.id}-ticket`, sent.id);

        message.channel.send("Ticket Aanmaak Message succesvol aangemaakt!")
    }

    if(command == "close", "done") {
        if(!args[0]) return message.channel.send("Geef een reden op!")
        if(!message.channel.name.includes("overig-", "vraag-", "management-", "event-", "sollicitatie-")) return message.channel.send("Je kan dit momenteel niet gebruiken!")
        message.channel.delete();
    }
});

const supportrole = (791436006007767060)

client.on('messageReactionAdd', async (reaction, user) => {
    if(user.partial) await user.fetch();
    if(reaction.partial) await reaction.fetch();
    if(reaction.message.partial) await reaction.message.fetch();

    if(user.bot) return;

    let ticketid = await settings.get(`${reaction.message.guild.id}-ticket`);

    if(!ticketid) return;

    if(reaction.message.id == ticketid && reaction.emoji.name == '❓') {
        reaction.users.remove(user);

        reaction.message.guild.channels.create(`vraag-${user.username}`, {
            permissionOverwrites: [
                {
                    id: user.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                },
                {
                    id: reaction.message.guild.roles.everyone,
                    deny: ["VIEW_CHANNEL"]
                },
                {
                    id: '791436006007767060',
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                }
            ],
            type: 'text'
        }).then(async channel => {
            channel.send(`<@${user.id}> <@&791436006007767060>`, new Discord.MessageEmbed()
            .setTitle(`Welkom ${user.tag}`)
            .setDescription(`Bedankt voor het aanmaken van de ticket!\n\nLeg zo uitgebreid mogelijk je vraag uit! Zodra je dit hebt gedaan helpt het Support Team je zo spoedig mogelijk met je vraag en helpen ze je zo goed mogelijk!!\n\n**Categorie:** Vragen\n**Aangemaakt door:** ${user.tag}\n\n**Trispcs Tickets - Vragen**`)
            .setColor("00ff00"))
        })
    }

    if(reaction.message.id == ticketid && reaction.emoji.name == '🎫') {
        reaction.users.remove(user);

        reaction.message.guild.channels.create(`overig-${user.username}`, {
            permissionOverwrites: [
                {
                    id: user.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                },
                {
                    id: reaction.message.guild.roles.everyone,
                    deny: ["VIEW_CHANNEL"]
                },
                {
                    id: '791436006007767060',
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                }
            ],
            type: 'text'
        }).then(async channel => {
            channel.send(`<@${user.id}> <@&791436006007767060>`, new Discord.MessageEmbed()
            .setTitle(`Welkom ${user.tag}`)
            .setDescription(`Bedankt voor het aanmaken van de ticket!\n\nLeg zo uitgebreid mogelijk je probleem/opmerking uit! Zodra je dit hebt gedaan helpt het Support Team je zo spoedig mogelijk!\n\n**Categorie:** Overig\n**Aangemaakt door:** ${user.tag}\n\n**Trispcs Tickets - Overig**`)
            .setColor("00ff00"))
        })
    }

    if(reaction.message.id == ticketid && reaction.emoji.name == '🎁') {
        reaction.users.remove(user);
    
        reaction.message.guild.channels.create(`event-${user.username}`, {
            permissionOverwrites: [
                {
                    id: user.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                },
                {
                    id: reaction.message.guild.roles.everyone,
                    deny: ["VIEW_CHANNEL"]
                },
                {
                    id: '791436006007767060',
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                }
            ],
            type: 'text'
        }).then(async channel => {
            channel.send(`<@${user.id}> <@&791436006007767060>`, new Discord.MessageEmbed()
            .setTitle(`Welkom ${user.tag}`)
            .setDescription(`Bedankt voor het aanmaken van een ticket!\n\nJe hebt een Ticket Aangemaakt om je aan te melden bij het Event! Laat de volgende dingen weten hieronder!\n- Welk Event?\n- Tijd van het Event!\n- Discord Naam + Tag (Voorbeeld: tris#0001)\n\n**Categorie:** Event Aanmelding\n**Aangemaakt door:** ${user.tag}\n\n**Trispcs Tickets - Event Aanmeldingen**`)
            .setColor("00ff00"))
        })
    }

    if(reaction.message.id == ticketid && reaction.emoji.name == '⚡') {
        reaction.users.remove(user);
        
        reaction.message.guild.channels.create(`management-${user.username}`, {
            permissionOverwrites: [
                {
                    id: user.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                },
                {
                    id: reaction.message.guild.roles.everyone,
                    deny: ["VIEW_CHANNEL"]
                },
                {
                    id: '835796264553152533',
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                }
            ],
            type: 'text'
        }).then(async channel => {
            channel.send(`<@${user.id}> <@&835796264553152533>`, new Discord.MessageEmbed()
            .setTitle(`Welkom ${user.tag}`)
            .setDescription(`Bedankt voor het aanmaken van de ticket!\n\nLeg zo uitgebreid mogelijk je klacht of opmerking uit! Zodra je dit hebt gedaan helpen we je zo spoedig mogelijk met je vraag en helpen ze je zo goed mogelijk!!\n\n**Categorie:** Management & Staff Klachten\n**Aangemaakt door:** ${user.tag}\n\n**Trispcs Tickets - Management**`)
            .setColor("00ff00"))
        })
    }

        if(reaction.message.id == ticketid && reaction.emoji.name == '📋') {
            reaction.users.remove(user);
    
            reaction.message.guild.channels.create(`sollicitatie-${user.username}`, {
                permissionOverwrites: [
                    {
                        id: user.id,
                        allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                    },
                    {
                        id: reaction.message.guild.roles.everyone,
                        deny: ["VIEW_CHANNEL"]
                    },
                    {
                        id: '835796264553152533',
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                    }
                ],
                type: 'text'
            }).then(async channel => {
                channel.send(`<@${user.id}> <@&835796264553152533`, new Discord.MessageEmbed()
                .setTitle(`Welkom ${user.tag}`)
                .setDescription(`Bedankt voor het aanmaken van de ticket!\n\nWelkom in een Sollicitatie ticket, in deze ticket kan je solliciteren voor een bepaalde functie! Bekijk eerst of de sollicitaties open staan! Dit kan je zien door te kijken in de channel Sollicitaties onder het kopje Overige! Het Management Team zal z.s.m. een sollicitatie formulier sturen! Gelieve even geduld te hebben!\n\n**Categorie:** Sollicitaties\n**Aangemaakt door:** ${user.tag}\n\n**Trispcs Tickets - Sollicitatie**`)
                .setColor("00ff00"))
            })
        }
});

client.login(process.env.token);
