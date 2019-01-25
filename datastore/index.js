const Promise = require('bluebird');
const fs = require('fs');
Promise.promisifyAll(fs);
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      throw ('error!');
    } else {
      items[id] = text;
      var dir = path.join(exports.dataDir, id + '.txt');   
      fs.writeFile(dir, text, (err) =>{
        if (err) {
          throw ('error creating file');
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  fs.readdirAsync(exports.dataDir)
    .then(function(files) {
      var arr = _.map(files, (file) => {
        var id = file.split('.')[0]; 
        var currentPath = path.join(exports.dataDir, file);

        return fs.readFileAsync(currentPath)
          .then(function(words){
            var text = words.toString();
            return {id, text};
          });
      });
      Promise.all(arr).then(function(content){
        return callback(null, content);
      });
    });
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    fs.readdir(exports.dataDir, (err, files) => {
      files.forEach(file => {
        var str = file.split('.'); 
        if(str[0] === id) {
          var currentPath = path.join(exports.dataDir, file);  // join path for current file 
          fs.writeFile(currentPath, text, (err) => {
            if (err) {
              throw ('error writing counter');
            } else {
              callback(null, { id, text });
            }
          });          
        }
      });
    });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    fs.readdir(exports.dataDir, (err, files) => {
      files.forEach(file => {
        var str = file.split('.'); 
        if(str[0] === id) {
          var currentPath = path.join(exports.dataDir, file);
          fs.unlink(currentPath); 
          callback();
        }
      });
    });
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
