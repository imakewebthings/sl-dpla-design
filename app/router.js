define([
  'underscore',
  'backbone',
  'mediator',
  'settings',
  'models/book',
  'views/base',
  'views/index',
  'views/stackedMain',
  'views/appNotify'
], function(
  _,
  Backbone,
  mediator,
  settings,
  BookModel,
  BaseView,
  IndexView,
  StackedMainView,
  appNotify
) {
  var mainView;
  var inStackedMode = false;
  var appRouter;

  var setMain = function(MainClass, options) {
    if (!inStackedMode || MainClass !== StackedMainView) {
      if (mainView && mainView.clear) {
        mainView.clear();
      }
      mainView = new MainClass(options);
    }
    inStackedMode = MainClass === StackedMainView;
    if (!inStackedMode) {
      mediator.trigger('preview:unload');
      mediator.trigger('dpla:unload');
    }
  };

  var Router = Backbone.Router.extend({
    routes: {
      '': 'index',
      'search/:type/:term': 'search',
      'books/:id': 'showBook'
    },

    index: function() {
      setMain(StackedMainView);
      mainView.subviews.push(new IndexView());
    },

    search: function(type, term) {
      var decodedTerm = decodeURIComponent(term);

      setMain(StackedMainView);
      mediator.trigger('stack:load', {
        url: settings.get('searchURL'),
        jsonp: true,
        query: decodedTerm,
        ribbon: decodedTerm,
        search_type: type,
        selectFirstBook: true,
        fullHeight: true
      });
    },

    showBook: function(id) {
      setMain(StackedMainView);
      mediator.trigger('preview:load', id);
    }
  });

  appRouter = new Router();

  // Google Analytics for all the routes
  Backbone.history.on('route', function() {
    window.ga('send', 'pageview', '/' + Backbone.history.fragment);
  });

  // Let other modules trigger navigation changes without creating circular
  // dependencies, using the mediator object to pass events.
  mediator.on({
    'navigate:index': function() {
      appRouter.navigate('', { trigger: true });
    },

    'navigate:search': function(type, term) {
      var encodedTerm = encodeURIComponent(term);
      appRouter.navigate(
        ['search', type, encodedTerm].join('/'),
        { trigger: true }
      );
    },

    'navigate:book': function(id) {
      appRouter.navigate('books/' + id, { trigger: true });
    }
  });

  mediator.on('stack:refresh', function() {
    if (inStackedMode) {
      mediator.trigger('stack:redraw');
    }
  });

  return appRouter;
});