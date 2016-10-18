/**
 * Created by katsura on 16-10-5.
 */
var generators = require('yeoman-generator');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var inject = require('../../../../build/smart-injector').inject;
module.exports = generators.Base.extend({
  // The name `constructor` is important here
  constructor: function () {
    // Calling the super constructor is important so our generator is correctly set up
    generators.Base.apply(this, arguments);

    this.getPages = function (dir) {
      return fs.readdirSync(dir).filter(function (file) {
        return fs.statSync(path.normalize(dir + '/' + file)).isDirectory();
      })
    };
  },

  initializing: function () {
    this.distPath = this.config.get('dist') + 'pages';
    var distPages = this.destinationPath(this.distPath);
    this.pages = this.getPages(distPages);
    console.log('Going to add a page');
  },

  prompting: function () {
    return this.prompt([{
      type    : 'input',
      name    : 'name',
      message : 'Your page name ...',
      default : 'testPage' // Default to current folder name
    },{
      type    : 'input',
      name    : 'description',
      message : 'Description: ',
      default : 'This is a page!' // Default to current folder name
    }]).then(function (answers) {
      var pageName = answers.name;

      var fileName = _.startCase(pageName).replace('\ ', '');


      this.pageName = pageName;
      this.mainFileName = fileName;
      this.description = answers.description;

      var pages = this.pages;

      if(pages.indexOf(pageName) === -1){
        pages.push(pageName);
      }
      console.log(pages)
      var [p, r] = generateCode(pages);
      var opts = [{
        code: p,
        type: 'page'
      },{
        code: r,
        type: 'route'
      }];

      inject(this.destinationPath('src/router.js'), opts);

    }.bind(this));
  },

  configuring: function () {

  },

  'default': function () {

  },

  writing: {
    main: function () {
      var pageName = this.pageName,
        distFile = this.pageName + '/' + this.mainFileName + '.vue';

      if(this.fs.exists(distFile)) {
        this.log(distFile + ' already exists...');
        return;
      }

      this.fs.copyTpl(
        this.templatePath('Page.vue'),
        this.destinationPath(this.distPath + '/' + this.pageName + '/' + this.mainFileName + '.vue'),
        { pageName: this.mainFileName }
      );

    },

    package: function () {
      var pkg = this.distPath + '/' + this.pageName + '/package.json';

      if(this.fs.exists(pkg)){
        this.log(pkg + ' already exists...');
        return;
      }

      this.fs.copyTpl(
        this.templatePath('package.json'),
        this.destinationPath(pkg),
        {
          pageName: this.mainFileName,
          description: this.description
        }
      );
    },

    assets: function () {
      this.fs.copy(
        this.templatePath('assets/**'),
        this.destinationPath(this.distPath + '/' + this.pageName + '/assets/')
      );
    },

    component: function () {
      var componentPath = this.destinationPath(this.distPath + '/' + '../components'),
        distComponentPath = componentPath + '/package.json';

      if(this.fs.exists(distComponentPath)){
        this.log(distComponentPath + ' already exists...');
        return;
      }

      this.fs.copyTpl(
        this.templatePath('component/package.json'),
        this.destinationPath(this.distPath + '/' + '../components/' + this.pageName + '/package.json'),
        {
          pageName: this.mainFileName
        }
      );
    }
  },

  conflicts: function () {

  },

  install: function () {

  },

  end: function () {

  }
});

function generateCode(pages) {
  var ps = [],
    routes = [];
  pages.forEach(function (page) {
    var pageName = _.upperFirst(page);
    ps.push("import " + pageName + " from './pages/"+ page +"/"+ pageName +".vue'");
    routes.push("{path: '/"+ page +"', component: "+ pageName +"}");
  });

  return [ps.join('\n'), routes.join(',\n')];
}
