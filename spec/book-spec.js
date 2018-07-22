const book  = require('../controllers/book');
// const model = require('../models');

describe ('#bookProvider', () => {
    let req;
    beforeEach(() => {
        req = {
            params: {
                book_title: 'title',
                author:     'しょっさん',
                publisher:  'USP研究所',
                isbn_10:    '',
                isbn_13:    '',
                image_uml:  ''
            }
        };
    });

    describe ('#create', () => {
        it ('本が登録できる', (done) => {
            book.create(req).then (result => {
                expect(result.book_title).toBe('title');
                expect(result.image_url).toBe('http://example.com/');
                done();
            });
        });
        it ('本のタイトルが未登録だと登録できない', (done) => {
            req.params.book_title = '';
            book.create(req).then()
            .catch (result => {
                expect(result).toBe('Parameter Error');
                done();
            });
        });
        it ('本のタイトルが undefined だと本が登録できない', (done) => {
            req.params.book_title = undefined;
            book.create(req).then()
            .catch (result => {
                expect(result).toBe('Parameter Error');
                done();
            });
        });        
    });
});