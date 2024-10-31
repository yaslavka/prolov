const {
  getUsers,
  getNewRendezvous,
  getRendezvous,
  updateRendezvousNotify,
} = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const { RendezvousModel } = require("../../Models/RendezvousModel");
const {
  RendezvousHistoryModel,
} = require("../../Models/RendezvousHistoryModel");

async function RendezvousSendFunction(req) {
  let message;
  try {
    const alUsers = await getUsers();
    const allRendezvousNotify = await getNewRendezvous();
    const allRendezvous = await getRendezvous();
    const { authorization } = req;
    if (!authorization) {
      message = { message: "Вы не авторизованы" };
      return { message };
    } else {
      const { email } = decode(authorization);
      const userAuth = { ...alUsers.find((us) => us.email === email) };
      if (!userAuth) {
        message = { message: "Такой пользователь не найден" };
        return { message };
      } else {
        const { id } = req;
        const rendezvous = await RendezvousModel.findAll({
          where: { id: id.map((i) => i), status: true },
        });
        id.map(async (item) => {
          const rendezvousUp = await RendezvousModel.findOne({
            where: { id: item },
          });
          const usersId = JSON.parse(rendezvousUp.usersId);
          if (!usersId.includes(userAuth.id)) {
            usersId.push(userAuth.id);
            await rendezvousUp.update({ usersId: usersId });
          }
        });
        const rendezvousUserIds = rendezvous.map((r) => r.dataValues.userId);
        const recipient = alUsers.filter((us) =>
          rendezvousUserIds.includes(us.id),
        );
        const createdRendezvousHistory = await Promise.all(
          rendezvous.map(async (item) => {
            return await RendezvousHistoryModel.create({
              proposalId: item.dataValues.id,
              userId: userAuth.id,
              recipientId: item.dataValues.userId,
            });
          }),
        );

        const createHistoryFromUser = [];
        const createHistoryFromRecipient = [];

        createdRendezvousHistory.forEach((rendezvousHistory) => {
          const recipientUs = recipient.find(
            (user) => user.id === rendezvousHistory.dataValues.recipientId,
          );
          const historyForUser = {
            ...rendezvousHistory.dataValues,
            usersId: "[]",
            user: recipientUs,
          };
          createHistoryFromUser.push(historyForUser);
          const historyForRecipient = {
            ...rendezvousHistory.dataValues,
            usersId: "[]",
            user: userAuth,
          };
          createHistoryFromRecipient.push(historyForRecipient);
        });

        const newArrAllRendezvousNotify = [
          ...allRendezvousNotify,
          ...rendezvousUserIds.map((userId) => ({ recipientId: userId })),
        ];
        await updateRendezvousNotify(newArrAllRendezvousNotify);
        const oldRendezvous = allRendezvous.filter((rdv) =>
          id.includes(rdv.id),
        );
        const updateOldRendezvous = oldRendezvous.map((rdv) => {
          const usersId = JSON.parse(rdv.usersId);
          if (!usersId.includes(userAuth.id)) {
            usersId.push(userAuth.id);
            return {
              ...rdv,
              usersId: JSON.stringify(usersId),
            };
          }
          return rdv;
        });
        const newArrRendezvous = allRendezvous.filter(
          (rdv) => !id.includes(rdv.id),
        );
        const updateNewArrRendezvousFromUser = [
          ...newArrRendezvous,
          ...updateOldRendezvous,
        ];
        return {
          updateNewArrRendezvousFromUser,
          createHistoryFromUser,
          createHistoryFromRecipient,
          newArrAllRendezvousNotify,
          userAuth,
          recipient,
          alUsers,
        };
      }
    }
  } catch (error) {
    message = error;
    return {
      message,
    };
  }
}
module.exports = {
  RendezvousSendFunction,
};
