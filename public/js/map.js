mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-streets-v12',
    center: listing.geometry.coordinates,
    zoom: 9
});


const marker = new mapboxgl.Marker({ color: "red", draggable: true })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25, className: 'my-class' })
        .setHTML(`<h5>${listing.title}</h5><p>Exact location will be provided after booking.</p>`))
    .addTo(map);