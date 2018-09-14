var express = require('express');
var app = express();
var port = process.env.PORT || 8000;
var fs = require('fs');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

//Get Homepage
app.get('/', function(req, res) {
    res.send("Home Page");
  })

//Get ALL Users
app.get('/users', function(req, res) {
    let storage = fs.readFileSync('./storage.json', "utf8");
    res.json(JSON.parse(storage));
  })

//Get USER by ID
app.get('/users/:id', function(req, res) {
    let storage = fs.readFileSync('./storage.json', "utf8");
    let data = JSON.parse(storage);
    let result = data.find(user => user.id === parseInt(req.params.id));
    if(result){
        res.json(result);
    } else{
        res.sendStatus(400);
    }
  })

// Create User
app.post('/users', function(req, res) {
  let storage = fs.readFileSync('./storage.json', "utf8");
  let data = JSON.parse(storage);
  let userCount = parseInt(data[0]) + 1;
  data.splice(0, 1, userCount);
  let obj = {
    id: userCount,
    name: req.body.name,
    email: req.body.email,
    state: req.body.state
  };
  data.push(obj);
  fs.writeFileSync('./storage.json', JSON.stringify(data));
  res.send(`Created User`);
});

//Update User
app.patch('/users/:id', function(req, res) {
    let storage = fs.readFileSync('./storage.json', "utf8");
    let data = JSON.parse(storage);
    let result = data.find(user => user.id === parseInt(req.params.id));
    if(result){
        let newobj = {
            id: parseInt(req.params.id),
            name: req.body.name,
            email: req.body.email,
            state: req.body.state
          };
        data.splice(result.id, 1, newobj);
        fs.writeFileSync('./storage.json', JSON.stringify(data));
        res.send(`Updated User`);
    } else{
        res.sendStatus(400);
    }
  });

// Delete User
app.delete('/users/:id', function(req, res) {
    let storage = fs.readFileSync('./storage.json', "utf8");
    let data = JSON.parse(storage);
    let result = data.find(user => user.id === parseInt(req.params.id));
    if(result){
        data.splice(result.id, 1);
        fs.writeFileSync('./storage.json', JSON.stringify(data));
        res.send(`Deleted User`);
    } else{
        res.sendStatus(400);
    }
  });

app.use(function(req, res) {
  res.sendStatus(404);
});

app.listen(port, function() {
  console.log('Listening on port', port);
});
