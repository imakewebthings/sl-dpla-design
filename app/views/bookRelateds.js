define([
  'underscore',
  'jquery',
  'settings',
  'mediator',
  'views/base',
  'views/dplaRelated',
  'text!templates/bookRelateds.html'
], function(
  _,
  $,
  settings,
  mediator,
  BaseView,
  DplaRelatedView,
  BookRelatedsTemplate
) {

  var BookRelatedsView = BaseView.extend({
    template: _.template(BookRelatedsTemplate),

    initialize: function(options) {
      BaseView.prototype.initialize.call(this, options);
      if (!$('.stackview').length) {
        this.loadFirstSubjectStack();
      }
      this.$tabContainer = this.$('.book-relateds-container');
      this.loadDplaItems();
    },

    loadDplaItems: function() {
      if (!this.dplaView) {
        this.dplaView = new DplaRelatedView({
          bookModel: this.model
        });
        this.subviews.push(this.dplaView);
      }
      this.$tabContainer.contents().detach();
      this.$tabContainer.append(this.dplaView.el);
    },

    loadFirstSubjectStack: function() {
      var subjects = this.model.get('subjects');

      if (subjects && subjects[0]) {
        mediator.trigger('stack:load', {
          url: settings.get('searchURL'),
          search_type: 'subject',
          query: subjects[0],
          ribbon: subjects[0],
          fullHeight: true
        });
      }
    }
  });

  return BookRelatedsView;
});