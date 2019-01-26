# library_management
シェルスクリプトマガジン Vol.58 サンプルプログラム

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/30c351e173f44f8090422118462efe6a)](https://app.codacy.com/app/app107724887/node005?utm_source=github.com&utm_medium=referral&utm_content=40node/node005&utm_campaign=Badge_Grade_Dashboard)
[![CircleCI](https://circleci.com/gh/40node/library_management.svg?style=svg)](https://circleci.com/gh/40node/library_management)
[![Build Status](https://travis-ci.org/40node/library_management.svg?branch=master)](https://travis-ci.org/40node/library_management)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/40node/node005.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/40node/node005/alerts/)

## 前提条件

当サンプルプログラムは、次の環境での実行を確認しています。

 - node.js 10.13.0 / 11.2.0
 - sqlite3 v4.0.4 (ローカルで実行する場合に必要です)
 - postgresql v10.4 (本番環境としてローカルかHerokuで実行する場合に必要です)
 - macOS High Sierra 10.13.6
 - Heroku-18 Stack (Ubuntu 18.04)

## 当サンプルプログラムの使い方

### ローカルで実行する場合

1. git clone https://github.com/40node/node005.git
2. cd node005
3. npm install
4. npm run build
5. npm start
6. [ローカルホスト](http://localhost:3000/books/)へアクセス

### Heroku へデプロイする場合

1. git clone https://github.com/40node/node005.git
2. cd node005
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
