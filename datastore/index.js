const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // var id = counter.getNextUniqueId(/* need a callback argument*/);
  // items[id] = text;
  // callback(null, { id, text });

  // refactor create using error first callback pattern
  // in some form we need to call getNextUniqueID, with
  // some callback as an argument
  
  counter.getNextUniqueId((err, id) => {
    if (err) {
      throw ('error!');
    } else {
      items[id] = text;
      var dir = path.join(exports.dataDir, id + '.txt');   
      fs.writeFile(dir, text, (err) =>{
        if(err) {
          throw ('error creating file');
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
  // console.log('this is the id ', id);
  // items[id] = text;

  // var dir = path.join(exports.dataDir, id + '.txt');
  // console.log('this is the dir ', dir);

  // fs.writeFile(dir, text, (err) =>{

  //   if(err) {
  //     throw ('error creating file');
  //   } else {
  //     callback(null, { id, text });
  //   }
  // });

//-----------------------------------------------


  
};

exports.readAll = (callback) => {
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);
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
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
