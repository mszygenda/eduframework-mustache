/*jslint node: true, sloppy: true, vars: true, indent: 2 */
/*global require: false, exports: false, console: false, EduFramework: false */

var MemoryStream = require('memorystream'),
    util = require('util'),
    events = require('events'),
    mu = require('mu2'),
    MustacheTemplateEngine = Object.create(events.EventEmitter.prototype);

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
  var partialName, partial, renderedPartials = 0, partialCount = 0, partialRendered;

  partialRendered = function (name, data) {
    renderedPartials += 1;
    view.viewModel[name] = data;

    if (renderedPartials === partialCount) {
      callback();
    }
  };

  for (partialName in view.partials) {
    if (typeof view.partials[partialName] !== 'function') {
      partial = view.partials[partialName];    
      partialCount += 1;
      this.renderPartial(partialName, partial, partialRendered);
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
  mu.root = EduFramework.Config.core.viewsPath;

  EduFramework.ViewEngine.TemplateEngineManager.register('mustache', MustacheTemplateEngine);
};

exports.MustacheTemplateEngine = MustacheTemplateEngine;
