export async function setupDestinationMap(destination) {
		let map;
		destination.addEventListener("change", function () {
			let destVal = destination.value.trim();
			fetch(
				`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
					destVal
				)}&format=json`
			)
				.then((response) => response.json())
				.then((data) => {
					if (data && data.length > 0) {
						let lat = parseFloat(data[0].lat);
						let lon = parseFloat(data[0].lon);
						let trip = document.getElementById("trip");
						let mapDiv = document.getElementById("preview");
						if (!mapDiv) {
							mapDiv = document.createElement("div");
							mapDiv.id = "map";
							trip.appendChild(mapDiv);
						}
						if (!map) {
							map = L.map(mapDiv).setView([lat, lon], 5);
							L.tileLayer(
								"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
								{
									attribution: "&copy; OpenStreetMap contributors",
								}
							).addTo(map);
                            
						} else {
							map.setView([lat, lon], 5);
						}
						L.marker([lat, lon]).addTo(map).bindPopup(destVal).openPopup();
					} else {
						alert("Location not found. Please try another destination.");
					}
				});
		});
}
export async function getCoordinates(destinationName) {
	let url = `https://api.mapbox.com/search/geocode/v6/forward?q=${destinationName}&access_token=pk.eyJ1IjoiZmFyZXN0eWsiLCJhIjoiY204M2c3OTl3MHFrMTJpcjR2Z2ZrYWgybSJ9.elrKNi3eYJ-He6z0zEjjtQ`;
	try {
		let response = await fetch(url);
		let data = await response.json();
		let coords = data.features[0].geometry.coordinates;
		console.log("Fetched Coordinates:", coords);
		return coords;
	} catch (error) {
		console.error("Error fetching coordinates:", error);
	}
}
export async function createInteractiveMap(coordinates) {
	mapboxgl.accessToken =
		"pk.eyJ1IjoiZmFyZXN0eWsiLCJhIjoiY204M2c3OTl3MHFrMTJpcjR2Z2ZrYWgybSJ9.elrKNi3eYJ-He6z0zEjjtQ";

	// Initialize the map
	const map = new mapboxgl.Map({
		container: "placesPinedMap", // The ID of the div where the map will be rendered
		style: "mapbox://styles/mapbox/streets-v12",
		center: coordinates, // Cairo, Egypt
		zoom: 5,
	});

	// Add a custom marker with a popup
	const marker = new mapboxgl.Marker()
		.setLngLat(coordinates)
		.setPopup(new mapboxgl.Popup().setText("Cairo, Egypt"))
		.addTo(map);

	// Show user's current location
	map.addControl(
		new mapboxgl.GeolocateControl({
			positionOptions: { enableHighAccuracy: true },
			trackUserLocation: true,
		})
	);

	// Add GeoJSON data layer
	map.on("load", () => {
		map.addSource("places", {
			type: "geojson",
			data: {
				type: "FeatureCollection",
				features: [
					{
						type: "Feature",
						geometry: { type: "Point", coordinates: coordinates },
						properties: { title: "Sample Location" },
					},
				],
			},
		});

		map.addLayer({
			id: "places-layer",
			type: "circle",
			source: "places",
			paint: {
				"circle-radius": 8,
				"circle-color": "#007cbf",
			},
		});
	});

	// Add search functionality
	// map.addControl(
	// 	new MapboxGeocoder({
	// 		accessToken: mapboxgl.accessToken,
	// 		mapboxgl: mapboxgl,
	// 	})
	// );
}
export async function getCountryCodeFromName(countryName) {
		mapboxgl.accessToken =
			"pk.eyJ1IjoiZmFyZXN0eWsiLCJhIjoiY204M2c3OTl3MHFrMTJpcjR2Z2ZrYWgybSJ9.elrKNi3eYJ-He6z0zEjjtQ";
	const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
		countryName
	)}.json?types=country&access_token=${mapboxgl.accessToken}`;

	try {
		const response = await fetch(url);
		const data = await response.json();
		if (data.features && data.features.length > 0) {
			return data.features[0].properties.short_code;
		}
		return null;
	} catch (error) {
		console.error("Error fetching country code:", error);
		return null;
	}
}
