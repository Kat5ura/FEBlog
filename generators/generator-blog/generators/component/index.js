/**
 * Created by katsura on 16-10-5.
 */
var generators = require('yeoman-generator');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
module.exports = generators.Base.extend({
  // The name `constructor` is important here
  constructor: function () {
    // Calling the super constructor is important so our generator is correctly set up
    generators.Base.apply(this, arguments);

    this.getPages = function (dir) {
      return fs.readdirSync(dir).filter(function (file) {
        return fs.statSync(path.normalize(dir + '/' + file)).isDirectory();
      })
    }
  },

  initializing: function () {
    var distComponent = this.destinationPath('src/components/');
    this.pages = this.getPages(distComponent);
    console.log('Going to add a component');
  },

  prompting: function () {
    return this.prompt([{
      type    : 'list',
      name    : 'page',
      message : 'Your component belongs to ...',
      choices : this.pages
    },{
      type    : 'input',
      name    : 'name',
      message : 'Your component name ...',
      default : 'testComponent' // Default to current folder name
    }]).then(function (answers) {
      var componentName = answers.name,
        pageName = answers.page;

      var fileName = _.startCase(componentName).replace('\ ', '');
      this.componentName = componentName;
      this.componentFileName = fileName;
      this.pageName = pageName

    }.bind(this));
  },

  configuring: function () {

  },

  'default': function () {

  },

  writing: function () {
    this.fs.copyTpl(
      this.templatePath('Component.vue'),
      this.destinationPath('src/components/' + this.pageName + '/' + this.componentFileName + '.vue'),
      { componentName: this.componentFileName }
    );
  },

  conflicts: function () {

  },

  install: function () {

  },

  end: function () {

  }
});
