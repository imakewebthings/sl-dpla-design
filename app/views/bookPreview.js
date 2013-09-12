define([
  'underscore',
  'mediator',
  'settings',
  'models/book',
  'models/user',
  'collections/review',
  'views/base',
  'views/appNotify',
  'views/bookReader',
  'views/reviews',
  'views/bookRelateds',
  'text!templates/bookPreview.html'
], function(
  _,
  mediator,
  settings,
  BookModel,
  UserModel,
  ReviewCollection,
  BaseView,
  appNotify,
  BookReaderView,
  ReviewsView,
  BookRelatedsView,
  BookPreviewTemplate
) {

  var BookPreviewView = BaseView.extend({
    el: '.app-preview',
    template: _.template(BookPreviewTemplate),

    events: {
      'click .read-book': 'loadBookReader',
      'click .single-subject-link': 'loadSingleSubject',
      'submit .add-to-shelf-form': 'addBookToShelf',
    },

    initialize: function(options) {
      BaseView.prototype.initialize.call(this, options);
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
    },

    addBookToShelf: function(event) {
      var $shelfFormElement = this.$('.add-to-shelf-form [name="shelf_id"]');
      var shelfID = $shelfFormElement.val();
      var shelfName = $shelfFormElement.find('option:selected').text();
      var bookID = this.model.get('source_id');
      var bookName = this.model.get('title');
      var userToken = UserModel.currentUser().get('token');

      $.ajax({
        type: 'post',
        url: settings.get('shelfPushURL', shelfID),
        data: {
          item: {
            item_id: bookID,
            item_type: 'book',
            source: 'book_source'
          }
        },
        headers: {
          'Authorization': 'Token token=' + userToken
        },
        success: function() {
          appNotify.notify({
            type: 'success',
            message: bookName + ' added to ' + shelfName + ' shelf.'
          });
        },
        error: function() {
          appNotify.notify({
            type: 'error',
            message: 'Something went wrong trying to add ' + bookName +
                     ' to ' + shelfName + ' shelf.'
          });
        }
      });
      event.preventDefault();
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