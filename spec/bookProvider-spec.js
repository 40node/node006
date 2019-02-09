/* eslint-env jasmine */

// bookProvider.js テスト対象をRewireで読み込む
// const rewire = require('rewire');
const bookProvider = require('../controllers/bookProvider');

describe('#bookProvider', () => {
  let req, book;
  // 毎回、利用する変数の初期化
  beforeEach(() => {
    req = {
      // req.body には、フォームからのインプット情報が含まれる
      body: {
        book_title: 'title',
        author: 'しょっさん',
        publisher: 'USP研究所',
        image_uml: ''
      },
      user: {
        id: 1,
        email: 'tak@oshiire.to'
      },
      // req.params には、URI で指定したパラメータ情報が含まれる
      params: {
        id: 1
      }
    };
    book = new bookProvider(req.user.id);
  });

  // /books/:id では指定された一つの書籍および付随するコメントを取得
  describe('#read_content', () => {
    //    const get_book = book.__get__('get_book'); // rewire

    it('should get content with id eq 1', (done) => {
      book._get_book(1)
        .then(result => {
          expect(result.id).toBe(1);
          // id = 1 の書籍は 3件のコメントがあるはず
          expect(result.Comments.length).toBe(3);
          done();
        }).catch(done.fail);
    });
    it('should get null', (done) => {
      book._get_book(null)
        .then(result => {
          // 対象がない場合、NULL が返ってくることを期待する
          expect(result).toBeNull();
          done();
        }).catch(done.fail);
    });
  });
  /*
  describe('#find', () => {
    it('should see content with id eq 1', (done) => {
      res.json = (result => {
        expect(result.user_id).toEqual(1);
        done();
      });
      book.find(req, res);
    });
    it('should view an error page', (done) => {
      // 対象の本がない場合には、エラー画面が返ってくることを期待する
      req.params.id = null;
      res.json = (result => {
        expect(result).toEqual({});
        done();
      });
      book.find(req, res);
    });
  });
  */

  // /books/ は、登録されている書籍の一覧を取得
  describe('#get_contents', () => {
    // const get_contents = book.__get__('get_contents');
    // すべてのテストが非同期並列実行されるため、厳密な冊数を指定できない
    it('should get two or more contents', (done) => {
      book._get_contents(req.user.id)
        .then(results => {
          // 少なくとも 2冊は登録されている
          expect(results.length).toBeGreaterThanOrEqual(2);
          expect(results[0].id).toBe(1);
          expect(results[0].cnt).toBe(3);
          expect(results[1].id).toBe(2);
          done();
        }).catch(done.fail);
    });
  });
  /*
  describe('#view', () => {
    it('should list two or more books', (done) => {
      // 同様にモックを準備する
      res.json = (result => {
        expect(result[0].id).toBe(1);
        expect(result[1].author).toBe('しょっさん');
        done();
        return this;
      });
      // モック設定後に関数をコール
      book.view(req, res);
    });
  });
  */

  // /books/create では、1件新規に書籍情報を登録する
  describe('#validate', () => {
    // const validate = book.__get__('validate');
    // 検証された結果
    it('should get the result is true', () => {
      const result = book._validate(req.body);
      expect(result).toBe(true);
      expect(req.body.image_url).toBe('http://example.com/');
    });
    // 書籍にはタイトルが必須という要件のテスト
    it('should get the result is false', () => {
      req.body.book_title = '';
      const result = book._validate(req.body);
      expect(result).toBe(false);
      expect(req.body.errors).toEqual([{ message: '本のタイトルが入っていません' }]);
    });
  });
  describe('#register_book', () => {
    //const register_book = book.__get__('register_book');
    // 本を登録できると、登録された内容が確認できる
    it('should get the result is book information', (done) => {
      req.body.user_id = 1;
      book._register_book(req.body).then(result => {
        expect(result.book_title).toBe('title');
        expect(result.id).toBeGreaterThanOrEqual(2);
        expect(result.image_url).toBe('http://example.com/');
        done();
      }).catch(done.fail);
    });
    // 本のタイトルがなければ登録できません
    it('should catch an error', (done) => {
      req.body.book_title = '';
      book._register_book(req.body).then(done.fail)
        .catch(result => {
          expect(result).toEqual([{ message: '本のタイトルが入っていません' }]);
          done();
        });
    });
  });
  describe('#port', () => {
    // request されたポート番号が設定されている場合はそれらを返す
    it('should get a 3,000 of a port number', () => {
      expect(book._set_port(3000)).toEqual(':3000');
    });
    it('should never get any port number', () => {
      expect(book._set_port(80)).toEqual('');
      expect(book._set_port(443)).toEqual('');
    });
  });
  /*
  describe('#create', () => {
    it('should redirect description of the book', (done) => {
      res.location = (result => {
        expect(result).toMatch(/^\/books\/[0-9]+$/);
        done();
        return this;
      });
      book.create(req, res);
    });
    it('should view an error page', (done) => {
      req.body.book_title = '';
      res.json = (result => {
        expect(result.message).toBe('エラーが発生しました.');
        expect(result.error.status).toBe('本を登録できませんでした.');
        done();
        return this;
      });
      book.create(req, res);
    });
  });
  */

  // /books/update/:id で指定された書籍の情報を更新する
  describe('#update', () => {
    //const update_book = book.__get__('update_book');
    it('should number of book eq 1 when updating a book', (done) => {
      req.body.book_title = '編集タイトル';
      book._update_book(req.body).then(result => {
        expect(result.length).toBe(1);
        expect(result[0]).toBe(1);
        done();
      }).catch(done.fail);
    });
    /*
    it('should redirect to description of the book', (done) => {
      res.location = (result) => {
        expect(result).toMatch(/^\/books\/1/);
        done();
        return this;
      };
      book.update(req, res);
    });
    */
  });

  // /books/destroy/:id で指定された書籍を削除する
  describe('#remove_book', () => {
    // const register_book = book.__get__('register_book');
    // const remove_book = book.__get__('remove_book');
    it('should number of book eq 1 after it removes a book', (done) => {
      req.body.user_id = 1;

      book._register_book(req.body).then(result => {
        book._remove_book(result.id).then(num => {
          expect(num).toBe(1);
          done();
        }).catch(done.fail);
      }).catch(done.fail);
    });
    it('should get an error if it remove a book having comments', (done) => {
      book._remove_book(1).then(done.fail)
        .catch(result => {
          expect(result.name).toBe('SequelizeForeignKeyConstraintError');
          done();
        });
    });
  });
  /*
  describe('#destroy', () => {
    const register_book = book.__get__('register_book');

    it('should redirect the view page after it removes the book', (done) => {
      req.body.user_id = 1;
      register_book(req.body).then(result => {
        req.params.id = result.id;
        res.status = (status) => {
          expect(status).toBe(204);
          done();
        };
        book.destroy(req, res);
      });
    });
    it('should view an error page', (done) => {
      res.json = (result => {
        expect(result.message).toBe('エラーが発生しました.');
        expect(result.error.status).toBe('本を削除できませんでした.');
        done();
        return this;
      });
      book.destroy(req, res);
    });
  });
  */
});