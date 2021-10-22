const {Client, Collection, Intents} = require('discord.js');
const {token} = require('./config.json');
// Le nom du chan ou Jacob vit
const jacobChan = 'les-aventures-de-jacob';
// Le prefix des commandes
const prefix = "!J ";
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
var jacobChanId = null;


// A l'arrivé sur un serveur (pas au redémarrage)
client.on("guildCreate", guild => {
    let defaultChannel = "";
    var count = 0;
    // Cherche le premier channel de type text ou il peut envoyer un message
    guild.channels.cache.forEach((channel) => {
        if(channel.type === "GUILD_TEXT" && count === 0) {
            if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
                defaultChannel = channel;
                count = 1
            }
        }
    })
// Envoi un message d'arrivé sur le serveur
    defaultChannel.send('Salut ! Je suis Jacob :) Tapez !J init pour me construire une maison puis !J MESSAGE_QUELCONQUE pour me faire parler, je supporte aussi les images ;) ATTENTION, je ne marche sur qu\'un serveur à la fois Oo')
});

// Quand quelqu'un envoi un message sur le serveur
client.on("messageCreate", function (message) {
    console.log(message.author + " : " + message.content)
    // On vérifie que ce n'est pas un bot et qu'il envoi un message avec le bon prefix
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    const commandBody = message.content.slice(prefix.length);
    // Si c'est la commande  d'initialisation on verifie que le chan existe sinon on le crée
    if(commandBody === "init"){
        if (client.channels.cache.find(channel => channel.name === jacobChan) !== undefined) {
            jacobChanId = client.channels.cache.find(channel => channel.name === jacobChan).id
            client.channels.cache.get(jacobChanId).send("Merci "+ message.author.username +" mais je possède déja une maison :)")
        } else {
            message.guild.channels.create(jacobChan, {
                type: "text",
                permissionOverwrites: [
                    {
                        id: message.guild.id,
                        allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
                    }
                ],
            }).then(async  (r) =>{
                jacobChanId = client.channels.cache.find(channel => channel.name === jacobChan).id
                client.channels.cache.get(jacobChanId).send("Salut tout le monde ! Ce chan est ma nouvelle maison :)")
            }).catch(e => {
                console.log(e)

            })
        }
        message.delete()
    } else{
        // On verifie que le chan de Jacob existe, si oui on envoi le message sinon on demande la creation
        if (client.channels.cache.find(channel => channel.name === jacobChan) !== undefined) {
            jacobChanId = client.channels.cache.find(channel => channel.name === jacobChan).id
            client.channels.cache.get(jacobChanId).send(commandBody)
            console.log("JACOB : " + commandBody)
            message.attachments.forEach(function (attachment) {
                client.channels.cache.get(jacobChanId).send(attachment.url, {files: []})
            })
            message.delete()

        } else {
            message.reply('Désolé pour répondre il me faut une maison, tapez la commande \'J init\' pour m\'en fabriquer une :)')
        }

    }

});

// Log a discord avec le token de secu
client.login(token);