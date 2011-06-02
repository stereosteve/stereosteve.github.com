(function() {
  $(function() {
    var Pin;
    Pin = Spine.Controller.create({
      pinTmpl: _.template("<a id='{{slug}}' class='map_pin {{this.classes()}}' title='{{name}}' style='left: {{scaled_x}}px; top: {{scaled_y}}px'></a>"),
      infoTmpl: _.template("<h2>{{name}}</h2>\n<div class='founded'>{{founded}}</div>"),
      events: {
        'click': 'showRegionInfo',
        'mouseover': 'mouseover',
        'mouseout': 'mouseout'
      },
      showRegionInfo: function(e) {
        $('.active').removeClass('active');
        console.log(this.item.name);
        $('.region_info').html(this.infoTmpl(this.item));
        return $('#' + this.item.slug).addClass('active');
      },
      mouseover: function(e) {
        $('.region_info').html(this.infoTmpl(this.item));
        return console.log('mouse over');
      },
      mouseout: function(e) {
        return console.log('mouse out');
      },
      classes: function() {
        if (this.item.high_need) {
          return 'high_need';
        }
      },
      render: function() {
        if (this.item.map_x === 0) {
          return false;
        }
        this.item['scaled_x'] = this.item.map_x * this.scale_factor - 8;
        this.item['scaled_y'] = this.item.map_y * this.scale_factor - 9;
        this.el.html(this.pinTmpl(this.item));
        return this;
      }
    });
    return window.MapController = Spine.Controller.create({
      init: function(el) {
        console.log('init map controller' + el);
        this.el = $(el);
        Region.bind('create', this.proxy(this.render));
        this.scale_factor();
        return load_regions();
      },
      scale_factor: function() {
        return this.el.width() / 1000;
      },
      render: function(region) {
        var pin;
        pin = Pin.init({
          item: region,
          scale_factor: this.scale_factor()
        });
        return this.el.append(pin.render().el);
      }
    });
  });
}).call(this);
