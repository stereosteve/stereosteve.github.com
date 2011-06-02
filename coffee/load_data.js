(function() {
  $(function() {
    return window.load_regions = function() {
      return $.getJSON('/data/regions.json', function(data) {
        return _.each(data.regions, function(r) {
          return Region.create(r);
        });
      });
    };
  });
}).call(this);
