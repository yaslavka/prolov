const {
  RendezvousHistoryModel,
} = require("../../Models/RendezvousHistoryModel");

async function RendezvousHistoryFunction(rendezvousSearch, id, alUsers) {
  const rendezvousHistory = await RendezvousHistoryModel.findAll({
    where: { userId: id },
  });
  return await Promise.all(
    rendezvousHistory.map(async (ren) => {
      const userHis = alUsers.find(
        (user) => user.id === ren.dataValues.recipientId,
      );
      const his = rendezvousSearch.find(
        (r) => r.id === ren.dataValues.proposalId,
      );
      return {
        ...ren.dataValues,
        ageMin: his.ageMin,
        ageMax: his.ageMax,
        time: his.time,
        sex: his.sex,
        text: his.text,
        country: his.country,
        city: his.city,
        user: userHis,
      };
    }),
  );
}
module.exports = {
  RendezvousHistoryFunction,
};
