import * as tf from '@tensorflow/tfjs';
import * as toxicity from "@tensorflow-models/toxicity";
import '@tensorflow/tfjs-backend-cpu';
import auditlogschema from '../../schemas/auditlogSchema';
import { EmbedBuilder } from 'discord.js';

const queue = [];

let model: any;

export async function loadModel() {
  const threshold = 0.9;
  const toxicityLabels = ['identity_attack', 'insult', 'obscene', 'severe_toxicity', 'sexual_explicit', 'threat', 'toxicity'];
  model = await toxicity.load(threshold, toxicityLabels);
}

export async function predictToxicity(word: any, client: any, message: any) {
  try {
    const predictions = await model.classify([word]);
    for (const prediction of predictions) {
      for (const result of prediction.results) {
        if (result.match === true) {
          message.delete();
          const msg = message.channel.send(`<@${message.author.id}> your Message has been flagged by our AI. And has been deleted.`);
          setTimeout(() => {
            msg.then((m: any) => m.delete());
          }, 5000);
          const data = await auditlogschema.findOne({ guildId: message.guild.id });
          if (data) {
            const channel = client.channels.cache.get(data.channelId);
            if (channel) {
              const embed = new EmbedBuilder()
                .setTitle('Message Flagged')
                .setDescription(`<@${message.author.id}> has been flagged by our AI for saying **${word}**. The message was deleted.`)
                .setTimestamp();

              channel.send({ embeds: [embed] })
          }
          return;
        }
      }
    }
  }
  } catch (err) {
    console.log(err);
  }
}