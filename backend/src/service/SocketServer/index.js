const {
  getNewMessages,
  updateMessageUserNotify,
  getUsers,
  getNewRendezvous,
  getNewFriendsNotify,
  updateFriendsUserNotify,
  updateRendezvousNotify,
} = require("../../FunctionsFiles/RedisInfo");
const { RegisterFunction } = require("../../FunctionsFiles/RegisterFunction");
const { LoginFunction } = require("../../FunctionsFiles/LoginFunction");
const { UserInfoFunction } = require("../../FunctionsFiles/UserInfoFunction");
const { VerifyOtpFunction } = require("../../FunctionsFiles/VerifyOtpFunction");
const { UserTable } = require("../../Models/UserModels");
const { AllUsersFunction } = require("../../FunctionsFiles/AllUsersFunction");
const {
  AddFavoriteFunction,
} = require("../../FunctionsFiles/AddFavoriteFunction");
const {
  YourAimUpdateFunction,
} = require("../../FunctionsFiles/YourAimUpdateFunction");
const {
  StatusUpdateFunction,
} = require("../../FunctionsFiles/StatusUpdateFunction");
const {
  NameUpdateFunction,
} = require("../../FunctionsFiles/NameUpdateFunction");
const { EditEmailFunction } = require("../../FunctionsFiles/EditEmailFunction");
const { SexUpdateFunction } = require("../../FunctionsFiles/SexUpdateFunction");
const {
  SavePrivateSexFunction,
} = require("../../FunctionsFiles/SavePrivateSexFunction");
const { SaveAgeFunction } = require("../../FunctionsFiles/SaveAgeFunction");
const { SaveGeoFunction } = require("../../FunctionsFiles/SaveGeoFunction");
const {
  GenderUpdateFunction,
} = require("../../FunctionsFiles/GenderUpdateFunction");
const {
  AppearanceUpdateFunction,
} = require("../../FunctionsFiles/AppearanceUpdateFunction");
const {
  BodyTypeUpdateFunction,
} = require("../../FunctionsFiles/BodyTypeUpdateFunction");
const {
  HeightUpdateFunction,
} = require("../../FunctionsFiles/HeightUpdateFunction");
const {
  WeightUpdateFunction,
} = require("../../FunctionsFiles/WeightUpdateFunction");
const {
  AgeRestrictionUpdateFunction,
} = require("../../FunctionsFiles/AgeRestrictionUpdateFunction");
const {
  HairColorUpdateFunction,
} = require("../../FunctionsFiles/HairColorUpdateFunction");
const {
  EyeColorUpdateFunction,
} = require("../../FunctionsFiles/EyeColorUpdateFunction");
const {
  EditCharacterFunction,
} = require("../../FunctionsFiles/EditCharacterFunction");
const {
  ChildrenUpdateFunction,
} = require("../../FunctionsFiles/ChildrenUpdateFunction");
const {
  ReligionUpdateFunction,
} = require("../../FunctionsFiles/ReligionUpdateFunction");
const {
  ZodiacUpdateFunction,
} = require("../../FunctionsFiles/ZodiacUpdateFunction");
const {
  EducationUpdateFunction,
} = require("../../FunctionsFiles/EducationUpdateFunction");
const {
  TypesOfHobbiesUpdateFunction,
} = require("../../FunctionsFiles/TypesOfHobbiesUpdateFunction");
const {
  AlcoholUpdateFunction,
} = require("../../FunctionsFiles/AlcoholUpdateFunction");
const {
  SmokingUpdateFunction,
} = require("../../FunctionsFiles/SmokingUpdateFunction");
const {
  GeoPrivateUpdateFunction,
} = require("../../FunctionsFiles/GeoPrivateUpdateFunction");
const {
  IsSearchUpdateFunction,
} = require("../../FunctionsFiles/IsSearchUpdateFunction");
const {
  ResetPrivateUpdateFunction,
} = require("../../FunctionsFiles/ResetPrivateUpdateFunction");
const { ReviewsModel } = require("../../Models/ReviewsModel");
const {
  AcceptFriendsFunction,
} = require("../../FunctionsFiles/AcceptFriendsFunction");
const {
  AddFriendsFunction,
} = require("../../FunctionsFiles/AddFriendsFunction");
const {
  HiddenFriendsFunction,
} = require("../../FunctionsFiles/HiddenFriendsFunction");
const {
  CancelFriendsFunction,
} = require("../../FunctionsFiles/CancelFriendsFunction");
const {
  AllMessagesUserFunction,
} = require("../../FunctionsFiles/AllMessagesUserFunction");
const {
  SendMessageTouUser,
} = require("../../FunctionsFiles/SendMessageTouUser");
const {
  DeleteMessageFunction,
} = require("../../FunctionsFiles/DeleteMessageFunction");
const {
  ActionsBlockFunction,
} = require("../../FunctionsFiles/ActionsBlockFunction");
const {
  ActionsClearChatFunction,
} = require("../../FunctionsFiles/ActionsClearChatFunction");
const {
  ActionsDeleteDialogueFunction,
} = require("../../FunctionsFiles/ActionsDeleteDialogueFunction");
const {
  SaveComplaintsFunction,
} = require("../../FunctionsFiles/SaveComplaintsFunction");
const {
  PolicyChatFunction,
} = require("../../FunctionsFiles/PolicyChatFunction");
const {
  GeneralChatFunction,
} = require("../../FunctionsFiles/GeneralChatFunction");
const { SendGeneralChat } = require("../../FunctionsFiles/SendGeneralChat");
const {
  SaveImageToMyGalleryFunction,
} = require("../../FunctionsFiles/SaveImageToMyGalleryFunction");
const {
  InstallAvatarFunction,
} = require("../../FunctionsFiles/InstallAvatarFunction");
const { IsLikeFunction } = require("../../FunctionsFiles/IsLikeFunction");
const { IsUnLikeFunction } = require("../../FunctionsFiles/IsUnLikeFunction");
const {
  DeleteAvatarFunction,
} = require("../../FunctionsFiles/DeleteAvatarFunction");
const {
  CommentCreateFunction,
} = require("../../FunctionsFiles/CommentCreateFunction");
const {
  CommentCreateRepliesFunction,
} = require("../../FunctionsFiles/CommentCreateRepliesFunction");
const {
  AllRendezvousFunction,
} = require("../../FunctionsFiles/AllRendezvousFunction");
const {
  RendezvousSendFunction,
} = require("../../FunctionsFiles/RendezvousSendFunction");
const {
  FilterRendezvousFunction,
} = require("../../FunctionsFiles/FilterRendezvousFunction");
const {
  CancelRendezvousHistoryFunction,
} = require("../../FunctionsFiles/CancelRendezvousHistoryFunction");
const {
  RendezvousHiddenFunction,
} = require("../../FunctionsFiles/RendezvousHiddenFunction");
const {
  RendezvousHistoryDeleteFunction,
} = require("../../FunctionsFiles/RendezvousHistoryDeleteFunction");
const {
  MyRendezvousInfoFunction,
} = require("../../FunctionsFiles/MyRendezvousInfoFunction");
const {
  RendezvousDeleteFunction,
} = require("../../FunctionsFiles/RendezvousDeleteFunction");
const {
  RendezvousCreateFunction,
} = require("../../FunctionsFiles/RendezvousCreateFunction");
const {
  RendezvousAcceptFunction,
} = require("../../FunctionsFiles/RendezvousAcceptFunction");
const {
  GiveASubscriptionFunction,
} = require("../../FunctionsFiles/GiveASubscriptionFunction");
const {
  ChangePasswordFunction,
} = require("../../FunctionsFiles/ChangePasswordFunction");
const {
  ResetPasswordFunction,
} = require("../../FunctionsFiles/ResetPasswordFunction");
let usersOnline = [];

async function SocketServer(socket, io) {
  try {
    //добавляем нового пользователя в список пользователей онлайн и отправляем нотификшки если они у него есть
    socket.on("joinUser", async (user) => {
      console.log("Пользователь подключился: " + socket.id);
      const messageNotfi = await getNewMessages();
      const rendezvousNotify = await getNewRendezvous();
      const friendsNotify = await getNewFriendsNotify();
      io.emit(`newMessageNotify`, messageNotfi);
      io.emit(`rendezvousNotify`, rendezvousNotify);
      io.emit(`friendsNotify`, friendsNotify);
      const data = usersOnline.find((userId) => userId.id === user.id);
      if (user && !data) {
        usersOnline.push({ id: user.id, socketId: socket.id });
        io.emit("checkUserOnlineToMe", usersOnline);
      } else {
        console.log(`User already exists: ${user.id}`);
      }
    });
    //обновляем список пользователей которые остались онлайн
    socket.on("disconnect", async () => {
      try {
        const data = usersOnline.find((user) => user.socketId === socket.id);
        if (data) {
          await UserTable.update(
            { ofline: Date.now() },
            { where: { id: data.id } },
          );
          usersOnline = usersOnline.filter(
            (user) => user.socketId !== data.socketId,
          );
          console.log("Пользователь вышел из сети", socket.id);
          io.emit("checkUserOnlineToMe", usersOnline);
        }
      } catch (error) {
        console.log(error);
      }
    });
    // удаление нотификашки просмотренного рандеву
    socket.on("viewRendezvous", async (data) => {
      const rendezvousNotify = await getNewRendezvous();
      for (let i = 0; i < rendezvousNotify.length; i++) {
        if (rendezvousNotify[i].recipientId === data.recipientId) {
          rendezvousNotify.splice(i, 1);
          break;
        }
      }
      await updateRendezvousNotify(rendezvousNotify);
      io.emit(`rendezvousNotify`, rendezvousNotify);
    });
    // удаление нотификашки просмотренного сообщения
    socket.on("messageView", async (messages) => {
      const messageNotfi = await getNewMessages();
      for (let i = 0; i < messageNotfi.length; i++) {
        if (
          messageNotfi[i].chatRoomId === messages.chatRoomId &&
          messageNotfi[i].recipientId === messages.userId
        ) {
          messageNotfi.splice(i, 1);
          break;
        }
      }
      await updateMessageUserNotify(messageNotfi);
      io.emit(`newMessageNotify`, messageNotfi);
    });
    // удаление нотификашки просмотренных входящих заявок друзей
    socket.on("viewFriendsNotify", async (data) => {
      const allFriendsNotify = await getNewFriendsNotify();
      for (let i = 0; i < allFriendsNotify.length; i++) {
        if (allFriendsNotify[i].recipientId === data.userId) {
          allFriendsNotify.splice(i, 1);
          break;
        }
      }
      await updateFriendsUserNotify(allFriendsNotify);
      io.emit(`friendsNotify`, allFriendsNotify);
    });

    // количество просмотров профиля
    socket.on("viewProfile", async (data) => {
      const allUsers = await getUsers();
      const user = { ...allUsers.find((us) => us.id === data.userId) };
      await UserTable.update(
        { view: Number(user.view) + 1 },
        { where: { id: data.userId } },
      );
      const update = allUsers.map((us) => {
        if (us.id === data.userId) {
          return {
            ...us,
            view: Number(user.view) + 1,
          };
        }
        return us;
      });
      const newArrUsers = [...allUsers];
      await Promise.all([
        newArrUsers.map((us) => {
          const usersSend = [...update.filter((u) => u.id !== us.id)];
          io.emit(`allUsers${us.id}`, usersSend.reverse());
        }),
      ]);
    });
    //функция Регистрации
    socket.on("register", async (data) => {
      const socketId = { socketId: socket.id };
      const { message, access_token, email } = await RegisterFunction(data);
      if (message !== undefined) {
        io.to(socketId.socketId).emit("errorHandlerLogin", message);
      } else {
        io.to(socketId.socketId).emit("registerResponse", {
          access_token,
          email,
        });
      }
    });
    //функция авторизации пользователя
    socket.on("login", async (data) => {
      const socketId = { socketId: socket.id };
      const { message, access_token, email } = await LoginFunction(data);
      if (message !== undefined) {
        io.to(socketId.socketId).emit("errorHandlerLogin", message);
      } else {
        const result = { access_token, email };
        io.to(socketId.socketId).emit("loginResponse", result);
      }
    });
    //функция проверки кода подтверждения
    socket.on("verifyOtp", async (data) => {
      const socketId = { socketId: socket.id };
      const { message, success } = await VerifyOtpFunction(data);
      if (message !== undefined) {
        io.to(socketId.socketId).emit("errorHandlerVerifyOtp", message);
      } else {
        io.to(socketId.socketId).emit("verifyOtpResponse", success);
      }
    });
    //получения текущего авторизованнго пользователя
    socket.on("user", async (data) => {
      const socketId = { socketId: socket.id };
      const { message, user } = await UserInfoFunction(data);
      if (message !== undefined) {
        io.to(socketId.socketId).emit("errorHandlerUserAuth", message);
      } else {
        io.to(socketId.socketId).emit(`userAuth`, user);
        io.to(socket.id).emit(`clearAddFriends${user.id}`, []);
      }
    });
    //Получение Списка всех пользователей кроме текущего авторизованного
    socket.on("getAllUsers", async (data) => {
      const socketId = { socketId: socket.id };
      const { message, users, user } = await AllUsersFunction(data);
      if (message !== undefined) {
        io.to(socketId.socketId).emit("errorHandlerAllUsers", message);
      } else {
        io.emit(`allUsers${user.id}`, users.reverse());
        io.to(socket.id).emit(`clearAddFriends${user.id}`, []);
      }
    });
    // добавить пользователя в избранные или удалить из избранных
    socket.on("addFavorite", async (data) => {
      const socketId = { socketId: socket.id };
      if (data.type === "delete") {
        const { message, user } = await AddFavoriteFunction(data);
        if (message !== undefined) {
          io.to(socketId.socketId).emit("errorHandlerAddFavorite", message);
        } else {
          io.to(socketId.socketId).emit(`userInfo${user.id}`, user);
        }
      } else if (data.type === "add") {
        const { message, user } = await AddFavoriteFunction(data);
        if (message !== undefined) {
          io.to(socketId.socketId).emit("errorHandlerAddFavorite", message);
        } else {
          io.to(socketId.socketId).emit(`userInfo${user.id}`, user);
        }
      }
    });
    // обновление Цель Знакомства
    socket.on("yourAimUpdate", async (data) => {
      const { message, user, allUsers } = await YourAimUpdateFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorHandlerYourAimUpdate", message);
      } else {
        io.emit(`userInfo${user.id}`, user);
        // обновление моего профиля в рельном времени у всех польтзовалей не обновляя страницу пользователи сразу увидят изминения в моем профиле
        await Promise.all(
          allUsers.reverse().map((us) => {
            const users = allUsers.filter((u) => u.id !== us.id);
            io.emit(`allUsers${us.id}`, users.reverse());
          }),
        );
      }
    });
    // обновление статуса
    socket.on("statusUpdate", async (data) => {
      const { message, user, allUsers } = await StatusUpdateFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorHandlerStatusUpdate", message);
      } else {
        io.emit(`userInfo${user.id}`, user);
        // обновление моего профиля в рельном времени у всех польтзовалей не обновляя страницу пользователи сразу увидят изминения в моем профиле
        await Promise.all(
          allUsers.reverse().map((us) => {
            const users = allUsers.filter((u) => u.id !== us.id);
            io.emit(`allUsers${us.id}`, users.reverse());
          }),
        );
      }
    });
    // обновление имени
    socket.on("nameUpdate", async (data) => {
      const { message, user, allUsers } = await NameUpdateFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorHandlerNameUpdate", message);
      } else {
        io.emit(`userInfo${user.id}`, user);
        // обновление моего профиля в рельном времени у всех польтзовалей не обновляя страницу пользователи сразу увидят изминения в моем профиле
        await Promise.all(
          allUsers.reverse().map((us) => {
            const users = allUsers.filter((u) => u.id !== us.id);
            io.emit(`allUsers${us.id}`, users.reverse());
          }),
        );
      }
    });
    //обновление еmail
    socket.on("emailUpdate", async (data) => {
      const socketId = { socketId: socket.id };
      const { message, user, access_token } = await EditEmailFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorHandlerEmailUpdate", message);
      } else {
        io.to(socketId.socketId).emit(`access_token${user.id}`, access_token);
        io.to(socketId.socketId).emit(`userInfo${user.id}`, user);
      }
    });
    //обновления пола
    socket.on("sexUpdate", async (data) => {
      const { message, user, allUsers } = await SexUpdateFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorHandlerSexUpdate", message);
      } else {
        io.emit(`userInfo${user.id}`, user);
        // обновление моего профиля в рельном времени у всех польтзовалей не обновляя страницу пользователи сразу увидят изминения в моем профиле
        await Promise.all(
          allUsers.reverse().map((us) => {
            const users = allUsers.filter((u) => u.id !== us.id);
            io.emit(`allUsers${us.id}`, users.reverse());
          }),
        );
      }
    });
    // обновление приватности какой пол можен добавлять или писать пользователю
    socket.on("savePrivateSexUpdate", async (data) => {
      const { message, user, allUsers } = await SavePrivateSexFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorHandlerSavePrivateSexUpdate", message);
      } else {
        io.emit(`userInfo${user.id}`, user);
        // обновление моего профиля в рельном времени у всех польтзовалей не обновляя страницу пользователи сразу увидят изминения в моем профиле
        await Promise.all(
          allUsers.reverse().map((us) => {
            const users = allUsers.filter((u) => u.id !== us.id);
            io.emit(`allUsers${us.id}`, users.reverse());
          }),
        );
      }
    });
    // обновление возраста
    socket.on("ageUpdate", async (data) => {
      const { message, user, allUsers } = await SaveAgeFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorHandlerAgeUpdate", message);
      } else {
        io.emit(`userInfo${user.id}`, user);
        // обновление моего профиля в рельном времени у всех польтзовалей не обновляя страницу пользователи сразу увидят изминения в моем профиле
        await Promise.all(
          allUsers.reverse().map((us) => {
            const users = allUsers.filter((u) => u.id !== us.id);
            io.emit(`allUsers${us.id}`, users.reverse());
          }),
        );
      }
    });
    // обновление города и страны
    socket.on("geoUpdate", async (data) => {
      const { message, user, allUsers } = await SaveGeoFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorHandlerGeoUpdate", message);
      } else {
        io.emit(`userInfo${user.id}`, user);
        // обновление моего профиля в рельном времени у всех польтзовалей не обновляя страницу пользователи сразу увидят изминения в моем профиле
        await Promise.all(
          allUsers.reverse().map((us) => {
            const users = allUsers.filter((u) => u.id !== us.id);
            io.emit(`allUsers${us.id}`, users.reverse());
          }),
        );
      }
    });
    // обновление ориентации
    socket.on("genderUpdate", async (data) => {
      const { message, allUsers, user } = await GenderUpdateFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorHandlerGenderUpdate", message);
      } else {
        io.emit(`userInfo${user.id}`, user);
        // обновление моего профиля в рельном времени у всех польтзовалей не обновляя страницу пользователи сразу увидят изминения в моем профиле
        await Promise.all(
          allUsers.reverse().map((us) => {
            const users = allUsers.filter((u) => u.id !== us.id);
            io.emit(`allUsers${us.id}`, users.reverse());
          }),
        );
      }
    });

    //обновление внешности
    socket.on("appearanceUpdate", async (data) => {
      const { message, allUsers, user } = await AppearanceUpdateFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorHandlerAppearanceUpdate", message);
      } else {
        io.emit(`userInfo${user.id}`, user);
        // обновление моего профиля в рельном времени у всех польтзовалей не обновляя страницу пользователи сразу увидят изминения в моем профиле
        await Promise.all(
          allUsers.reverse().map((us) => {
            const users = allUsers.filter((u) => u.id !== us.id);
            io.emit(`allUsers${us.id}`, users.reverse());
          }),
        );
      }
    });
    // обновление тело-сложение
    socket.on("bodyTypeUpdate", async (data) => {
      const { message, allUsers, user } = await BodyTypeUpdateFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorHandlerBodyTypeUpdate", message);
      } else {
        io.emit(`userInfo${user.id}`, user);
        // обновление моего профиля в рельном времени у всех польтзовалей не обновляя страницу пользователи сразу увидят изминения в моем профиле
        await Promise.all(
          allUsers.reverse().map((us) => {
            const users = allUsers.filter((u) => u.id !== us.id);
            io.emit(`allUsers${us.id}`, users.reverse());
          }),
        );
      }
    });
    // обновление рост
    socket.on("heightUpdate", async (data) => {
      const { message, user, allUsers } = await HeightUpdateFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorHandlerHeightUpdate", message);
      } else {
        io.emit(`userInfo${user.id}`, user);
        // обновление моего профиля в рельном времени у всех польтзовалей не обновляя страницу пользователи сразу увидят изминения в моем профиле
        await Promise.all(
          allUsers.reverse().map((us) => {
            const users = allUsers.filter((u) => u.id !== us.id);
            io.emit(`allUsers${us.id}`, users.reverse());
          }),
        );
      }
    });
    //обновление вес
    socket.on("weightUpdate", async (data) => {
      const { message, user, allUsers } = await WeightUpdateFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorHandlerWeightUpdate", message);
      } else {
        io.emit(`userInfo${user.id}`, user);
        // обновление моего профиля в рельном времени у всех польтзовалей не обновляя страницу пользователи сразу увидят изминения в моем профиле
        await Promise.all(
          allUsers.reverse().map((us) => {
            const users = allUsers.filter((u) => u.id !== us.id);
            io.emit(`allUsers${us.id}`, users.reverse());
          }),
        );
      }
    });
    // ограничение по возрасту от скольки до скольки могут добавлять в друзья
    socket.on("ageRestrictionUpdate", async (data) => {
      const { message, user, allUsers } =
        await AgeRestrictionUpdateFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorAgeRestrictionUpdate", message);
      } else {
        io.emit(`userInfo${user.id}`, user);
        // обновление моего профиля в рельном времени у всех польтзовалей не обновляя страницу пользователи сразу увидят изминения в моем профиле
        await Promise.all(
          allUsers.reverse().map((us) => {
            const users = allUsers.filter((u) => u.id !== us.id);
            io.emit(`allUsers${us.id}`, users.reverse());
          }),
        );
      }
    });
    //цвет волос
    socket.on("hairColorUpdate", async (data) => {
      const { message, user, allUsers } = await HairColorUpdateFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorHairColorUpdate", message);
      } else {
        io.emit(`userInfo${user.id}`, user);
        // обновление моего профиля в рельном времени у всех польтзовалей не обновляя страницу пользователи сразу увидят изминения в моем профиле
        await Promise.all(
          allUsers.reverse().map((us) => {
            const users = allUsers.filter((u) => u.id !== us.id);
            io.emit(`allUsers${us.id}`, users.reverse());
          }),
        );
      }
    });
    //цвет глаз
    socket.on("eyeColorUpdate", async (data) => {
      const { message, allUsers, user } = await EyeColorUpdateFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorEyeColorUpdate", message);
      } else {
        io.emit(`userInfo${user.id}`, user);
        // обновление моего профиля в рельном времени у всех польтзовалей не обновляя страницу пользователи сразу увидят изминения в моем профиле
        await Promise.all(
          allUsers.reverse().map((us) => {
            const users = allUsers.filter((u) => u.id !== us.id);
            io.emit(`allUsers${us.id}`, users.reverse());
          }),
        );
      }
    });
    // обновление характер
    socket.on("characterUpdate", async (data) => {
      const { message, allUsers, user } = await EditCharacterFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorCharacterUpdate", message);
      } else {
        io.emit(`userInfo${user.id}`, user);
        // обновление моего профиля в рельном времени у всех польтзовалей не обновляя страницу пользователи сразу увидят изминения в моем профиле
        await Promise.all(
          allUsers.reverse().map((us) => {
            const users = allUsers.filter((u) => u.id !== us.id);
            io.emit(`allUsers${us.id}`, users.reverse());
          }),
        );
      }
    });
    // обновление дети
    socket.on("childrenUpdate", async (data) => {
      const { message, allUsers, user } = await ChildrenUpdateFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorChildrenUpdate", message);
      } else {
        io.emit(`userInfo${user.id}`, user);
        // обновление моего профиля в рельном времени у всех польтзовалей не обновляя страницу пользователи сразу увидят изминения в моем профиле
        await Promise.all(
          allUsers.reverse().map((us) => {
            const users = allUsers.filter((u) => u.id !== us.id);
            io.emit(`allUsers${us.id}`, users.reverse());
          }),
        );
      }
    });

    // обновление религии
    socket.on("religionUpdate", async (data) => {
      const { message, allUsers, user } = await ReligionUpdateFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorReligionUpdate", message);
      } else {
        io.emit(`userInfo${user.id}`, user);
        // обновление моего профиля в рельном времени у всех польтзовалей не обновляя страницу пользователи сразу увидят изминения в моем профиле
        await Promise.all(
          allUsers.reverse().map((us) => {
            const users = allUsers.filter((u) => u.id !== us.id);
            io.emit(`allUsers${us.id}`, users.reverse());
          }),
        );
      }
    });

    //обновление знака зодиака
    socket.on("zodiacUpdate", async (data) => {
      const { message, allUsers, user } = await ZodiacUpdateFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorZodiacUpdate", message);
      } else {
        io.emit(`userInfo${user.id}`, user);
        // обновление моего профиля в рельном времени у всех польтзовалей не обновляя страницу пользователи сразу увидят изминения в моем профиле
        await Promise.all(
          allUsers.reverse().map((us) => {
            const users = allUsers.filter((u) => u.id !== us.id);
            io.emit(`allUsers${us.id}`, users.reverse());
          }),
        );
      }
    });

    // образование
    socket.on("educationUpdate", async (data) => {
      const { message, allUsers, user } = await EducationUpdateFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorEducationUpdate", message);
      } else {
        io.emit(`userInfo${user.id}`, user);
        // обновление моего профиля в рельном времени у всех польтзовалей не обновляя страницу пользователи сразу увидят изминения в моем профиле
        await Promise.all(
          allUsers.reverse().map((us) => {
            const users = allUsers.filter((u) => u.id !== us.id);
            io.emit(`allUsers${us.id}`, users.reverse());
          }),
        );
      }
    });

    // обновление хоби
    socket.on("typesOfHobbiesUpdate", async (data) => {
      const { message, allUsers, user } =
        await TypesOfHobbiesUpdateFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorTypesOfHobbiesUpdate", message);
      } else {
        io.emit(`userInfo${user.id}`, user);
        // обновление моего профиля в рельном времени у всех польтзовалей не обновляя страницу пользователи сразу увидят изминения в моем профиле
        await Promise.all(
          allUsers.reverse().map((us) => {
            const users = allUsers.filter((u) => u.id !== us.id);
            io.emit(`allUsers${us.id}`, users.reverse());
          }),
        );
      }
    });

    // обновление употребление алкоголя
    socket.on("alcoholUpdate", async (data) => {
      const { message, allUsers, user } = await AlcoholUpdateFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorAlcoholUpdate", message);
      } else {
        io.emit(`userInfo${user.id}`, user);
        // обновление моего профиля в рельном времени у всех польтзовалей не обновляя страницу пользователи сразу увидят изминения в моем профиле
        await Promise.all(
          allUsers.reverse().map((us) => {
            const users = allUsers.filter((u) => u.id !== us.id);
            io.emit(`allUsers${us.id}`, users.reverse());
          }),
        );
      }
    });

    // обновление курящих
    socket.on("smokingUpdate", async (data) => {
      const { message, allUsers, user } = await SmokingUpdateFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorSmokingUpdate", message);
      } else {
        io.emit(`userInfo${user.id}`, user);
        // обновление моего профиля в рельном времени у всех польтзовалей не обновляя страницу пользователи сразу увидят изминения в моем профиле
        await Promise.all(
          allUsers.reverse().map((us) => {
            const users = allUsers.filter((u) => u.id !== us.id);
            io.emit(`allUsers${us.id}`, users.reverse());
          }),
        );
      }
    });

    // из каких городов и стран могут добавлять в друзья
    socket.on("geoPrivateUpdate", async (data) => {
      const { message, allUsers, user } = await GeoPrivateUpdateFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorGeoPrivateUpdate", message);
      } else {
        io.emit(`userInfo${user.id}`, user);
        await Promise.all(
          allUsers.reverse().map((us) => {
            const users = allUsers.filter((u) => u.id !== us.id);
            io.emit(`allUsers${us.id}`, users.reverse());
          }),
        );
      }
    });

    // исключение профиля из поиска
    socket.on("isSearchUpdate", async (data) => {
      const { message, allUsers, user } = await IsSearchUpdateFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorIsSearchUpdate", message);
      } else {
        io.emit(`userInfo${user.id}`, user);
        // обновление моего профиля в рельном времени у всех польтзовалей не обновляя страницу пользователи сразу увидят изминения в моем профиле
        await Promise.all(
          allUsers.reverse().map((us) => {
            const users = allUsers.filter((u) => u.id !== us.id);
            io.emit(`allUsers${us.id}`, users.reverse());
          }),
        );
      }
    });

    // сброс приватности по умолчанию
    socket.on("resetPrivateUpdate", async (data) => {
      const { message, allUsers, user } =
        await ResetPrivateUpdateFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorResetPrivateUpdate", message);
      } else {
        io.emit(`userInfo${user.id}`, user);
        // обновление моего профиля в рельном времени у всех польтзовалей не обновляя страницу пользователи сразу увидят изминения в моем профиле
        await Promise.all(
          allUsers.reverse().map((us) => {
            const users = allUsers.filter((u) => u.id !== us.id);
            io.emit(`allUsers${us.id}`, users.reverse());
          }),
        );
      }
    });

    // отзывы к профилю пользователя
    socket.on("reviewSend", async (data) => {
      const resultUsers = await getUsers();
      const recipientUser = resultUsers.find(
        (us) => us.id === data.recipientId,
      );
      const senderUser = resultUsers.find((us) => us.id === data.userId);
      const review = await ReviewsModel.create({
        text: data.text,
        userId: data.userId,
        recipientId: data.recipientId,
      });
      review.dataValues.user = senderUser;
      recipientUser.review = [
        ...recipientUser.review,
        { ...review.dataValues },
      ];
      const allUsers = resultUsers.map((us) =>
        us.id === recipientUser.id ? recipientUser : us,
      );
      const allUsersFromUser = allUsers.filter((us) => us.id !== data.userId);
      io.emit(`allUsers${data.userId}`, allUsersFromUser.reverse());
      // обновление моего профиля в рельном времени у всех польтзовалей не обновляя страницу пользователи сразу увидят изминения в моем профиле
      await Promise.all(
        allUsersFromUser.map((us) => {
          const users = allUsersFromUser.filter((u) => u.id !== us.id);
          io.emit(`allUsers${us.id}`, users.reverse());
        }),
      );
    });

    // добавление в друзья
    socket.on("addFriends", async (data) => {
      const socketId = { socketId: socket.id };
      if (data.type === "add") {
        const { message, newFriends, user, recipient, usersAll, users } =
          await AddFriendsFunction(data);
        if (message !== undefined) {
          io.to(socketId.socketId).emit("errorHandlerAddFriends", message);
        } else {
          io.emit(`friendsNotify`, newFriends);
          io.emit(`userInfo${user.id}`, user);
          io.emit(`allUsers${user.id}`, users.reverse());
          io.emit(`userInfo${recipient.id}`, recipient);
          io.emit(`allUsers${recipient.id}`, usersAll.reverse());
        }
        // принять заявку
      } else if (data.type === "accept") {
        const {
          message,
          userAuth,
          newMessageNotify,
          usersAll,
          userRecipient,
          newChatUser,
          newChatRecipient,
        } = await AcceptFriendsFunction(data);
        if (message !== undefined) {
          io.to(socket.id).emit("errorHandlerAcceptFriends", message);
        } else {
          io.to(socket.id).emit(`newMessageUser${userAuth.id}`, newChatUser);
          io.emit(`newMessageNotify`, newMessageNotify);
          io.emit(`allUsers${userRecipient.id}`, usersAll.reverse());
          io.emit(`userInfo${userRecipient.id}`, userRecipient);
          io.emit(`newMessageUser${userRecipient.id}`, newChatRecipient);
        }
        //отклонение заявки если это входящая заявка
      } else if (data.type === "hidden") {
        const { message, user } = await HiddenFriendsFunction(data);
        if (message !== undefined) {
          io.to(socket.id).emit("errorHandlerHiddenFriends", message);
        } else {
          io.to(socketId.socketId).emit(`userInfo${user.id}`, user);
          io.to(socket.id).emit(`clearHiddenFriends${user.id}`, []);
        }
        // отменить исходящую заявку
      } else if (data.type === "cancel") {
        const { message, finalResult } = await CancelFriendsFunction(data);
        if (message !== undefined) {
          io.to(socketId.socketId).emit("errorHandlerAddFriends", message);
        } else {
          io.emit(`friendsNotify`, finalResult.allFriendsNotify);
          io.to(socketId.socketId).emit(
            `userInfo${finalResult.user.id}`,
            finalResult.user,
          );
          io.emit(
            `userInfo${finalResult.userRecipient.id}`,
            finalResult.userRecipient,
          );
          io.to(socket.id).emit(`clearDeleteFriends${finalResult.user.id}`, []);
        }
      }
    });

    // получение списка всех чатв и сообщенийтекущего пользователя
    socket.on("messagesUser", async (data) => {
      const socketId = { socketId: socket.id };
      const { message, messageForUser, userAuth } =
        await AllMessagesUserFunction(data);
      if (message !== undefined) {
        io.to(socketId.socketId).emit("errorHandlerMessagesUser", message);
      } else {
        io.to(socketId.socketId).emit(
          `allMessagesUsers${userAuth.id}`,
          messageForUser,
        );
      }
    });

    // отправка сообщения
    socket.on("sendMessageTouUser", async (data) => {
      const socketId = { socketId: socket.id };
      const { messageError, messageForUser, messageForRecipient, newNotify } =
        await SendMessageTouUser(data);
      if (messageError !== undefined) {
        io.to(socketId.socketId).emit(
          "errorHandlerSendMessageTouUser",
          messageError,
        );
      } else {
        io.emit(`newMessageNotify`, newNotify);
        io.to(socketId.socketId).emit(
          `newMessageUser${messageForUser.userId}`,
          messageForUser,
        );
        io.emit(`newMessageUser${data.recipientId}`, messageForRecipient);
      }
    });

    // удаление сообщения
    socket.on("deleteMessage", async (data) => {
      const { messageerror, resultRecipient, resultUser } =
        await DeleteMessageFunction(data);
      if (messageerror !== undefined) {
        io.to(socket.id).emit("errorHandlerDeleteMessage", messageerror);
      } else {
        io.emit(`allMessagesUsers${data.isDelete[0].userId}`, resultUser);
        io.emit(
          `allMessagesUsers${data.isDelete[0].recipientId}`,
          resultRecipient,
        );
      }
    });

    // действия в сообщениях
    socket.on("actionMessage", async (data) => {
      // заблокировать пользователя
      if (data.type === "ActionsBlock") {
        const { message, user, userRecipient } =
          await ActionsBlockFunction(data);
        if (message !== undefined) {
          io.to(socket.id).emit("errorHandler", message);
        } else {
          io.emit(`userInfo${user.id}`, user);
          io.emit(`userInfo${userRecipient.id}`, userRecipient);
        }
        // очистить чат
      } else if (data.type === "ActionsClearChat") {
        const {
          message,
          resultUser,
          resultRecipient,
          userAuth,
          userRecipient,
        } = await ActionsClearChatFunction(data);
        if (message !== undefined) {
          io.to(socket.id).emit("errorHandler", message);
        } else {
          io.emit(`allMessagesUsers${userAuth.id}`, resultUser);
          io.emit(`allMessagesUsers${userRecipient.id}`, resultRecipient);
        }
      } else {
        // полностью удалить весь чат с пользователем
        const {
          message,
          resultUser,
          resultRecipient,
          userAuth,
          userRecipient,
        } = await ActionsDeleteDialogueFunction(data);
        if (message !== undefined) {
          io.to(socket.id).emit("errorHandler", message);
        } else {
          io.emit(`allMessagesUsers${userAuth.id}`, resultUser);
          io.emit(`allMessagesUsers${userRecipient.id}`, resultRecipient);
        }
      }
    });
    // жалоба на пользователя
    socket.on("saveComplaintsR", async (data) => {
      const { message, allUsers } = await SaveComplaintsFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorHandler", message);
      } else {
        await Promise.all(
          allUsers.map((us) => {
            const users = allUsers.filter((u) => u.id !== us.id);
            io.emit(`allUsers${us.id}`, users.reverse());
          }),
        );
      }
    });

    // принятие политики общего чата
    socket.on("policyGeneralChat", async (data) => {
      const socketId = { socketId: socket.id };
      const { message, user } = await PolicyChatFunction(data);
      if (message !== undefined) {
        io.to(socketId.socketId).emit("errorHandlerUserInfo", message);
      } else {
        io.to(socketId.socketId).emit(`userInfo${user.id}`, user);
      }
    });

    // получение списка всех сообщений общего чата
    socket.on("generalChatInfo", async (data) => {
      const { message, getGeneralCatMessage } = await GeneralChatFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorHandlerGeneralChat", message);
      } else {
        io.emit("generalChat", getGeneralCatMessage);
      }
    });

    // отправка ссобщений в общий чат
    socket.on("sendGeneralChat", async (data) => {
      const { message, newMessages } = await SendGeneralChat(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorHandlerNewMessageGeneralChat", message);
      } else {
        io.emit("newMessageGeneralChat", newMessages);
      }
    });
    // добавление изображения в галерею
    socket.on("saveImageToMyGallery", async (data) => {
      const { message, allUsers, user } =
        await SaveImageToMyGalleryFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorHandlerSaveImageToMyGallery", message);
      } else {
        io.emit(`userInfo${user.id}`, user);
        await Promise.all(
          allUsers.reverse().map((us) => {
            const users = allUsers.filter((u) => u.id !== us.id);
            io.emit(`allUsers${us.id}`, users.reverse());
          }),
        );
      }
    });

    // установить на аватар изображение из галереи
    socket.on("installAvatar", async (data) => {
      const { message, allUsers, user } = await InstallAvatarFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorHandlerInstallAvatar", message);
      } else {
        io.emit(`userInfo${user.id}`, user);
        await Promise.all(
          allUsers.reverse().map((us) => {
            const users = allUsers.filter((u) => u.id !== us.id);
            io.emit(`allUsers${us.id}`, users.reverse());
          }),
        );
      }
    });

    // лайк дилайк фото в галереи
    socket.on("like", async (data) => {
      if (data.type === "like") {
        const { message, allUsers, user, updatedGalleryRecipient } =
          await IsLikeFunction(data);
        if (message !== undefined) {
          io.to(socket.id).emit("errorHandlerLike", message);
        } else {
          io.emit(`userInfo${user.id}`, user);
          io.emit(
            `userInfo${updatedGalleryRecipient.id}`,
            updatedGalleryRecipient,
          );
          await Promise.all(
            allUsers.reverse().map((us) => {
              const users = allUsers.filter((u) => u.id !== us.id);
              io.emit(`allUsers${us.id}`, users.reverse());
            }),
          );
        }
      } else if (data.type === "unLike") {
        const { message, allUsers, user, updatedGallery } =
          await IsUnLikeFunction(data);
        if (message !== undefined) {
          io.to(socket.id).emit("errorHandlerUnLike", message);
        } else {
          io.emit(`userInfo${user.id}`, user);
          io.emit(`userInfo${updatedGallery.id}`, updatedGallery);
          await Promise.all(
            allUsers.reverse().map((us) => {
              const users = allUsers.filter((u) => u.id !== us.id);
              io.emit(`allUsers${us.id}`, users.reverse());
            }),
          );
        }
      }
    });

    //удаление аватара
    socket.on("deleteAvatar", async (data) => {
      const { message, user, allUsers } = await DeleteAvatarFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorHandlerDeleteAvatar", message);
      } else {
        io.emit(`userInfo${user.id}`, user);
        await Promise.all(
          allUsers.reverse().map((us) => {
            const users = allUsers.filter((u) => u.id !== us.id);
            io.emit(`allUsers${us.id}`, users.reverse());
          }),
        );
      }
    });

    // написание коментария или ответа к фото
    socket.on("commentCreate", async (data) => {
      // коментарий
      if (data.type === "comment") {
        const { message, user, allUsers, recipientUpdate } =
          await CommentCreateFunction(data);
        if (message !== undefined) {
          io.to(socket.id).emit("errorHandlerCommentCreate", message);
        } else {
          io.emit(`userInfo${user.id}`, user);
          io.emit(`userInfo${recipientUpdate.id}`, recipientUpdate);
          await Promise.all(
            allUsers.reverse().map((us) => {
              const users = allUsers.filter((u) => u.id !== us.id);
              io.emit(`allUsers${us.id}`, users.reverse());
            }),
          );
        }
        // ответ на коментарий
      } else if (data.type === "replies") {
        const { message, user, recipient, resultUpdsteComments } =
          await CommentCreateRepliesFunction(data);
        if (message !== undefined) {
          io.to(socket.id).emit("errorHandlerReplies", message);
        } else {
          io.emit(`userInfo${user.id}`, user);
          io.emit(`userInfo${recipient.id}`, recipient);
          await Promise.all(
            resultUpdsteComments.reverse().map((us) => {
              const users = resultUpdsteComments.filter((u) => u.id !== us.id);
              io.emit(`allUsers${us.id}`, users.reverse());
            }),
          );
        }
      }
    });

    // получение списка всех рандеву
    socket.on("allRendezvous", async (data) => {
      const socketId = { socketId: socket.id };
      const { message, rendezvous, rendezvousHistory, userAuth } =
        await AllRendezvousFunction(data);
      if (message !== undefined) {
        io.to(socketId.socketId).emit("errorHandlerAllRendezvous", message);
      } else {
        io.to(socketId.socketId).emit(`toggleSendRendezvous${userAuth.id}`, []);
        io.to(socketId.socketId).emit(
          `allRendezvousResponse${userAuth.id}`,
          rendezvous,
        );
        io.to(socketId.socketId).emit(
          `allRendezvousHistoryResponse${userAuth.id}`,
          rendezvousHistory,
        );
        io.emit(`toggleCancelRendezvous${userAuth.id}`, []);
        io.emit(`toggleAcceptRendezvous${userAuth.id}`, null);
      }
    });

    socket.on("rendezvousReplies", async (data) => {
      // принять входящее рандеву
      if (data.type === "Accept") {
        const {
          message,
          newMessageNotify,
          newChatRecipient,
          newChatUser,
          user,
          userRecipient,
          rendezvousHistoryFromRecipient,
          usersAll,
          users,
        } = await RendezvousAcceptFunction(data);
        if (message !== undefined) {
          io.to(socket.id).emit("errorHandlerAccept", message);
        } else {
          io.emit(
            `allRendezvousHistoryResponse${userRecipient.id}`,
            rendezvousHistoryFromRecipient,
          );
          io.emit(`newMessageNotify`, newMessageNotify);
          io.to(socket.id).emit(`newMessageUser${user.id}`, newChatUser);
          io.emit(`newMessageUser${userRecipient.id}`, newChatRecipient);
          io.to(socket.id).emit(`userInfo${user.id}`, user);
          io.emit(`userInfo${userRecipient.id}`, userRecipient);
          io.to(socket.id).emit(`allUsers${user.id}`, users.reverse());
          io.emit(`allUsers${userRecipient.id}`, usersAll.reverse());
        }
      } else if (data.type === "SEND") {
        // откликнуться на рандеву
        const {
          message,
          createHistoryFromUser,
          createHistoryFromRecipient,
          updateNewArrRendezvousFromUser,
          newArrAllRendezvousNotify,
          userAuth,
          recipient,
        } = await RendezvousSendFunction(data);
        if (message !== undefined) {
          io.to(socket.id).emit("errorHandlerSend", message);
        } else {
          const rendezvous = await FilterRendezvousFunction(
            updateNewArrRendezvousFromUser,
            userAuth,
          );
          io.emit("rendezvousNotify", newArrAllRendezvousNotify);
          io.to(socket.id).emit(
            `allRendezvousResponse${userAuth.id}`,
            rendezvous,
          );
          createHistoryFromRecipient.map((item) => {
            const r = recipient.find((us) => us.id === item.recipientId);
            io.emit(`addToHistory${r.id}`, item);
          });
          createHistoryFromUser.map((item) => {
            io.emit(`addToHistory${userAuth.id}`, item);
          });
          io.emit(`toggleSendRendezvous${userAuth.id}`, []);
        }
      } else if (data.type === "cancelHistory") {
        // отмена рандеву и добавление его в историю и отправка уведомлений об отмене ползователю
        const {
          message,
          userAuth,
          newMessageNotify,
          recipientUser,
          newChatRecipient,
          newChatUser,
          updateNewArrRendezvousHistory,
        } = await CancelRendezvousHistoryFunction(data);
        if (message !== undefined) {
          io.to(socket.id).emit("errorHandlerCancelHistory", message);
        } else {
          io.emit(`newMessageNotify`, newMessageNotify);
          io.emit(`newMessageUser${userAuth.id}`, newChatUser);
          io.emit(`newMessageUser${recipientUser.id}`, newChatRecipient);
          io.emit(
            `allRendezvousHistoryResponse${recipientUser.id}`,
            updateNewArrRendezvousHistory,
          );
        }
      } else if (data.type === "HIDDEN") {
        //скрыть рандеву
        const { message, rendezvous, userAuth } =
          await RendezvousHiddenFunction(data);
        if (message !== undefined) {
          io.to(socket.id).emit("errorHandlerHidden", message);
        } else {
          io.to(socket.id).emit(
            `allRendezvousResponse${userAuth.id}`,
            rendezvous,
          );
          io.emit(`toggleHiddenRendezvous${userAuth.id}`, []);
        }
      } else if (data.type === "HIDDEN-HISTORY") {
        // скрыть рандеву в истории
        const { message, result, userAuth } =
          await RendezvousHistoryDeleteFunction(data);
        if (message !== undefined) {
          io.to(socket.id).emit("errorHandlerHiddenHistory", message);
        } else {
          io.emit(`allRendezvousHistoryResponse${userAuth.id}`, result);
          io.emit(`toggleHiddenHistoryRendezvous${userAuth.id}`, []);
        }
      }
    });

    // получение моего текущего рандеву
    socket.on("myRendezvousInfo", async (data) => {
      const { message, myRendezvous, userAuth } =
        await MyRendezvousInfoFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorHandlerRendezvousCreate", message);
      } else {
        io.to(socket.id).emit(
          `myRendezvousSuccess${userAuth.id}`,
          myRendezvous,
        );
      }
    });

    // удаление моего рандеву и установка ограничеия на 24 часа
    socket.on("rendezvousDelete", async (data) => {
      const socketId = { socketId: socket.id };
      const { message, rendezvous, user, alUsers, updateMyRendezvous } =
        await RendezvousDeleteFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorHandlerRendezvousDelete", message);
      } else {
        io.to(socketId.socketId).emit(`userInfo${user.id}`, user);
        io.to(socket.id).emit(
          `myRendezvousSuccess${user.id}`,
          updateMyRendezvous,
        );
        await Promise.all(
          alUsers
            .filter((us) => us.id !== user.id)
            .map(async (us) => {
              const rendezvousArr = await FilterRendezvousFunction(
                rendezvous,
                us,
              );
              io.emit(`allRendezvousResponse${us.id}`, rendezvousArr);
            }),
        );
      }
    });

    //создание рандеву
    socket.on("rendezvousCreate", async (data) => {
      const { message, newRendezvous } = await RendezvousCreateFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorHandlerRendezvousCreate", message);
      } else {
        io.emit(`newRendezvous`, newRendezvous);
        io.to(socket.id).emit(
          `myRendezvousSuccess${newRendezvous.userId}`,
          newRendezvous,
        );
      }
    });

    // подарить подписку
    socket.on("giveASubscriptionSend", async (data) => {
      const {
        message,
        allUsersFromUser,
        allUsersFromRecipient,
        newChatRecipient,
        newChatUser,
        newFriends,
        newMessageNotify,
        updateUser,
        updateRecipient,
        newArrAllUsers,
        updateArrUser,
      } = await GiveASubscriptionFunction(data);
      if (message !== undefined) {
        io.to(socket.id).emit("errorGiveASubscription", message);
      } else {
        io.emit(`newMessageNotify`, newMessageNotify);
        io.emit(`friendsNotify`, newFriends);
        io.emit(`newMessageUser${updateUser.id}`, newChatUser);
        io.emit(`userInfo${updateUser.id}`, updateUser);
        io.emit(`allUsers${updateUser.id}`, allUsersFromUser.reverse());
        io.emit(`newMessageUser${updateRecipient.id}`, newChatRecipient);
        io.emit(`userInfo${updateRecipient.id}`, updateRecipient);
        io.emit(
          `allUsers${updateRecipient.id}`,
          allUsersFromRecipient.reverse(),
        );
        newArrAllUsers.map((us) => {
          const users = updateArrUser.filter((u) => u.id !== us.id);
          io.emit(`allUsers${us.id}`, users.reverse());
        });
      }
    });

    // обновление пароля
    socket.on("passwordUpdate", async (data) => {
      const socketId = { socketId: socket.id };
      const { message } = await ChangePasswordFunction(data);
      io.to(socketId.socketId).emit("passwordUpdateInfo", message);
    });
    // сброс пароля
    socket.on("passwordReset", async (data) => {
      const socketId = { socketId: socket.id };
      const { message, access_token, email } =
        await ResetPasswordFunction(data);
      if (message !== undefined) {
        io.to(socketId.socketId).emit("errorPasswordReset", message);
      } else {
        const result = { access_token, email };
        io.to(socketId.socketId).emit("loginResponse", result);
      }
    });
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  SocketServer,
};
