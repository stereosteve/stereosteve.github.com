(function() {
  $(function() {
    return window.PlacementChartController = Spine.Controller.create({
      init: function() {
        console.log('chart time');
        Region.bind('create', this.proxy(this.debug_region));
        return load_regions();
      },
      debug_region: function(region) {
        return console.log(region);
      }
    });
  });
}).call(this);
