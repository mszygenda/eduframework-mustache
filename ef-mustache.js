/*jslint node: true, sloppy: true, vars: true, indent: 2 */
/*global require: false, exports: false, console: false, EduFramework: false */

var MemoryStream = require('memorystream');
var util = require('util');
var events = require('events');
var mu = require('mu2');

var MustacheTemplateEngine = Object.create(events.EventEmitter.prototype);

MustacheTemplateEngine.render = function (view, output, success) {
  var self = this, stream = null, viewFile;
  viewFile = view.getViewPath();

  EduFramework.logger.info('rendering template ' + viewFile);

  this.renderPartials(view, function () {
    stream = mu.compileAndRender(viewFile, view.viewModel);
    stream.on('end', function () {
      self.emit('template-rendered', viewFile, view, output);
      success(view);
    });
    self.pumpMustacheStreamToOut(stream, output);
  });
};

MustacheTemplateEngine.pumpMustacheStreamToOut = function (muStream, out) {
  muStream.on('data', function (chunk) {
    out.write(chunk);
  });
  muStream.on('end', function () {
    out.end();
  });
};

MustacheTemplateEngine.renderPartials = function (view, callback) {
  var partialName, partial, renderedPartials = 0, partialCount = 0;

  for (partialName in view.partials) {
    partial = view.partials[partialName];    

    if (typeof partial !== 'function') {
      partialCount += 1;
      this.renderPartial(partialName, partial, function (name, data) {
        renderedPartials += 1;
        view.viewModel[name] = data;

        if (renderedPartials === partialCount) {
          callback();
        }
      });
    }
  }

  if (partialCount === 0) {
    callback();
  }
};

MustacheTemplateEngine.renderPartial = function (name, partial, callback) {
  var ms = new MemoryStream(), data = "";

  ms.on('data', function (chunk) {
    data += chunk;
  });

  EduFramework.ViewEngine.renderView(partial, ms, function () {
    callback(name, data);
  });
};

exports.dependencies = function () {
  return [EduFramework.ViewEngine];
};

exports.initialize = function () {
  EduFramework.ViewEngine.TemplateEngineManager.register('mustache', MustacheTemplateEngine);
};

exports.MustacheTemplateEngine = MustacheTemplateEngine;
