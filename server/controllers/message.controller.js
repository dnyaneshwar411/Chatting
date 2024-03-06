import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export async function sendMessage(req, res) {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const { _id: senderId } = req.user;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId]
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message
    });

    if (message) {
      conversation.messages.push(newMessage._id)
    }

    // SOCKET FUNCTIONALITY WILL GO HERE


    // await conversation.save();
    // await newMessage.save();

    // this will run in parallel
    await Promise.all([conversation.save(), newMessage.save()]);

    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    res.send(500).json({ error: "Internal server error" });
  }
}

export const getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) res.status(201).json([]);

    const messages = conversation.messages;
    res.status(201).json(messages);

  } catch (error) {
    res.send(500).json({ error: "Internal server error" });
  }
}