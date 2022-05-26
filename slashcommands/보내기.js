const { SlashCommandBuilder } = require("@discordjs/builders");
const cooldown = new Set();
const { MessageEmbed, WebhookClient } = require('discord.js');
const { webhookId, webhookToken } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("익명")
        .setDescription(`익명메세지를 전송합니다.`)
        .addStringOption(option => option
            .setName("이름")
            .setDescription("전송시 사용될 이름을 알려주세요.")
            .setRequired(true))
        .addStringOption(option => option
            .setName("내용")
            .setDescription("전송될 메세지를 알려주세요.")
            .setRequired(true)
        ),
    async execute(interaction) {
        if (cooldown.has(interaction.user.id)) {
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(`RED`)
                        .setDescription(`<a:x_:941623055703236639> 익명 시스템은 도배방지를 위해 쿨타임이 존재합니다. (3초)`)
                ],
                ephemeral: true,
            });
        } else {
            cooldown.add(interaction.user.id);
            setTimeout(() => {
                cooldown.delete(interaction.user.id);
            }, 3000);
        }
        const date = new Date()
        const time = Math.round(date.getTime() / 1000)
        interaction.reply({ content: `전송완료`, ephemeral: true })
        const text1 = interaction.options.getString("이름")
        const text2 = interaction.options.getString("내용")
        const webhookClient = new WebhookClient({ id: webhookId, token: webhookToken });
        console.log(`시간 : <t:${time}> | ${interaction.user.tag}(${interaction.user.id}) | ${text1} | ${text2}`)
        webhookClient.send({
            content: text2,
            username: text1,
            avatarURL: 'https://img.koreadev.co.kr/ddd.png'
        });
    }
}