async function InsertUserInOrderFunction(arr, user) {
  if (user.id === 1) {
    return [user, ...arr];
  }
  let insertIndex = arr.length;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id < user.id) {
      insertIndex = i + 1;
    } else {
      break;
    }
  }
  arr.splice(insertIndex, 0, user);
  return arr;
}
module.exports = {
  InsertUserInOrderFunction,
};
