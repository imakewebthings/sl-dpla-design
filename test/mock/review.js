define(['underscore'], function(_) {
  var idNdx = 1;

  return function(attributes) {
    return _.extend({
      id: idNdx++,
      rating: 5,
      comment: 'Lorem Ipsum Dolor',
      user: {
        id: 1,
        display_name: 'Mock User'
      }
    }, attributes);
  };
});