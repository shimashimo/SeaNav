
const imuConfig = {
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
              chart.data.datasets[0].data.push({
                x: Date.now(),
                y: Math.random(),
              })
            }
          }
        }
      }
    }
};

const imuChart = new Chart(
    document.getElementById('imuChart'),
    imuConfig
);

const depthConfig = {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Depth',
          backgroundColor: 'rgba(10, 100, 255, 0.5)',
          borderColor: 'rgb(0, 100, 255)',
          fill: false,
          data: []
        },
        // {
        //   label: 'Pressure',
        //   backgroundColor: 'rgba(54, 162, 235, 0.5)',
        //   borderColor: 'rgb(154, 122, 135)',
        //   cubicInterpolationMode: 'monotone',
        //   fill: false,
        //   data: []
        // },
      ]
    },
    options: {
      scales: {
        x: {
          type: 'realtime',
          realtime: {
            delay: 2000,
            onRefresh: chart => {       // Change function to push new data to all datasets
              chart.data.datasets[0].data.push({x: Date.now(), y: depth_data});
            //   chart.data.datasets[1].data.push({x: Date.now(), y: pressure_data});
            }
          }
        },
        y: {
            reverse: true,
        }
      }
    }
}

const depthChart = new Chart(
    document.getElementById('depthChart').getContext('2d'),
    depthConfig
);

// var depthChart = createChart(depthCtx, 'Depth', 'blue');

function realTimeFormat(num){
    return (Math.round(num * 100) / 100).toFixed(2);
}

  

var Euler = {heading: 0, pitch: 0, roll: 0};  // Global Var of IMU orientaion data
var depth_data;
const DEPTH_THRESH = 0.90;
const DISTANCE_THRESH = 25;
// var pressure_data;

var evtSource = new EventSource('/stream-sensor-data');
var timeout_flag = 0;
evtSource.onmessage = function(event) {
    // Parse JSON formatted data
    var data = JSON.parse(event.data);
    // Add all real-time values to the table

    //Depth
    depth_data = parseFloat(data["p_depth"]);
    if(depth_data > DEPTH_THRESH && timeout_flag == 0) {
        timeout_flag = 1;
        // Display an error toast notification
        iziToast.error({
            title: 'Warning!',
            message: 'Reaching Maximum Depth!',
            timeout: 5000, // Auto-closes after 3 seconds
            position: 'topLeft',
        });
        setTimeout(function() {
            timeout_flag = 0;
        },5000);
    }
    // pressure_data = parseFloat(data["p_pressure"])

    // Time
    document.getElementById("time").textContent = realTimeFormat(parseFloat(data["p_time"]));
    // Ultrasonic Sensor
    var distance = parseFloat(data["d_distance"])
    // document.getElementById("distance").textContent = distance > 20 && distance < 650 ? distance : "Out of Range";
    document.getElementById("distance").textContent = distance;
    if(distance < DISTANCE_THRESH && timeout_flag == 0) {
        timeout_flag = 1;
        // Display an error toast notification
        iziToast.error({
            title: 'Warning!',
            message: 'Collision Bound!',
            timeout: 5000, // Auto-closes after 3 seconds
            position: 'topLeft',
        });
        setTimeout(function() {
            timeout_flag = 0;
        },5000);
    }
    
    // IMU Sensor
    document.getElementById("xAngularVelocity").textContent = realTimeFormat(parseFloat(data["i_ang_x"]));
    document.getElementById("yAngularVelocity").textContent = realTimeFormat(parseFloat(data["i_ang_y"]));
    document.getElementById("zAngularVelocity").textContent = realTimeFormat(parseFloat(data["i_ang_z"]));
    document.getElementById("xAcceleration").textContent = realTimeFormat(parseFloat(data["i_ori_x"]));
    document.getElementById("yAcceleration").textContent = realTimeFormat(parseFloat(data["i_ori_y"]));
    document.getElementById("zAcceleration").textContent = realTimeFormat(parseFloat(data["i_ori_z"]));

    document.getElementById("p-cal-sys").textContent = realTimeFormat(parseFloat(data["i_cal_sys"]));
    document.getElementById("p-cal-gyro").textContent = realTimeFormat(parseFloat(data["i_cal_gyro"]));
    document.getElementById("p-cal-accel").textContent = realTimeFormat(parseFloat(data["i_cal_accel"]));
    document.getElementById("p-cal-mag").textContent = realTimeFormat(parseFloat(data["i_cal_mag"]));

    
    // Pressure Sensor
    document.getElementById("depth").textContent = realTimeFormat(parseFloat(data["p_depth"]));
    document.getElementById("pressure").textContent = realTimeFormat(parseFloat(data["p_pressure"]));
    document.getElementById("p-temperature").textContent = realTimeFormat(parseFloat(data["p_temperature"]));

    // Euler.heading = parseFloat(data["i_qua_head"]);
    // Euler.pitch =   parseFloat(data["i_qua_roll"]);
    // Euler.roll =   -parseFloat(data["i_qua_pitch"]);

    Euler.heading = parseFloat(data["i_ori_x"]);
    Euler.pitch =   parseFloat(data["i_ori_y"]);
    Euler.roll =   parseFloat(data["i_ori_z"]);

};
//     var timestamp = new Date().toLocaleTimeString();
var s2 = function( sketch ) {

    sketch.setup = function() {
        let model = sketch.createCanvas(450, 260, sketch.WEBGL);
        model.parent('model');
    }
    sketch.draw = function() {
        sketch.background(64);

        sketch.push();
        // draw main body in red
        sketch.fill(255, 0, 0);
    
        // sketch.rotateY(sketch.radians(-Euler.heading));
        // sketch.rotateX(sketch.radians(Euler.pitch));
        // sketch.rotateZ(sketch.radians(-Euler.roll));
    
        sketch.rotateY(sketch.radians(-Euler.heading));
        sketch.rotateX(sketch.radians(Euler.pitch));
        sketch.rotateZ(sketch.radians(-Euler.roll));

        sketch.box(10, 10, 200);
    
        // draw wings in green
        sketch.fill(0, 255, 0);
        sketch.beginShape(sketch.TRIANGLES);
        sketch.vertex(-100, 2, 30);
        sketch.vertex(0, 2, -80);
        sketch.vertex(100, 2, 30);  // wing top layer
    
        sketch.vertex(-100, -2, 30);
        sketch.vertex(0, -2, -80);
        sketch.vertex(100, -2, 30);  // wing bottom layer
        sketch.endShape();
    
        // draw wing edges in slightly darker green
        sketch.fill(0, 192, 0);
        sketch.beginShape(sketch.TRIANGLES);
        sketch.vertex(-100, 2, 30);  // No quads so use 2 triangles to cover wing edges
        sketch.vertex(-100, -2, 30);
        sketch.vertex(  0, 2, -80);
        
        sketch.vertex(  0, 2, -80);
        sketch.vertex(  0, -2, -80);
        sketch.vertex(-100, -2, 30); // Left wing edge
    
        sketch.vertex( 100, 2, 30);
        sketch.vertex( 100, -2, 30);
        sketch.vertex(  0, -2, -80);
    
        sketch.vertex(  0, -2, -80);
        sketch.vertex(  0, 2, -80);
        sketch.vertex( 100, 2, 30);  // Right wing edge
    
        sketch.vertex(-100, 2, 30);
        sketch.vertex(-100, -2, 30);
        sketch.vertex(100, -2, 30);
    
        sketch.vertex(100, -2, 30);
        sketch.vertex(100, 2, 30);
        sketch.vertex(-100, 2, 30);  // Back wing edge
        sketch.endShape();
    
        // draw tail in green
        sketch.fill(0, 255, 0);
        sketch.beginShape(sketch.TRIANGLES);
        sketch.vertex(-2, 0, 98);
        sketch.vertex(-2, -30, 98);
        sketch.vertex(-2, 0, 70);  // tail left layer
    
        sketch.vertex( 2, 0, 98);
        sketch.vertex( 2, -30, 98);
        sketch.vertex( 2, 0, 70);  // tail right layer
        sketch.endShape();
    
        // draw tail edges in slightly darker green
        sketch.fill(0, 192, 0);
        sketch.beginShape(sketch.TRIANGLES);
        sketch.vertex(-2, 0, 98);
        sketch.vertex(2, 0, 98);
        sketch.vertex(2, -30, 98);
    
        sketch.vertex(2, -30, 98);
        sketch.vertex(-2, -30, 98);
        sketch.vertex(-2, 0, 98);  // tail back edge
    
        sketch.vertex(-2, 0, 98);
        sketch.vertex(2, 0, 98);
        sketch.vertex(2, 0, 70);
    
        sketch.vertex(2, 0, 70);
        sketch.vertex(-2, 0, 70);
        sketch.vertex(-2, 0, 98);  // tail front edge
        
        sketch.vertex(-2, -30, 98);
        sketch.vertex(2, -30, 98);
        sketch.vertex(2, 0, 70);
    
        sketch.vertex(2, 0, 70);
        sketch.vertex(-2, 0, 70);
        sketch.vertex(-2, -30, 98);
        sketch.endShape();
    
        
    }
 };
 
 // create the second instance of p5 and pass in the function for sketch 2
 new p5(s2);

// setInterval(depthChart.update(), 500); // Refresh the depth every 500ms




 /* MAP LOCATION */

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
