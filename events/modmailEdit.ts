import { Client, Message, MessageEmbed } from "discord.js";
import { DiscordEvent } from "../types/event.js";
import {
  previewContent,
  cancellationTimeout,
  ActiveModmail,
} from "./modmail.js";

const constants = {
  NO_CHANNEL_FETCH: "Couldn't fetch channel, check value of CHANNEL_ID in .env",
  EDIT_TOO_LONG: new MessageEmbed()
    .setColor("#ff0000")
    .setTitle("Edited message exceeds length limit!")
    .setDescription(
      "Your edited message is too long, and has not been added into the modmail. Please try again."
    ),
};

const modmailEdit: DiscordEvent = {
  name: "messageUpdate",
  once: false,
  execute: async (
    client,
    { activeMessages },
    oldMessage: Message,
    newMessage: Message
  ) => {
    if (oldMessage.channel.type !== "DM" || oldMessage.author.bot) return;

    // return if a modmail is not active for this user
    const oldMessageObject = activeMessages.get(oldMessage.author.id);
    if (!oldMessageObject) return;

    // load message content and preview
    const { modmailContent, previewId, timeoutHandle } = oldMessageObject;

    // edit the modmail content to include the new changes and handle the edit being too long
    const newModmailContent = modmailContent.replace(
      oldMessage.content,
      newMessage.content
    );
    if (newModmailContent.length > 4096) {
      await oldMessage.channel.send({ embeds: [constants.EDIT_TOO_LONG] });
      return;
    }

    const previewMessage = await oldMessage.channel.messages.fetch(previewId);
    const previewEmbed = previewMessage.embeds[0];

    const newPreviewEmbed = new MessageEmbed(previewEmbed)
      .setDescription(previewContent(newModmailContent))
      .setTimestamp();

    await previewMessage.edit({ embeds: [newPreviewEmbed] });

    // renew timeout
    clearTimeout(timeoutHandle);
    const newTimeoutHandle = cancellationTimeout(
      activeMessages,
      oldMessage.author.id,
      oldMessage.channel,
      previewMessage
    );

    // update activeMessages
    activeMessages.set(oldMessage.author.id, {
      modmailContent: newModmailContent,
      previewId: previewMessage.id,
      timeoutHandle: newTimeoutHandle,
    });
  },
};

export default modmailEdit;
