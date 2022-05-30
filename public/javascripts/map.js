
  mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
  container: 'map', 
  style: 'mapbox://styles/mapbox/streets-v11',
  center: house.geometry.coordinates, 
  zoom: 8
  });

  new mapboxgl.Marker()
  .setLngLat(house.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<h5>${house.title}</h5><p>${house.location}</p>`
    )
  )
  .addTo(map);
   