const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  // counter = readCounter(callback);

  // counter = counter + 1;
  // writeCounter(counter, callback);
  // readCounter(callback);
  // return counter;
  //console.log(readCounter(callback));
  readCounter((err, counter) => {
    // console.log('the type is ' + typeof counter);
    if (err) {
      writeCounter(0, callback);
      // console.log('The count is ', counter);
      // console.log("err!");
    } else {
      counter ++;
      // console.log('the count is ', counter);
      writeCounter(counter, callback);
    }
  });
  // counter ++;
  // console.log(counter);
  // console.log("*****");
  // return zeroPaddedNumber(counter);
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
//console.log(exports.counterFile);