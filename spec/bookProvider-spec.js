/* eslint-env jasmine */
const book = require('../controllers/bookProvider');

describe('#bookProvider', () => {
  let req;
  beforeEach(() => {
    req = {
      params: {
        book_title: 'title',
        author: 'しょっさん',
        publisher: 'USP研究所',
        image_uml: ''
      }
    };
  });

  describe('#find', () => {
    describe('#read_content', () => {
      it('ID=1 の本とコメントを入手する', (done) => {
        book.get_book(1)
          .then(result => {
            expect(result.id).toBe(1);
            done();
          }).catch(done.fail);
      });
    });
  });

  describe('#create', () => {
    describe('#validate()', () => {
      it('入力された値に問題がない', () => {
        const result = book.validate(req.params);
        expect(result).toBe(true);
        expect(req.params.image_url).toBe('http://example.com/');
      });
      it('タイトルが入っていない場合はエラーになる', () => {
        req.params.book_title = '';
        const result = book.validate(req.params);
        expect(result).toBe(false);
        expect(req.params.errors).toEqual(['本のタイトルが入っていません']);
      });
    });

    describe('#newOne', () => {
      it('本が登録できる', (done) => {
        book.newOne(req.params).then(result => {
          expect(result.book_title).toBe('title');
          expect(result.id).toBeGreaterThanOrEqual(2);
          expect(result.image_url).toBe('http://example.com/');
          done();
        }).catch(done.fail);
      });
      it('本のタイトルが未登録だと登録できない', (done) => {
        req.params.book_title = '';
        book.newOne(req.params).then(done.fail)
          .catch(result => {
            expect(result).toEqual(['本のタイトルが入っていません']);
            done();
          });
      });
    });
  });
});