define([
  'underscore',
  'mediator',
  'settings',
  'models/book',
  'views/base',
  'views/appNotify',
  'views/bookReader',
  'views/bookRelateds',
  'text!templates/bookPreview.html'
], function(
  _,
  mediator,
  settings,
  BookModel,
  BaseView,
  appNotify,
  BookReaderView,
  BookRelatedsView,
  BookPreviewTemplate
) {

  var BookPreviewView = BaseView.extend({
    el: '.app-preview',
    template: _.template(BookPreviewTemplate),

    events: {
      'click .read-book': 'loadBookReader',
      'click .single-subject-link': 'loadSingleSubject'
    },

    render: function() {
      BaseView.prototype.render.call(this);
      this.subviews.push(new BookRelatedsView({
        el: '.book-relateds',
        model: this.model
      }));
    },

    loadBookReader: function(event) {
      mediator.trigger('modal:show', BookReaderView, { model: this.model });
      event.preventDefault();
    },

    loadSingleSubject: function(event) {
      var subject = $(event.target).data('subject');

      this.loadStack({
        url: settings.get('searchURL'),
        search_type: 'subject',
        query: subject,
        ribbon: subject,
        fullHeight: true
      });

      event.preventDefault();
    },

    loadStack: function(options) {
      mediator.trigger('stack:load', options);
    }
  });
  var currentPreview;

  mediator.on('preview:load', function(id) {
    var book = new BookModel({ id: id });

    book.fetch({
      success: function(model, response, options) {
        if (currentPreview) {
          currentPreview.clear();
        }
        currentPreview = new BookPreviewView({ model: model });
      },

      error: function(model, xhr, options) {
        appNotify.notify({
          type: 'error',
          message: 'Something went wrong trying to load that book.'
        });
      }
    });
  });

  mediator.on('preview:redraw', function() {
    if (currentPreview) {
      currentPreview.redraw();
    }
  });

  mediator.on('preview:unload', function() {
    if (currentPreview) {
      currentPreview.clear();
    }
  });

  return BookPreviewView;
});