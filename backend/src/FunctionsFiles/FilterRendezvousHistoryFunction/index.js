const { getRendezvousHistory } = require("../RedisInfo");

async function FilterRendezvousHistoryFunction(user, alUsers) {
  const rendezvousHistoryAll = await getRendezvousHistory();
  const rendezvousHistory = [
    ...rendezvousHistoryAll.filter(
      (his) => his.userId === user.id || his.recipientId === user.id,
    ),
  ];
  return rendezvousHistory.map((history) => {
    const userId = alUsers.find((us) => us.id === history.userId);
    const recipient = alUsers.find((us) => us.id === history.recipientId);
    return {
      ...history,
      user: history.userId === user.id ? recipient : userId,
    };
  });
}
module.exports = {
  FilterRendezvousHistoryFunction,
};
