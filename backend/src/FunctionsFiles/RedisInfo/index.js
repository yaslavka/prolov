const redis = require("redis");
const client = redis.createClient({
  url: `redis://default:${process.env.DB_PASSWORD}@${process.env.DB_HOST_REDIS}:6379`,
});
(async () => {
  try {
    await client.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Error connecting to Redis:", error);
  }
})();

async function updateRendezvousNotify(updateRendezvousNotifyValue) {
  try {
    await client.set(
      "RendezvousNotify",
      JSON.stringify(updateRendezvousNotifyValue),
    );
  } catch (error) {
    console.log(error);
  }
}
async function getNewRendezvous() {
  const getRendezvousNotify = await client.get("RendezvousNotify");
  return JSON.parse(getRendezvousNotify) ? JSON.parse(getRendezvousNotify) : [];
}

async function getRendezvous() {
  const getRendezvousNotify = await client.get("Rendezvous");
  return JSON.parse(getRendezvousNotify) ? JSON.parse(getRendezvousNotify) : [];
}

async function getRendezvousHistory() {
  const getRendezvousNotify = await client.get("RendezvousHistory");
  return JSON.parse(getRendezvousNotify) ? JSON.parse(getRendezvousNotify) : [];
}

async function updateMessageUserNotify(updateMessageNotifyValue) {
  try {
    await client.set(
      "MessagesNotify",
      JSON.stringify(updateMessageNotifyValue),
    );
  } catch (error) {
    console.log(error);
  }
}
async function getNewMessages() {
  const getMessagesNotify = await client.get("MessagesNotify");
  return JSON.parse(getMessagesNotify) ? JSON.parse(getMessagesNotify) : [];
}
async function updateFriendsUserNotify(updateFriendsNotifyValue) {
  try {
    await client.set("friendsNotify", JSON.stringify(updateFriendsNotifyValue));
  } catch (error) {
    console.log(error);
  }
}
async function getNewFriendsNotify() {
  const getFriendsNotify = await client.get("friendsNotify");
  return JSON.parse(getFriendsNotify) ? JSON.parse(getFriendsNotify) : [];
}

async function getUsers() {
  const usersString = await client.get("all_users");
  return JSON.parse(usersString);
}
async function updateAllUsers(usersString) {
  try {
    await client.set("all_users", JSON.stringify(usersString));
  } catch (error) {
    console.log(error);
  }
}
async function getGeneralChatMessages() {
  const generalCatMessages = await client.get("generalCatMessages");
  return JSON.parse(generalCatMessages);
}
async function getAllChatsUsers() {
  const allChatsUsers = await client.get("allChatsUsers");
  return JSON.parse(allChatsUsers);
}

async function getMessagesUsers() {
  const allMessagesUsers = await client.get("allMessagesUsers");
  return JSON.parse(allMessagesUsers);
}

module.exports = {
  getUsers,
  getNewMessages,
  getAllChatsUsers,
  getMessagesUsers,
  updateMessageUserNotify,
  getGeneralChatMessages,
  updateFriendsUserNotify,
  getNewFriendsNotify,
  updateRendezvousNotify,
  getNewRendezvous,
  getRendezvous,
  getRendezvousHistory,
  updateAllUsers,
};
