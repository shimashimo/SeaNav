
// Display an error toast notification
iziToast.error({
    title: 'Error',
    message: 'Error occurred!',
    timeout: 5000, // Auto-closes after 3 seconds
    position: 'topLeft',
});

const config = {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'X Angular Velocity',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          borderDash: [8, 4],
          fill: false,
          data: []
        },
        {
          label: 'Y Angular Velocity',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
          cubicInterpolationMode: 'monotone',
          fill: false,
          data: []
        },
        {
            label: 'Z Angular Velocity',
            backgroundColor: 'rgba(155, 80, 110, 0.5)',
            borderColor: 'rgb(155, 80, 110)',
            cubicInterpolationMode: 'monotone',
            fill: false,
            data: []
          }
      ]
    },
    options: {
      scales: {
        x: {
          type: 'realtime',
          realtime: {
            delay: 2000,
            onRefresh: chart => {       // Change function to push new data to all datasets
              chart.data.datasets.forEach(dataset => {
                dataset.data.push({
                  x: Date.now(),
                  y: Math.random()  // Change this to data from SSE
                });
              });
            }
          }
        }
      }
    }
};

const imuChart = new Chart(
    document.getElementById('imuChart'),
    config
);

function createChart(ctx, label, color, data = {
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
                                                lineTension: 0.2,
                                            }]}, 
                                        config = {
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
                                                },
                                                scrollX: true
                                            }
                                        } ) {
                                            return new Chart(ctx, {
                                            type: 'line',
                                            data: data,
                                            options : config,
                                        });
}
var depthCtx = document.getElementById('depthChart').getContext('2d');
var depthChart = createChart(depthCtx, 'Depth', 'blue');

function realTimeFormat(num){
    return (Math.round(num * 100) / 100).toFixed(2);
}


// SSE simulation to mimic data reception
// function simulateSSE() {

// }
  
// document.addEventListener('DOMContentLoaded', async () => {
//     // Simulating SSE data reception
//     setInterval(simulateSSE, 1000); // Simulate SSE data every second
// });

  

var evtSource = new EventSource('/stream-sensor-data');
evtSource.onmessage = function(event) {
    // Parse JSON formatted data
    var data = JSON.parse(event.data);
    //var data = [];
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


    const event_3d = new Event('message');
    const data_3d = JSON.stringify({
      Orientation: [realTimeFormat(parseFloat(data["i_qua_head"])), realTimeFormat(parseFloat(data["i_qua_pitch"])), realTimeFormat(parseFloat(data["i_qua_roll"]))],
      Quaternion: ['0.5', '0.5', '0.5'],
      Calibration: ['1', '2','3']
    });
    event_3d.data = data_3d;
    window.dispatchEvent(event_3d);
    
};
//     var timestamp = new Date().toLocaleTimeString();

var latitude = 0;
var longitude = 0;

var map_output = L.map('map').setView([latitude, longitude], 16); // Initialize map with a default view
var marker = L.marker([latitude, longitude]).addTo(map_output);     // Initialize map with marker

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
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
