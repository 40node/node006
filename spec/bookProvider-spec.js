/* eslint-env jasmine */

// bookProvider.js テスト対象を読み込む
const book = require('../controllers/bookProvider');

describe('#bookProvider', () => {
  let req, res;

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
      // req.params には、URI で指定したパラメータ情報が含まれる
      params: {
        id: 1
      }
    };
    // res.* は、モックとして利用する関数を仮定義しておく
    res = {
      redirect: function () { },
      render: function () { }
    };
  });

  // /books/:id では指定された一つの書籍および付随するコメントを取得
  describe('#read_content', () => {
    it('should get content with id eq 1', (done) => {
      book.get_book(1)
        .then(result => {
          expect(result.id).toBe(1);
          // id = 1 の書籍は 3件のコメントがあるはず
          expect(result.Comments.length).toBe(3);
          done();
        }).catch(done.fail);
    });
    it('should get null', (done) => {
      book.get_book(null)
        .then(result => {
          // 対象がない場合、NULL が返ってくることを期待する
          expect(result).toBeNull();
          done();
        }).catch(done.fail);
    });
  });
  describe('#find', () => {
    it('should see content with id eq 1', (done) => {
      // res.render 用のモックを準備し、期待する返り値を設定する
      res.render = (view, stacks) => {
        expect(view).toBe('description');
        expect(stacks.book.author).toBe('しょっさん');
        done();
      };
      // モック設定後に、対象の関数をコールする
      book.find(req, res);
    });
  });

  // /books/ は、登録されている書籍の一覧を取得
  describe('#get_contents', () => {
    // すべてのテストが非同期並列実行されるため、厳密な冊数を指定できない
    it('should get two or more contents', (done) => {
      book.get_contents()
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
  describe('#view', () => {
    it('should list two or more books', (done) => {
      // 同様にモックを準備する
      res.render = (view, stacks) => {
        expect(view).toBe('view');
        expect(stacks.books[0].id).toBe(1);
        expect(stacks.books[1].author).toBe('しょっさん');
        done();
      };
      // モック設定後に関数をコール
      book.view(req, res);
    });
  });

  // /books/create では、1件新規に書籍情報を登録する
  describe('#validate', () => {
    // 検証された結果
    it('should get the result is true', () => {
      const result = book.validate(req.body);
      expect(result).toBe(true);
      expect(req.body.image_url).toBe('http://example.com/');
    });
  });
  describe('when some parameter is wrong', () => {
    // 書籍にはタイトルが必須という要件のテスト
    it('should get the result is false', () => {
      req.body.book_title = '';
      const result = book.validate(req.body);
      expect(result).toBe(false);
      expect(req.body.errors).toEqual(['本のタイトルが入っていません']);
    });
  });
  describe('#register_book', () => {
    // 本を登録できると、登録された内容が確認できる
    it('should get the result is book information', (done) => {
      book.register_book(req.body).then(result => {
        expect(result.book_title).toBe('title');
        expect(result.id).toBeGreaterThanOrEqual(2);
        expect(result.image_url).toBe('http://example.com/');
        done();
      }).catch(done.fail);
    });
    // 本のタイトルがなければ登録できません
    it('should catch an error', (done) => {
      req.body.book_title = '';
      book.register_book(req.body).then(done.fail)
        .catch(result => {
          expect(result).toEqual(['本のタイトルが入っていません']);
          done();
        });
    });
  });
  describe('#create', () => {
    it('should redirect description of the book', (done) => {
      res.redirect = (uri) => {
        expect(uri).toMatch(/^\/books\/[0-9]+$/);
        done();
      };
      book.create(req, res);
    });
    it('should view an error page', (done) => {
      req.body.book_title = '';
      res.render = (view, stacks) => {
        expect(view).toBe('error');
        expect(stacks.message).toBe('エラーが発生しました.');
        done();
      };
      book.create(req, res);
    });
  });

  // /books/update/:id で指定された書籍の情報を更新する
  describe('#update', () => {
    it('should number of book eq 1 when updating a book', (done) => {
      req.body.book_title = '編集タイトル';
      book.update_book(req.params.id, req.body).then(result => {
        expect(result.length).toBe(1);
        expect(result[0]).toBe(1);
        done();
      }).catch(done.fail);
    });
    it('should redirect to description of the book', (done) => {
      res.redirect = (uri) => {
        expect(uri).toMatch(/^\/books\/[0-9]+$/);
        done();
      };
      book.update(req, res);
    });
  });

  // /books/destroy/:id で指定された書籍を削除する
  describe('#remove_book', () => {
    it('should number of book eq 1 after it removes a book', (done) => {
      book.register_book(req.body).then(result => {
        book.remove_book(result.id).then(num => {
          expect(num).toBe(1);
          done();
        }).catch(done.fail);
      }).catch(done.fail);
    });
    it('should get an error if it remove a book having comments', (done) => {
      book.remove_book(1).then(done.fail)
        .catch(result => {
          expect(result.name).toBe('SequelizeForeignKeyConstraintError');
          done();
        });
    });
  });
  describe('#destroy', () => {
    it('should redirect the view page after it removes the book', (done) => {
      book.register_book(req.body).then(result => {
        req.params.id = result.id;
        res.redirect = (uri) => {
          expect(uri).toBe('/books/');
          done();
        };
        book.destroy(req, res);
      });
    });
    it('should view an error page', (done) => {
      res.render = (view, stacks) => {
        expect(view).toBe('error');
        expect(stacks.message).toBe('エラーが発生しました.');
        done();
      };
      book.destroy(req, res);
    });
  });
});