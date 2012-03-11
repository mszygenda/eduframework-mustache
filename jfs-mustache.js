var mu = require('mu')

var MustacheTemplateEngine = function() {
  mu.templateRoot = Core.Config.ViewPath
  
  this.render = function(viewFile, viewContext, output) {
    mu.render(viewFile, viewContext.viewModel, {}, function(err, content) {
      output.write(content)
    }) 
  }
}

exports.MustacheTemplateEngine = MustacheTemplateEngine
