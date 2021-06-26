# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.1.3](https://github.com/mokkapps/changelog-generator-demo/compare/v2.1.2...v2.1.3) (2021-06-26)


### Features

* add mutally exclusive version of the archive group query ([ca45731](https://github.com/mokkapps/changelog-generator-demo/commits/ca45731ec8c155816a5adfd279e9006417739598))


### Bug Fixes

* get all group information when archiving a group ([52bcc28](https://github.com/mokkapps/changelog-generator-demo/commits/52bcc28f84a3cac2ccfc58d59f25c081454cd843))
* prevent race conditions when archiving a group for the move items action ([83daaa7](https://github.com/mokkapps/changelog-generator-demo/commits/83daaa73c116a4a120c48a7ff052c63bd8d102cf))
* use mutex function when creating a group in a board ([7d35e42](https://github.com/mokkapps/changelog-generator-demo/commits/7d35e4258aedbe20e0eb1e4d141805b3efc75218))

### [2.1.2](https://github.com/mokkapps/changelog-generator-demo/compare/v2.1.1...v2.1.2) (2021-06-25)


### Bug Fixes

* added critical section around to avoid multiple groups being created ([5e8efde](https://github.com/mokkapps/changelog-generator-demo/commits/5e8efde75b66e08957d168251569810d2b41ddff))
* check for null values when creating columns in a new board ([af31494](https://github.com/mokkapps/changelog-generator-demo/commits/af31494e547c327eae42c1fbe42ba5a6d4b199d8))
* reuse an existing group if avaliable when creating content on the editor board ([3055745](https://github.com/mokkapps/changelog-generator-demo/commits/3055745986aa45abeefd990472e6b9224c59d959))

### [2.1.1](https://github.com/mokkapps/changelog-generator-demo/compare/v2.1.0...v2.1.1) (2021-06-24)


### Bug Fixes

* copy numeric columns when creating an item in another board ([de9e370](https://github.com/mokkapps/changelog-generator-demo/commits/de9e3703391e2d43552cfcd8f09186567b076740))

## [2.1.0](https://github.com/mokkapps/changelog-generator-demo/compare/v2.0.0...v2.1.0) (2021-06-23)


### Features

* add /monday/copy_podcast_item endpoint for processing episodes that require podcasts ([55873d6](https://github.com/mokkapps/changelog-generator-demo/commits/55873d6c0a884c5fa9f5aed0b0e3ed4ff52254f7))
* add query to get the names of items in a group on a board ([0c70be4](https://github.com/mokkapps/changelog-generator-demo/commits/0c70be48d2b1c0d1b0a3acb28be0912b3f75ef64))
* add service object to determine if a row with the same name appears in a group ([982ef86](https://github.com/mokkapps/changelog-generator-demo/commits/982ef8611c3d6a8175aa56fd4a02420c2debc9e1))
* add service object to determine if an episode requires a podcast ([98bcee0](https://github.com/mokkapps/changelog-generator-demo/commits/98bcee0aba98db6c08124c5928239b8ea5b8ec74))
* get group position as number when quering monday api ([9bb9770](https://github.com/mokkapps/changelog-generator-demo/commits/9bb97706d03435a6ec6925225af675475300c90a))
* report errors to Sentry.io ([9a89b17](https://github.com/mokkapps/changelog-generator-demo/commits/9a89b176fb55423c4f10ec5c0823d11aaa24f503))


### Bug Fixes

* update dev script ([756a306](https://github.com/mokkapps/changelog-generator-demo/commits/756a3062d0f3591807d991896ee605ea697fe573))

## [2.0.0](https://github.com/mokkapps/changelog-generator-demo/compare/v1.4.0...v2.0.0) (2021-06-22)


### Features

* remove depricated endpoint /monday/execute_action ([08e8f3d](https://github.com/mokkapps/changelog-generator-demo/commits/08e8f3d003708fad9b4c8bf42bf5b893784207ab))

## 1.4.0 (2021-06-22)
