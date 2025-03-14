export async function setupDestinationMap(destination) {
	let map = null;
	let marker = null;

	destination.addEventListener("change", async function () {
		const destVal = destination.value.trim();

		try {
			const coords = await getCoordinates(destVal);

			if (!coords) {
				alert("Location not found. Please try another destination.");
				return;
			}

			const trip = document.getElementById("trip");
			let mapDiv = document.getElementById("preview");

			if (!mapDiv) {
				mapDiv = document.createElement("div");
				mapDiv.id = "preview";
				mapDiv.style.height = "400px";
				trip.appendChild(mapDiv);
			}

			if (!map) {
				mapboxgl.accessToken =
					"pk.eyJ1IjoiZmFyZXN0eWsiLCJhIjoiY204M2c3OTl3MHFrMTJpcjR2Z2ZrYWgybSJ9.elrKNi3eYJ-He6z0zEjjtQ";
				map = new mapboxgl.Map({
					container: "preview",
					style: "mapbox://styles/mapbox/streets-v12",
					center: coords,
					zoom: 5,
				});

				map.addControl(new mapboxgl.NavigationControl());
				map.addControl(
					new mapboxgl.GeolocateControl({
						positionOptions: { enableHighAccuracy: true },
						trackUserLocation: true,
					})
				);

				marker = new mapboxgl.Marker()
					.setLngLat(coords)
					.setPopup(new mapboxgl.Popup().setHTML(destVal))
					.addTo(map);
				marker.getPopup().addTo(map);
			} else {
				map.flyTo({ center: coords, zoom: 5 });
				marker.setLngLat(coords);
				marker.getPopup().setHTML(destVal).addTo(map);
				marker.togglePopup();
			}
		} catch (error) {
			console.error("Error:", error);
			alert("Error fetching location. Please try again.");
		}
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
		container: "placesPinedMap",
		style: "mapbox://styles/mapbox/streets-v12",
		center: coordinates,
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
	console.log(countryName);
	const accessToken =
		"pk.eyJ1IjoiZmFyZXN0eWsiLCJhIjoiY204M2c3OTl3MHFrMTJpcjR2Z2ZrYWgybSJ9.elrKNi3eYJ-He6z0zEjjtQ";
	const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
		countryName
	)}.json?types=country&access_token=${accessToken}`;

	try {
		const response = await fetch(url);
		if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
		const data = await response.json();
		if (
			data.features &&
			Array.isArray(data.features) &&
			data.features.length > 0
		) {
			const firstFeature = data.features[0];
			if (firstFeature.properties) {
				console.log(data.features);
				const countryContext = firstFeature.properties.short_code;
				if (countryContext) {
					console.log(countryContext);
					return countryContext || null;
				}
			}
		}
		return null;
	} catch (error) {
		console.error("Error fetching country code:", error);
		return null;
	}
}
