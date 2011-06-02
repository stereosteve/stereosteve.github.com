$ ->

  window.RegionTabController = Spine.Controller.create(

    regionLinkTemplate: _.template("""
      <li>
        <a href='\#{{slug}}'>{{name}}</a>
      </li>
    """)

  )

  window.CompareController = Spine.Controller.create(

    regionLinkTemplate: _.template("""
      <li>
        <a href='\#{{slug}}'>{{name}}</a>
      </li>
    """)


    init: () ->
      Region.bind('create', @proxy(@addRegion))
      load_regions()

    addRegion: (region) ->
      $("ul#regions").append(@regionLinkTemplate(region))

  )
