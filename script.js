let map;
let markers = [];
let geocoder;

function initMap() {
  // Initialize map centered on India
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 20.5937, lng: 78.9629 },
    zoom: 5,
  });

  geocoder = new google.maps.Geocoder(); 

  // Location data for custom markers
  const locations = [
    {
      name: "Taj Mahal",
      position: { lat: 27.1751, lng: 78.0421 },
      category: "Monument",
      description: "An ivory-white marble mausoleum in Agra, India.",
      image: "assets/images/tajmahal.jpg",
      icon: "assets/icons/museum.png",
    },
    {
      name: "Lalbagh Botanical Garden",
      position: { lat: 12.9507, lng: 77.5848 },
      category: "Park",
      description: "A famous botanical garden in Bangalore, India.",
      image: "assets/images/lalbagh.jpg",
      icon: "assets/icons/park.png",
    },
    {
      name: "National Museum",
      position: { lat: 28.6118, lng: 77.2197 },
      category: "Museum",
      description: "India's largest museum located in New Delhi.",
      image: "assets/images/museum.jpg",
      icon: "assets/icons/museum.png",
    },
    {
      name: "Delhi Public School",
      position: { lat: 28.6139, lng: 77.209 },
      category: "School",
      description: "One of the top schools in India.",
      image: "assets/images/school.jpg",
      icon: "assets/icons/school.png",
    },
    {
      name: "AIIMS Hospital",
      position: { lat: 28.5672, lng: 77.21 },
      category: "Hospital",
      description: "Premier medical institute in India.",
      image: "assets/images/hospital.jpg",
      icon: "assets/icons/hospital.png",
    },
  ];

  const infoWindow = new google.maps.InfoWindow();

  // Add markers
  locations.forEach((loc) => {
    const marker = new google.maps.Marker({
      position: loc.position,
      map: map,
      title: loc.name,
      icon: {
        url: loc.icon,
        scaledSize: new google.maps.Size(40, 40),
      },
    });

    marker.addListener("click", () => {
      const content = `
        <div class="info-window">
          <h3>${loc.name}</h3>
          <img src="${loc.image}" alt="${loc.name}" />
          <p><b>Category:</b> ${loc.category}</p>
          <p>${loc.description}</p>
        </div>
      `;
      infoWindow.setContent(content);
      infoWindow.open(map, marker);
    });

    markers.push({ name: loc.name.toLowerCase(), marker });
  });

  document.getElementById("searchBtn").addEventListener("click", () => {
    const query = document.getElementById("searchBox").value.trim();

    if (!query) return alert("Please enter a location!");

    const found = markers.find((m) => m.name.includes(query.toLowerCase()));
    if (found) {
      map.setCenter(found.marker.getPosition());
      map.setZoom(14);
      google.maps.event.trigger(found.marker, "click");
      return;
    }

    geocoder.geocode({ address: query }, (results, status) => {
      if (status === "OK") {
        const location = results[0].geometry.location;
        map.setCenter(location);
        map.setZoom(13);

        new google.maps.Marker({
          map: map,
          position: location,
          title: results[0].formatted_address,
        });

        infoWindow.setContent(`<b>${results[0].formatted_address}</b>`);
        infoWindow.setPosition(location);
        infoWindow.open(map);
      } else {
        alert("Location not found. Try another search.");
      }
    });
  });
}
