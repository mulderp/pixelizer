var stream = require('stream');
var fs = require('fs');
var trumpet = require('trumpet');
var through = require('through');
var marked = require('marked');
var concat = require('concat-stream');
var gm = require('gm');
var hyperglue = require('hyperglue');
var mkdirp = require('mkdirp');

var html = fs.readFileSync(__dirname + '/templates/index.html');

var outdir = './static/';


module.exports = function(outpath, prefix, options) {
  
  var resizeX = parseInt(options.size[0]);
  var resizeY = parseInt(options.size[1]);

  // make directories for output
  mkdirp(outpath + '/' + prefix);

  var index = concat(function(data) {
    var out = fs.writeFileSync(outpath + '/index.html', hyperglue(html, {'body': { _html: data}}).outerHTML);
  });
  
  var findit = require('findit')('./photos');
  i = 0;

  findit.on('file', function(source, stat) {

    var outfile = prefix + '/' + prefix + '_' + i + '.jpg';
    var entry = '<img src="./' + outfile + '" />';
    index.write(entry);

    gm('./' + source)
      .background('black')
      .resize(resizeX, resizeY)
      .extent(resizeX, resizeY)
      // .crop(70, 160, 20, 0)
      .noProfile()
      .write(outpath + '/' + outfile, function (err) {
        if (err) { console.log(err) }
        else {};
      });
    i++;
  });
  
  findit.on('end', function() {
    index.end();
  });

}
