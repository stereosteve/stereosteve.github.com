(function() {
  $(function() {
    window.RegionTabController = Spine.Controller.create({
      regionLinkTemplate: _.template("<li>\n  <a href='\#{{slug}}'>{{name}}</a>\n</li>")
    });
    return window.CompareController = Spine.Controller.create({
      regionLinkTemplate: _.template("<li>\n  <a href='\#{{slug}}'>{{name}}</a>\n</li>"),
      init: function() {
        Region.bind('create', this.proxy(this.addRegion));
        return load_regions();
      },
      addRegion: function(region) {
        return $("ul#regions").append(this.regionLinkTemplate(region));
      }
    });
  });
}).call(this);
