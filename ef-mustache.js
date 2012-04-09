var util = require('util');
var mu = require('mu2');

var MustacheTemplateEngine = function() {

  this.render = function(viewFile, viewContext, output) {
    var self = this;

    console.log('rendering template ' + viewFile);
    stream = mu.compileAndRender(viewFile, viewContext.viewModel)
    stream.on('end', function () {
      self.emit('template-rendered', viewFile, viewContext, output);
    })
    
    util.pump(stream, output)
  }
}

sys.inherits(MustacheTemplateEngine, events.EventEmitter)
exports.MustacheTemplateEngine = MustacheTemplateEngine
