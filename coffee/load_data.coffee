$ ->

  window.load_regions = () ->
    $.getJSON('/data/regions.json', (data) ->
      _.each(data.regions, (r) ->
        Region.create(r)
      )
    )
