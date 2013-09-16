require.config({
  paths: {
    backbone: 'libs/backbone/backbone',
    jquery: 'libs/jquery/jquery',
    'jquery-ui': 'libs/jquery/jquery-ui',
    'jquery.serialize-object': 'libs/jquery/jquery.serialize-object',
    'jquery.chosen': 'libs/jquery/jquery.chosen.min',
    'jquery.cookie': 'libs/jquery/jquery.cookie',
    'jquery.infieldlabel': 'libs/jquery/jquery.infieldlabel',
    'jquery.masonry': 'libs/jquery/jquery.masonry.min',
    modernizr: 'libs/modernizr/modernizr',
    JSON: 'libs/json2/json2',
    stackview: 'libs/stackview/stackview',
    text: 'libs/require/text',
    underscore: 'libs/underscore/underscore'
  },

  shim: {
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },

    'jquery-ui': {
      deps: ['jquery']
    },

    'jquery.serialize-object': {
      deps: ['jquery']
    },

    'jquery.chosen': {
      deps: ['jquery']
    },

    'jquery.cookie': {
      deps: ['jquery', 'JSON']
    },

    'jquery.infieldlabel': {
      deps: ['jquery']
    },

    'jquery.masonry': {
      deps: ['jquery']
    },

    modernizr: {
      exports: 'Modernizr'
    },

    JSON: {
      exports: 'JSON'
    },

    stackview: {
      deps: ['jquery']
    },

    underscore: {
      exports: '_'
    }
  }
});

require([
  'jquery',
  'mediator',
  'router',
  'jquery.cookie',
  'views/appSearch',
  'views/modal',
  'modernizr'
], function($, mediator) {
  $.cookie.json = true;

  $(function() {
    Backbone.history.start();
    mediator.trigger('app:init');
  });
});