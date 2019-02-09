/* eslint-env jasmine */
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

  // /books/ は、登録されている書籍の一覧を取得
  describe('#get_contents', () => {
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

  // /books/create では、1件新規に書籍情報を登録する
  describe('#validate', () => {
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

  // /books/update/:id で指定された書籍の情報を更新する
  describe('#update', () => {
    it('should number of book eq 1 when updating a book', (done) => {
      req.body.book_title = '編集タイトル';
      book._update_book(req.body).then(result => {
        expect(result.length).toBe(1);
        expect(result[0]).toBe(1);
        done();
      }).catch(done.fail);
    });
  });

  // /books/destroy/:id で指定された書籍を削除する
  describe('#remove_book', () => {
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
});