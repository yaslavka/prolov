async function FilterRendezvousFunction(rendezvousAll, user) {
  try {
    const ageUser = new Date().getFullYear() - user.year;
    return [
      ...rendezvousAll.filter((rdv) => {
        const usersIdArray = JSON.parse(rdv.usersId);
        const hiddenCountry = JSON.parse(rdv.user.privateGeo);
        const hiddenAge =
          (!rdv.user.ageMin && !rdv.user.ageMax) ||
          (Number(rdv.user.ageMin) >= Number(ageUser) &&
            Number(rdv.user.ageMax) <= Number(ageUser));
        return (
          rdv.userId !== user.id &&
          rdv.sex === user.sex &&
          Number(ageUser) >= Number(rdv.ageMin) &&
          Number(ageUser) <= Number(rdv.ageMax) &&
          rdv.status === true &&
          hiddenAge &&
          (usersIdArray.length === 0 ||
            usersIdArray.some((i) => i !== user.id)) &&
          (hiddenCountry.length === 0 ||
            hiddenCountry.some(
              (i) =>
                i.startsWith(user.country) !== `${user.country}.${user.city}`,
            ))
        );
      }),
    ];
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  FilterRendezvousFunction,
};
