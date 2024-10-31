const redis = require("redis");
const { UserTable } = require("../../Models/UserModels");
const getUserData = require("../../service/getUserData");
const dayjs = require("dayjs");
const { MessagesChat } = require("../../Models/MessagesChat");
const { RendezvousModel } = require("../../Models/RendezvousModel");
const {
  RendezvousHistoryModel,
} = require("../../Models/RendezvousHistoryModel");
const { ChatRoomUsers } = require("../../Models/ChatRoomUsers");
const { MessagesUsers } = require("../../Models/MessagesUsers");
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

async function getUsers() {
  const usersString = await client.get("all_users");
  return JSON.parse(usersString);
}

async function UpdateUsersData() {
  const usersData = await UserTable.findAll();
  const users = await Promise.all(
    usersData.map(async (user) => {
      const userData = await getUserData(user.dataValues.id);
      return { ...userData.dataValues };
    }),
  );
  await client.set("all_users", JSON.stringify(users));
}

async function getRendezvous() {
  const getRendezvousNotify = await client.get("Rendezvous");
  return JSON.parse(getRendezvousNotify) ? JSON.parse(getRendezvousNotify) : [];
}

async function UpdateRedisInfo() {
  try {
    await UpdateUsersData();
  } catch (e) {
    console.log(e);
  } finally {
    try {
      const allUsers = await getUsers();
      const users = await UserTable.findAll({
        where: { isRendezvous: true },
      });
      const rendezvous = await RendezvousModel.findAll();
      const now = dayjs();
      const updatePromises = users.map(async (user) => {
        const rendezvousTime = dayjs(user.dataValues.isRendezvousTime);
        if (now.isAfter(rendezvousTime.add(24, "hour"))) {
          await UserTable.update(
            { isRendezvous: false },
            { where: { id: user.dataValues.id } },
          );
        }
      });
      const updateRendezvous = rendezvous.map(async (rdv) => {
        const rendezvousTime = dayjs(rdv.dataValues.createdAt);
        if (now.isAfter(rendezvousTime.add(rdv.dataValues.time, "hour"))) {
          const userIds = allUsers.map((user) => user.id);
          await RendezvousModel.update(
            { usersId: userIds, status: false },
            { where: { id: rdv.dataValues.id } },
          );
          await RendezvousHistoryModel.update(
            { usersId: userIds },
            { where: { proposalId: rdv.dataValues.id } },
          );
        }
      });
      await Promise.all([updatePromises, updateRendezvous]);
    } catch (e) {
      console.log(e);
    } finally {
      try {
        await UpdateUsersData();
      } catch (e) {
        console.log(e);
      } finally {
        try {
          const allUsers = await getUsers();
          const rendezvous = await RendezvousModel.findAll();
          const result = await Promise.all(
            rendezvous.map((item) => {
              const user = allUsers.find(
                (us) => us.id === item.dataValues.userId,
              );
              return {
                ...item.dataValues,
                user: user,
              };
            }),
          );
          await client.set("Rendezvous", JSON.stringify(result));
        } catch (e) {
          console.log(e);
        } finally {
          try {
            const rendezvous = await RendezvousModel.findAll();
            const rendezvousHistoryIn = await Promise.all(
              rendezvous.map(async (rdv) => {
                const rendezvousHistory = await RendezvousHistoryModel.findOne({
                  where: { proposalId: rdv.dataValues.id },
                });
                return {
                  ...rdv.dataValues,
                  id: rendezvousHistory?.id,
                  status: rendezvousHistory?.status,
                  userId: rendezvousHistory?.userId,
                  usersId: rendezvousHistory?.usersId,
                  recipientId: rendezvousHistory?.recipientId,
                  createdAt: rendezvousHistory?.createdAt,
                  cancel: rendezvousHistory?.cancel,
                  proposalId: rendezvousHistory?.proposalId,
                  user: null,
                };
              }),
            );
            const result =
              rendezvousHistoryIn.length > 0 ? rendezvousHistoryIn : [];
            await client.set("RendezvousHistory", JSON.stringify(result));
          } catch (e) {
            console.log(e);
          } finally {
            try {
              const allUsers = await getUsers();
              const messages = await MessagesChat.findAll({
                where: { chatRoomAllId: 1 },
              });
              let result = [];
              if (messages.length > 0) {
                result = await Promise.all(
                  messages.map((m) => {
                    const user = {
                      ...allUsers.find((us) => us.id === m.dataValues.userId),
                    };
                    return {
                      ...m.dataValues,
                      user: user,
                    };
                  }),
                );
              }
              await client.set("generalCatMessages", JSON.stringify(result));
            } catch (e) {
              console.log(e);
            } finally {
              try {
                const chatUsers = await ChatRoomUsers.findAll();
                await client.set("allChatsUsers", JSON.stringify(chatUsers));
              } catch (error) {
                console.log(error);
              } finally {
                try {
                  const messages = await MessagesUsers.findAll();
                  await client.set(
                    "allMessagesUsers",
                    JSON.stringify(messages),
                  );
                } catch (error) {
                  console.log(error);
                }
              }
            }
          }
        }
      }
    }
  }
  process.nextTick(() => UpdateRedisInfo());
}

module.exports = {
  UpdateRedisInfo,
};
