export const srvStub = `
const { json } = require('express');

module.export = (app) => {
  app.use(json());

  app.get('/foo', (req, res) => {
    res.json({ msg: 'foo' });
  });

  app.post('/bar', (req, res) => {
    res.json(req.body);
  });
};
`
