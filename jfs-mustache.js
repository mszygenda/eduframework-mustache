var util = require('util');
var mu = require('mu2')

var MustacheTemplateEngine = function() {

  this.render = function(viewFile, viewContext, output) {
    console.log('rendering ' + viewFile);
    stream = mu.compileAndRender(viewFile, viewContext.viewModel)

    util.pump(stream, output)
  }
}

sys.inherits(MustacheTemplateEngine, events.EventEmitter)
exports.MustacheTemplateEngine = MustacheTemplateEngine
