document.addEventListener("DOMContentLoaded", function () {
	let tripBtn = document.getElementById("tripbtn");
	tripBtn.addEventListener("click", function () {
		let overlay = document.createElement("div");
		overlay.classList.add("overlay");
		let modal = document.createElement("div");
		modal.classList.add("custom-modal");
		modal.innerHTML = `
      <h2>Create a New Trip</h2>
      <div id="trip">
      <div id="tripdetails">
      <label for="">Trip Name</label>
    <input type="text" placeholder="eg., Summer Vacation in Egypt" id="name">
    <label for="">Destination</label>
    <input type="text" name="" id="Dest">
    <label for="">Description</label>
    <textarea name="" id="Desc"></textarea>
	<button id="add-Date">+ Add dates/days</button>
    <button id="createbtn">Create Trip</button>
    </div>
    </div>
    <button id="closeModal">X</button>
    `;
		let addDate = document.getElementById("add-Date");
		overlay.appendChild(modal);
		document.body.appendChild(overlay);
		let closeModal = document.getElementById("closeModal");
		closeModal.addEventListener("click", function () {
			document.body.removeChild(overlay);
		});
		let name = document.getElementById("name");
		let description = document.getElementById("Desc");
		let destination = document.getElementById("Dest");
		let addTrip = document.getElementById("createbtn");
		let trips = document.getElementById("planned-Trips");
		let placeholder = document.getElementById("empty");
		addTrip.addEventListener("click", function () {
			placeholder.style.display = "none";
			let tripCard = document.createElement("div");
			tripCard.className = "card";
			tripCard.id = "trip-card";
			let title = document.createElement("h2");
			let location = document.createElement("div");
			let details = document.createElement("div");
			details.id = "details";
			details.className = "card-img-overlay";
			location.id = "location";
			let imgDiv = document.createElement("div");
			let pinpoint = document.createElement("img");
			let destImg = document.createElement("img");
			imgDiv.className = "image-fade";
			destImg.id = "destImg";
			destImg.className = "card-img img-fluid rounded-4";
			pinpoint.id = "pinpoint";
			pinpoint.src = "../Assets/icons/pinpoint-svgrepo-com.svg";
			let dest = document.createElement("h6");
			let desc = document.createElement("p");
			title.textContent = name.value;
			dest.textContent = destination.value;
			desc.textContent = description.value;
			imageSelector(dest, destImg);
			details.appendChild(title);
			location.appendChild(pinpoint);
			location.appendChild(dest);
			details.appendChild(location);
			details.appendChild(desc);
			tripCard.appendChild(destImg);
			tripCard.appendChild(details);
			trips.appendChild(tripCard);
		});
		let map;
		destination.addEventListener("input", function () {
			let destVal = destination.value.trim();
			fetch(
				`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
					destVal
				)}&format=json`
			)
				.then((response) => response.json())
				.then((data) => {
					if (data && data.length > 0) {
						const lat = data[0].lat;
						const lon = data[0].lon;
						let trip = document.getElementById("trip");
						let mapDiv = document.getElementById("map");
						if (!mapDiv) {
							mapDiv = document.createElement("div");
							mapDiv.id = "map";
							trip.appendChild(mapDiv);
						}
						if (!map) {
							map = L.map(mapDiv).setView([lat, lon], 10);
							L.tileLayer(
								"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
								{
									attribution: "&copy; OpenStreetMap contributors",
								}
							).addTo(map);
						} else {
							map.setView([lat, lon], 10);
						}
						L.marker([lat, lon]).addTo(map).bindPopup(destVal).openPopup();
					} else {
						alert("Location not found. Please try another destination.");
					}
				});
		});
		addDate.addEventListener("click", function(){ 
			let dateModal = document.createElement("div");
			dateModal.classList.add("custom-modal");
			dateModal.innerHTML = `
			<h2>Add dates or Trip Length</h2>
			<div id="date-options">
			<button>Dates(MM/DD)</button>
			<button>Trip Length</button>
			</div>
			<div id="months">
			<img src="../Assets/icons/back-svgrepo-com.svg">
			<h4>Month</h4>
			<img src="../Assets/icons/next-svgrepo-com.svg>
			</div>
			<div id="weekdays">
				<div>S</div>
				<div>M</div>
				<div>T</div>
				<div>W</div>
				<div>T</div>
				<div>F</div>
				<div>S</div>
			</div>
			<hr>
			`;
			overlay.appendChild(modal);
			document.body.appendChild(overlay);
		});
	});
});
const imageSelector = (destination, image) => {
	if (destination.textContent.toLowerCase() === "spain") {
		image.src = "../Assets/images/logan-armstrong-hVhfqhDYciU-unsplash.jpg";
	} else if (destination.textContent.toLowerCase() === "united kingdom") {
		image.src = "../Assets/images/marcin-nowak-iXqTqC-f6jI-unsplash.jpg"
	}
};
