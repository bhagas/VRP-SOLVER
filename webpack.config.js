const path = require('path');

module.exports = {
  entry: './logic.js',
  output: {
    filename: 'solver.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode:'production'
};