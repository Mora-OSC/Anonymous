const { Client, Intents, Collection } = require('discord.js')
const client = new Client({ intents: 32767 })
const { token } = require('./config.json')
const fs = require('fs')
module.exports = client;
client.login(token)
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")

const commands = []
client.slashcommands = new Collection()
    const commandfolder = fs.readdirSync(`./slashcommands/`).filter(file => file.endsWith(".js"))
    for (const file of commandfolder) {
        const command = require(`./slashcommands/${file}`)
        commands.push(command.data.toJSON());
        client.slashcommands.set(command.data.name, command)
        delete require.cache[require.resolve(`./slashcommands/${file}`)]
    }
const rest = new REST({version:'9'}).setToken(token)

client.on("interactionCreate",async interaction =>{
    if(interaction.guild.id == '954182077371285564')
    if(!interaction.isCommand()) return;
    const command = client.slashcommands.get(interaction.commandName)
    if (!command) return
    try {
        command.execute(interaction)
    } catch (err) {
    }
})

client.once('ready', async ()=>{
    try{
        console.log("빗금 커맨드 푸쉬중 . . .")
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        )
        console.log("빗금 커맨드 푸쉬 완료")
    }catch (e) {
        console.error(e)
    }
    let number = 0
    setInterval(() => {
        const list = ["익명 메세지를 전달"]
        if(number == list.length) number = 0
        client.user.setActivity(list[number],{
            type:"PLAYING"
        })
        number++
    }, 2000)
    console.log("익명봇이 준비되었습니다.")
})