# library_management
シェルスクリプトマガジン Vol.59 サンプルプログラム

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/336194eac9d54b1abea23fda12544e74)](https://www.codacy.com/app/app107724887/node006?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=40node/node006&amp;utm_campaign=Badge_Grade)[![CircleCI](https://circleci.com/gh/40node/node006.svg?style=svg)](https://circleci.com/gh/40node/node006)[![Build Status](https://travis-ci.org/40node/node006.svg?branch=master)](https://travis-ci.org/40node/node006)[![Total alerts](https://img.shields.io/lgtm/alerts/g/40node/node006.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/40node/node006/alerts/)

## 前提条件

当サンプルプログラムは、次の環境での実行を確認しています。

 - node.js 10.15.1 / 11.9.0
 - sqlite3 v4.0.6 (ローカルで実行する場合に必要です)
 - postgresql v10.4 (本番環境としてローカルかHerokuで実行する場合に必要です)
 - macOS High Sierra 10.13.6
 - Heroku-18 Stack (Ubuntu 18.04)

## 当サンプルプログラムの使い方

### ローカルで実行する場合

1. git clone https://github.com/40node/node006.git
2. cd node006
3. npm install
4. npm run build
5. npm start
6. [ローカルホスト](http://localhost:3000/books/)へアクセス

### Heroku へデプロイする場合

1. git clone https://github.com/40node/node006.git
2. cd node006
3. heroku create
4. git push heroku master
5. heroku open

※ 直接 Herokuへデプロイする場合は、次の `Heroku Button` も利用できます

### Heroku Button

Heroku へ直接でプロイするには、次のボタンをクリックしてください。
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## 実行可能なコマンド

次の定義されたコマンドが実行可能です

### npm start

起動します

### npm run migrate

データベースのマイグレーションを実行します

### npm run seed

データベースへ、テストデータを準備します

### npm run build

マイグレーションとテストデータの準備を一括で実行します

### npm clean

データベース内のデータをクリアします
