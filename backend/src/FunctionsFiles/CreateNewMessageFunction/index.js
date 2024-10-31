const { MessagesUsers } = require("../../Models/MessagesUsers");

async function CreateNewMessageFunction(req) {
  const messageCreate = await MessagesUsers.create({
    message: req.message,
    mediaFile: req.mediaFile,
    userId: req.userId,
    type: req.type,
    recipientId: req.recipientId,
    chatRoomId: req.chatRoomId,
    messageId: req.messageId,
    shared: req.shared,
  });
  return { messageCreate };
}
module.exports = {
  CreateNewMessageFunction,
};
