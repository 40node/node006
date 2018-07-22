const models = require('../models');

convert_parameter = (req) => {
    return req.params;
}

exports.create = (req) => {
    book = convert_parameter(req);

    if (book.book_title === '' || book.book_title === undefined) {
        return Promise.reject('Parameter Error');
    }
    if (book.image_url === '' || book.image_url === undefined) {
        book.image_url = 'http://example.com/';
    }
    return models.Library.create(book);
};