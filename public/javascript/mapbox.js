class Mapbox {
    /**
     * @summary Mapbox constructor
     * @param {string} accessToken Token generated by Mapbox API
     */
    constructor(accessToken) {
        mapboxgl.accessToken = accessToken
    }

    /**
     * @summary Create a map object and attach to div with map id
     * @description After the map be fully loaded, the property 'isCustomImageLoaded' will return true
     */
    showMap = () => {
        this.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            maxZoom: 15,
            minZoom: 13,
            zoom: 14,
            center: [145.114641, -37.849003]
        }).on('load', this.loadCustomImage)
    }

    /**
     * @summary Load custom image for POIs
     * @property isCustomImageLoaded is a flag of task completion
     */
    loadCustomImage = () => {
        this.isCustomImageLoaded = false
        this.map.loadImage('https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png', (err, image) => {
            if (err) throw err
            this.map.addImage('custom-marker', image)
            this.isCustomImageLoaded = true
        })
    }

    /**
     * @summary Activate geolocate function
     */
    activateGeolocateControl = () => {
        this.map.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true,
                showAccuracyCircle: false
            })
        )
    }

    /**
     * @summary Remove POIs from map
     * @todo Extract layer id and source id as parameters
     */
    removePOIs = () => {
        if (!this.map.getLayer('points')) return
        this.map.removeLayer('points')
        this.map.removeSource('points')
    }

    /**
     * @summary Append POIs to map
     * @param {JSON} POIs POI data
     * @requires generateLinkHTML function used for formulating the html inside POIs
     * @throws Map.generateLinkHtml not defined error
     * @todo Add example to this JSDocs
     */
    appendPOIs = (POIs) => {
        // Bind POI data to map
        this.map.addSource('points', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': POIs
            }
        })

        // Add a POI layer to map
        this.map.addLayer({
            'id': 'points',
            'type': 'symbol',
            'source': 'points',
            'layout': {
                'icon-image': 'custom-marker',
                'text-field': ['get', 'title'],
                'text-font': [
                    'Open Sans Semibold',
                    'Arial Unicode MS Bold'
                ],
                'text-offset': [0, 1.25],
                'text-anchor': 'top'
            }
        })

        // Bind click event
        this.map.on('click', 'points', (e) => {
            const coordinates = e.features[0].geometry.coordinates.slice()
            if (!this.generateLinkHTML) throw 'Map.generateLinkHtml must be defined first!'
            const description = this.generateLinkHTML(e)
            
            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
            }
            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(this.map)
        })
    }
}