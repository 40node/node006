#!/usr/bin/env node

const bcrypt = require('bcrypt');

if (process.argv.length > 2) {
  bcrypt.genSalt(10, (err, salt) => {
    const password = process.argv[2];
    console.log('salt = ' + salt);
    console.log('pass = ' + bcrypt.hashSync(password, salt));
  });
}
