$ ->

  window.PlacementChartController = Spine.Controller.create (
    init: () ->
      console.log('chart time')
      Region.bind('create', @proxy(@debug_region))
      load_regions()

    debug_region: (region) ->
      console.log(region)
  )
