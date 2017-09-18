var app, appendMessage, callbacks, express;

express = require("express");

callbacks = [];

appendMessage = function(message) {
  var resp, results;
  resp = {
    messages: [message]
  };
  results = [];
  while (callbacks.length > 0) {
    results.push(callbacks.shift()(resp));
  }
  return results;
};

app = module.exports = express.createServer();

app.use(express.bodyParser());

app.get("/", function(req, res) {
  return res.sendfile("index.html");
});

app.post("/send", function(req, res) {
  var message;
  message = {
    nickname: req.param("nickname", "Anonymous"),
    text: req.param("text", "")
  };
  appendMessage(message);
  return res.json({
    status: "ok"
  });
});

app.get("/recv", function(req, res) {
  return callbacks.push(function(message) {
    return res.json(message);
  });
});

app.listen(process.env.PORT);
