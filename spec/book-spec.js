const book  = require('../controllers/book');
const model = require('../models');

describe ('#bookProvider', () => {
    describe ('#create', () => {
        it ('本を一つ登録する', () => {
            expect(book.create({book_title: 'test#1'})).toBe(true);
        });
    });
});