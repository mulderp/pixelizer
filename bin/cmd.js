#!/usr/bin/env node
var p = require('../');
var subarg = require('subarg');

var argv = subarg(process.argv.slice(2));

if (!argv.size) {
  argv.size = '300x300';
}

var size = argv.size.split('x');

p('./static', 'thumbs', {size: size});
