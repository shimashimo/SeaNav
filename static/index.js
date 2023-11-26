
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

var evtSource = new EventSource('/stream-sensor-data');
evtSource.onmessage = function(event) {
    // Parse JSON formatted data
    // var data = JSON.parse(event.data);
    var data = [];
    // Add all real-time values to the table

    // Time
    document.getElementById("time").textContent = parseFloat(data["p_time"]) || "N/A";
    // Ultrasonic Sensor
    document.getElementById("distance").textContent = parseFloat(data["distance"]) || "N/A";
    // IMU Sensor
    document.getElementById("xAngularVelocity").textContent = parseFloat(data["name"]) || "N/A";
    document.getElementById("yAngularVelocity").textContent = parseFloat(data["name"]) || "N/A";
    document.getElementById("zAngularVelocity").textContent = parseFloat(data["name"]) || "N/A";
    document.getElementById("xAcceleration").textContent = parseFloat(data["name"]) || "N/A";
    document.getElementById("yAcceleration").textContent = parseFloat(data["name"]) || "N/A";
    document.getElementById("zAcceleration").textContent = parseFloat(data["name"]) || "N/A";
    // Pressure Sensor
    document.getElementById("depth").textContent = parseFloat(data["p_depth"]) || "N/A";
    document.getElementById("pressure").textContent = parseFloat(data["p_pressure"]) || "N/A";
    document.getElementById("p-temperature").textContent = parseFloat(data["p_temperature"]) || "N/A";

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

var map = L.map('map').setView([28.80, -97.0], 13); // Initialize map with a default view
var marker = L.marker([28.80, -97.0]).addTo(map);     // Initialize map with marker

// Add a tile layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to update marker position in real time
function updateMarker(lat, lng) {
    if (!marker) {
        marker = L.marker([lat, lng]).addTo(map);
    } else {
        marker.setLatLng([lat, lng]);
        map.setView([lat, lng]);
    }
}

/* * * * */
// Simulated real-time updates (replace this with your actual data stream)
// setInterval(function() {
//     var newLat = 28.80 + Math.random() * 0.01; // Example: Random latitude update
//     var newLng = -97.0 + Math.random() * 0.01; // Example: Random longitude update
//     updateMarker(newLat, newLng);
// }, 2000); // Update every 2 seconds (for demonstration)

/* Send AJAX request for the server to execute program*/


/* JQuery*/
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