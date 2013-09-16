define([
  'underscore',
  'jquery',
  'mediator',
  'settings',
  'views/base',
  'views/appNotify',
  'text!templates/stackview.html',
  'text!templates/stackview-book.html',
  'stackview',
  'jquery-ui'
], function(
  _,
  $,
  mediator,
  settings,
  BaseView,
  appNotify,
  StackTemplate,
  StackViewBookTemplate
) {

  window.StackView.defaults.book.min_height_percentage = 66;

  var currentStack, pivotID;

  var StackView = BaseView.extend({
    el: '.stack-wrapper',
    template: _.template(StackTemplate),

    initialize: function(options) {
      if (options.data == null && options.url == null) {
        throw new Error('Stack data or url is required');
      }
      options.bookTemplate = StackViewBookTemplate;
      BaseView.prototype.initialize.call(this, options);
      if (options.fullHeight) {
        $(window).resize(_.bind(this._resize, this));
      }
      this.$('.stackview')
        .on('stackview.pageload', _.bind(this.highlightPivot, this));
    },

    render: function() {
      BaseView.prototype.render.call(this);
      window.StackView.get_types().book.template = this.options.bookTemplate;
      if (this.options.selectFirstBook) {
        this.$('.stackview').one('stackview.pageload', _.bind(function() {
          var $first = this.$('.stack-item').first();
          if (!$first.length) { return; }
          var id = $first.data('stackviewItem').source_id;
          mediator.trigger('preview:load', id);
        }, this));
      }
      this.$('.stackview').stackView(this.options);
      if (this.options.fullHeight) {
        this._resize();
      }
    },

    _resize: function() {
      var $stack = this.$('.stackview');
      var windowHeight = window.innerHeight ?
                         window.innerHeight :
                         $(window).height();
      var targetHeight;
      if ($stack.length) {
        targetHeight = Math.max(windowHeight - $stack.offset().top, 520);
      }
      $stack.height(targetHeight);
    },

    highlightPivot: function() {
      this.$('.stack-item').removeClass('stack-pivot').filter(function() {
        return $(this).data('stackviewItem').source_id === pivotID;
      }).addClass('stack-pivot');
    }
  });

  mediator.on('stack:load', function(options) {
    if (currentStack) {
      currentStack.clear();
    }
    currentStack = new StackView(options);
  });

  mediator.on('stack:redraw', function() {
    var options;
    if (currentStack) {
      options = currentStack.options;
      currentStack.clear();
      currentStack = new StackView(options);
    }
  });

  mediator.on('preview:load', function(id) {
    pivotID = id;
    if (currentStack) {
      currentStack.highlightPivot();
    }
  });

  mediator.on('preview:unload', function() {
    pivotID = null;
  });

  return StackView;
});