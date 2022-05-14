const express = require('express');
const app = express();

module.exports = {
  name: 'express',
  listener: 'ready',
  async run(client) {
    
    app.get('/', (req, res) => res.send('hi'))
    app.listen(5884);
    
  }
}