$ ->

  Pin = Spine.Controller.create(
    pinTmpl: _.template("<a id='{{slug}}' class='map_pin {{this.classes()}}' title='{{name}}' style='left: {{scaled_x}}px; top: {{scaled_y}}px'></a>")
    infoTmpl: _.template("""
      <h2>{{name}}</h2>
      <div class='founded'>{{founded}}</div>
    """)
    events:
      'click': 'showRegionInfo'
      'mouseover': 'mouseover'
      'mouseout': 'mouseout'
    showRegionInfo: (e) ->
      $('.active').removeClass('active')
      console.log(this.item.name)
      $('.region_info').html(@infoTmpl(@item))
      $('#'+@item.slug).addClass('active')
    mouseover: (e) ->
      $('.region_info').html(@infoTmpl(@item))
      console.log('mouse over')
    mouseout: (e) ->
      console.log('mouse out')
    classes: ->
      return 'high_need' if @item.high_need
    render: ->
      return false if @item.map_x is 0
      @item['scaled_x'] = @item.map_x * @scale_factor - 8
      @item['scaled_y'] = @item.map_y * @scale_factor - 9
      this.el.html(this.pinTmpl(@item))
      return this
  )


  window.MapController = Spine.Controller.create(
    #el: $("#map_widget")

    init: (el) ->
      console.log('init map controller' + el)
      @el = $(el)
      Region.bind('create', @proxy(@render))
      @scale_factor()
      load_regions()

    scale_factor: ->
      @el.width() / 1000

    render: (region) ->
      pin = Pin.init({item: region, scale_factor: @scale_factor()})
      @el.append(pin.render().el)

  )
  

