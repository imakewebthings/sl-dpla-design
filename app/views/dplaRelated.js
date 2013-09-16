define([
  'underscore',
  'backbone',
  'jquery',
  'settings',
  'mediator',
  'views/base',
  'text!templates/dplaRelated.html',
  'jquery.masonry'

], function(
  _,
  Backbone,
  $,
  settings,
  mediator,
  BaseView,
  DplaRelatedTemplate
) {

  var DplaRelatedView = BaseView.extend({
    template: _.template(DplaRelatedTemplate),

    initialize: function(options) {
      Backbone.View.prototype.initialize.call(this, options);
      this.subviews = [];
      if (options && options.template) {
        this.template = options.template;
      }
      this.model = new Backbone.Model();
      this.model.on('change', _.bind(this.redraw, this));
      this.loadModel();
    },

    render: function() {
      BaseView.prototype.render.call(this);
      this.$('.dpla-related').imagesLoaded(_.bind(function() {
        this.$('.dpla-related').masonry({
          itemSelector: '.dpla-related-item'
        });
      }, this));
    },

    loadModel: function() {
      var params = this.params();

      if (params) {
        this.model.url = settings.get('dplaSearchURL', this.params());
        this.model.fetch();
      }
      else {
        this.model.set('docs', []);
      }
    },

    params: function() {
      var subjects = this.options.bookModel.get('subjects');
      if (!subjects || !subjects.length) {
        return null;
      }
      return {
        q: _.map(subjects, function(subject) {
          return $.trim(subject.replace(/\W/g, ' ').replace(/(\s)+/g, ' '))
        }).join(' OR ')
      }
    }
  });

  return DplaRelatedView;
});