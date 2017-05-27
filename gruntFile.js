'use strict';

module.exports = function (grunt) {
  var files = [
    './*.js'
  ];
  grunt.initConfig({
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        node: true,
        asi: true,
        globals: {
          module: true,
        },
      },
      files: files
    },
    jsbeautifier: {
      files: files,
      options: {
        js: {
          braceStyle: "collapse",
          breakChainedMethods: false,
          e4x: false,
          evalCode: false,
          indentChar: " ",
          indentLevel: 0,
          indentSize: 2,
          indentWithTabs: false,
          jslintHappy: true,
          keepArrayIndentation: true,
          keepFunctionIndentation: true,
          maxPreserveNewlines: 10,
          preserveNewlines: true,
          spaceBeforeConditional: true,
          spaceInParen: false,
          unescapeStrings: false,
          wrapLineLength: 0,
          endWithNewline: false
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.registerTask('default', ['jsbeautifier', 'jshint']);
};