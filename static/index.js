
// Display an error toast notification
iziToast.error({
    title: 'Error',
    message: 'Error occurred!',
    timeout: 5000, // Auto-closes after 3 seconds
    position: 'topLeft',
});


var coCtx = document.getElementById('depthChart').getContext('2d');

var coChart = createChart(coCtx, 'Depth', 'blue');

function createChart(ctx, label, color) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: label,
                data: [],
                borderColor: color,
                borderWidth: 1,
                fill: false,
                showLine: true,
                pointRadius: 4,
                pointHoverRadius: 6,
                lineTension: 0.1,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            title: {
                display: true,
                text: 'Real-Time ' + label + ' Data'
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Depth [m]'
                    },
                }
            }
        }
    });
}

function realTimeFormat(num){
    return (Math.round(num * 100) / 100).toFixed(2);
}

var evtSource = new EventSource('/stream-sensor-data');
evtSource.onmessage = function(event) {
    // Parse JSON formatted data
    var data = JSON.parse(event.data);
    // Add all real-time values to the table
    

    // Time
    document.getElementById("time").textContent = realTimeFormat(parseFloat(data["p_time"]));
    // Ultrasonic Sensor
    var distance = parseFloat(data["d_distance"])
    document.getElementById("distance").textContent = distance > 25 && distance < 650 ? distance : "Out of Range";
    // IMU Sensor
    document.getElementById("xAngularVelocity").textContent = realTimeFormat(parseFloat(data["i_ang_x"]));
    document.getElementById("yAngularVelocity").textContent = realTimeFormat(parseFloat(data["i_ang_y"]));
    document.getElementById("zAngularVelocity").textContent = realTimeFormat(parseFloat(data["i_ang_z"]));
    document.getElementById("xAcceleration").textContent = realTimeFormat(parseFloat(data["i_acc_x"]));
    document.getElementById("yAcceleration").textContent = realTimeFormat(parseFloat(data["i_acc_y"]));
    document.getElementById("zAcceleration").textContent = realTimeFormat(parseFloat(data["i_acc_z"]));
    // Pressure Sensor
    document.getElementById("depth").textContent = realTimeFormat(parseFloat(data["p_depth"]));
    document.getElementById("pressure").textContent = realTimeFormat(parseFloat(data["p_pressure"]));
    document.getElementById("p-temperature").textContent = realTimeFormat(parseFloat(data["p_temperature"]));

};
//     var timestamp = new Date().toLocaleTimeString();

//     // Check if 'CO' value reaches a certain number (example: 0.5)
//     if (parseFloat(data["CO:"]) >= 3.55) {
//         new Toast({
//             message: 'CO: Carbon Monoxide is too high!' + "\nAt:&nbsp" + timestamp,
//             type: 'danger'
//         });
//     }

//     // Check if 'NO2' value reaches a certain number (example: 0.15)
//     if (parseFloat(data["N02:"]) >= 0.15) {
//         new Toast({
//             message: 'N02: Nitrogen Oxide is getting too high!' + "\nAt:&nbsp" + timestamp,
//             type: 'danger'
//         });
//     }

//     // Check if 'NH3' value reaches a certain number (example: 10)
//     if (parseFloat(data["NH3:"]) >= 13) {
//         new Toast({
//             message: 'NH3: Ammonia levels are too high!' + "\nAt:&nbsp" + timestamp,
//             type: 'danger'
//         });
//     }

//     if(coChart.data.datasets[0].data.length > 15) {
//         coChart.data.labels.shift(timestamp);
//         coChart.data.datasets[0].data.shift();
//         coChart.update();

//         no2Chart.data.labels.shift(timestamp);
//         no2Chart.data.datasets[0].data.shift();
//         no2Chart.update();

//         nh3Chart.data.labels.shift(timestamp);
//         nh3Chart.data.datasets[0].data.shift();
//         nh3Chart.update();
//     }


//     coChart.data.labels.push(timestamp);
//     coChart.data.datasets[0].data.push(data["CO:"]);
//     coChart.update();

//     no2Chart.data.labels.push(timestamp);
//     no2Chart.data.datasets[0].data.push(data["N02:"]);
//     no2Chart.update();

//     nh3Chart.data.labels.push(timestamp);
//     nh3Chart.data.datasets[0].data.push(data["NH3:"]);
//     nh3Chart.update();
// };

var latitude = 48.4;
var longitude = 123.4;

var map_output = L.map('map').setView([latitude, longitude], 13); // Initialize map with a default view
var marker = L.marker([latitude, longitude]).addTo(map_output);     // Initialize map with marker

// Add a tile layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map_output);

// Function to update marker position in real time
function updateMarker(lat, lng) {
    if (!marker) {
        marker = L.marker([lat, lng]).addTo(map_output);
    } else {
        marker.setLatLng([lat, lng]);
        map_output.setView([lat, lng]);
    }
}

// Simulated real-time updates (replace this with your actual data stream)
setInterval(function() {
    getLocation();
    updateMarker(latitude, longitude);
}, 2000); // Update every 2 seconds (for demonstration)

// Get current device location data
function getLocation() {
    if (navigator.geolocation) {
      position = navigator.geolocation.getCurrentPosition(showPosition);
    }
  }
  
function showPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
}


/* JQuery*/
/* Send AJAX request for the server to execute program*/
$(document).ready(function() {
    // When the button is clicked
    $("#execIMU").click(function() {
        // Make an AJAX request to execute_program.php
        $.ajax({
                url: "/imu", // Replace with your server-side script URL
                type: "POST", // HTTP method (can be GET or POST)
                success: function(response) {
                    if(response.data == true)
                    // On successful execution, handle the response here
                        console.log("Program executed successfully.");
                    // You can do further actions with the response if needed
                    else 
                        console.log("Failed");
                },
                    error: function(xhr, status, error) {
                    // Handle errors if the request fails
                    console.error("Error executing program:", error);
                }
        });
    });
});
