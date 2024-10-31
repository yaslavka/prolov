# ProLove Social

<img src="Logotype.png" width="100%" height="100%" />

[![yarn Version](http://img.shields.io/npm/v/react-native-audio-recorder-player.svg?style=flat-square)](https://npmjs.org/package/react-native-audio-recorder-player)
[![Downloads](http://img.shields.io/npm/dm/react-native-audio-recorder-player.svg?style=flat-square)](https://npmjs.org/package/react-native-audio-recorder-player)
[![CI](https://github.com/hyochan/react-native-audio-recorder-player/actions/workflows/ci.yml/badge.svg)](https://github.com/hyochan/react-native-audio-recorder-player/actions/workflows/ci.yml)
[![publish-package](https://github.com/hyochan/react-native-audio-recorder-player/actions/workflows/publish-package.yml/badge.svg)](https://github.com/hyochan/react-native-audio-recorder-player/actions/workflows/publish-package.yml)
![License](http://img.shields.io/npm/l/react-native-audio-recorder-player.svg?style=flat-square)
[![supports iOS](https://img.shields.io/badge/iOS-4630EB.svg?style=flat-square&logo=APPLE&labelColor=999999&logoColor=fff)](https://itunes.apple.com/app/apple-store/id982107779)
[![supports Android](https://img.shields.io/badge/Android-4630EB.svg?style=flat-square&logo=ANDROID&labelColor=A4C639&logoColor=fff)](https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![LICENSE](http://img.shields.io/npm/l/@react-native-seoul/masonry-list.svg?style=flat-square)](https://npmjs.org/package/@react-native-seoul/masonry-list)


## Preview

## Getting started Backend

`$ cd backend`

`$ yarn install`

`$ cd StartRedisUpdate`

`$ yarn install`


`.env указать занные базы данных и данные для подключения к редис в каждом .env`

все запросы выполняються чисто только по socket.io фронтенд должен будет отправлять все данные и получать данные только по сокету

вся информация будет храниться в редис после старта StartRedisUpdate вам нужно будет в основном работать только с массивами данных с базой данных минимальное взаимодействие
только если нужно обновить какое-то поле в базе или добавить новую запись
для сохранения фото и голосовых сообщений необходимо с фронта отправлять их в base64Ы
