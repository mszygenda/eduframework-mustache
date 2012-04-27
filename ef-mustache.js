/*jslint node: true, sloppy: true, vars: true, indent: 2 */
/*global require: false, exports: false, console: false */

var util = require('util');
var events = require('events');
var mu = require('mu2');

var MustacheTemplateEngine = Object.create(events.EventEmitter.prototype);

MustacheTemplateEngine.render = function (viewFile, viewContext, output) {
  var self = this, stream = null;

  console.log('rendering template ' + viewFile);
  stream = mu.compileAndRender(viewFile, viewContext.viewModel);
  stream.on('end', function () {
    self.emit('template-rendered', viewFile, viewContext, output);
  });
  
  util.pump(stream, output);
};

exports.MustacheTemplateEngine = MustacheTemplateEngine;
