var x_int = 0;

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
      animations: false,
      scales: {
        x: {
          type: 'realtime',
          realtime: {
            delay: 2000,
            onRefresh: chart => {       // Change function to push new data to all datasets
              chart.data.datasets[0].data.push({
                x: Date.now(),
                y: ang_x,
              }),
              chart.data.datasets[1].data.push({
                x: Date.now(),
                y: ang_y,
              }),
              chart.data.datasets[2].data.push({
                x: Date.now(),
                y: ang_z,
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
            title: {
                display: true,
                text: 'Depth [cm]',
            },
            min: 0,
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

// Radar
let iDistance = 0;
let iAngle = 0;

// IMU
var Euler = {heading: 0, pitch: 0, roll: 0};  // Global Var of IMU orientaion data
var depth_data;
const DEPTH_THRESH = 20;
const DISTANCE_THRESH = 25;

var ang_x;
var ang_y;
var ang_z;

var evtSource = new EventSource('/stream-sensor-data');
var error_timeout_flag = 0;
var warning_timeout_flag = 0;
evtSource.onmessage = function(event) {
    // Parse JSON formatted data
    var data = JSON.parse(event.data);
    // console.log(data);
    // Add all real-time values to the table

    //Depth
    depth_data = parseFloat(data["p_depth"]);
    depth_data < 0 ? depth_data = 0 : depth_data = depth_data;
    if(depth_data > DEPTH_THRESH+30 && error_timeout_flag == 0) {
        error_timeout_flag = 1;
        // Display an error toast notification
        iziToast.error({
            title: 'Danger!',
            message: 'Reached Maximum Depth!',
            timeout: 5000, // Auto-closes after 3 seconds
            position: 'topLeft',
        });
        setTimeout(function() {
            error_timeout_flag = 0;
        },5000);
    }
    if(depth_data > DEPTH_THRESH && warning_timeout_flag == 0) {
        warning_timeout_flag = 1;
        // Display an error toast notification
        iziToast.warning({
            title: 'Warning!',
            message: 'Approaching Maximum Depth!',
            timeout: 5000, // Auto-closes after 3 seconds
            position: 'topLeft',
        });
        setTimeout(function() {
            warning_timeout_flag = 0;
        },5000);
    }

    // Time
    document.getElementById("time").textContent = realTimeFormat(parseFloat(data["p_time"]));
    // Ultrasonic Sensor
    var distance = parseFloat(data["d_distance"])
    iDistance = distance;
    // console.log(iDistance);
    // document.getElementById("distance").textContent = distance > 20 && distance < 650 ? distance : "Out of Range";
    document.getElementById("distance").textContent = distance;
    if(distance < DISTANCE_THRESH && warning_timeout_flag == 0 && distance != 0) {
        warning_timeout_flag = 1;
        // Display an error toast notification
        iziToast.warning({
            title: 'Warning!',
            message: 'Collision in Bound!',
            timeout: 5000, // Auto-closes after 3 seconds
            position: 'topLeft',
        });
        setTimeout(function() {
            warning_timeout_flag = 0;
        },5000);
    }
    
    // IMU Sensor
    Euler.heading = parseFloat(data["i_qua_head"]);
    Euler.pitch =   parseFloat(data["i_qua_pitch"]);
    Euler.roll =   parseFloat(data["i_qua_roll"]);
    // ang_x = parseFloat(data["i_ang_x"]);
    // ang_y = parseFloat(data["i_ang_y"]);
    // ang_z = parseFloat(data["i_ang_z"]);

    document.getElementById("heading").textContent = realTimeFormat(Euler.heading);
    document.getElementById("pitch").textContent = realTimeFormat(Euler.pitch);
    document.getElementById("roll").textContent = realTimeFormat(Euler.roll);
    // document.getElementById("xAcceleration").textContent = realTimeFormat(parseFloat(data["i_acc_x"]));
    // document.getElementById("yAcceleration").textContent = realTimeFormat(parseFloat(data["i_acc_y"]));
    // document.getElementById("zAcceleration").textContent = realTimeFormat(parseFloat(data["i_acc_z"]));

    document.getElementById("p-cal-sys").textContent = realTimeFormat(parseFloat(data["i_cal_sys"]));
    document.getElementById("p-cal-gyro").textContent = realTimeFormat(parseFloat(data["i_cal_gyro"]));
    document.getElementById("p-cal-accel").textContent = realTimeFormat(parseFloat(data["i_cal_accel"]));
    document.getElementById("p-cal-mag").textContent = realTimeFormat(parseFloat(data["i_cal_mag"]));

    
    // Pressure Sensor
    document.getElementById("depth").textContent = realTimeFormat(parseFloat(data["p_depth"]));
    document.getElementById("pressure").textContent = realTimeFormat(parseFloat(data["p_pressure"]));
    document.getElementById("p-temperature").textContent = realTimeFormat(parseFloat(data["p_temperature"]));

    
    // console.log(Euler);
    // Euler.heading = parseFloat(data["i_ori_x"]);
    // Euler.pitch =   parseFloat(data["i_ori_y"]);
    // Euler.roll =   parseFloat(data["i_ori_z"]);
    // console.log(Euler.heading);

};
//     var timestamp = new Date().toLocaleTimeString();
var s2 = function( sketch ) {

    sketch.setup = function() {
        let model = sketch.createCanvas(450, 260, sketch.WEBGL);
        sketch.angleMode(sketch.RADIANS);
        model.parent('model');
    }
    sketch.draw = function() {
        sketch.background(64);

        sketch.push();
        // draw main body in red
        sketch.fill(255, 0, 0);
    
        sketch.rotateY(sketch.radians(Euler.heading));
        sketch.rotateX(sketch.radians(Euler.pitch));
        sketch.rotateZ(sketch.radians(Euler.roll));
    
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


 
 var s1 = function( sketch ) {
     sketch.setup = function() {
         let radar = sketch.createCanvas(480, 280);
         // sketch.smooth();
         radar.parent('radar');
     }
     sketch.draw = function() {
         if(iAngle == 360) {
             iAngle = 0;
         } else {
             iAngle += 2;
         }
 
         sketch.fill(98,245,31);
         sketch.noStroke();
         sketch.fill(0,4); 
         sketch.rect(0, 0, sketch.width, sketch.height+sketch.height*0.065); 
 
         sketch.fill(98,245,31); // green color
 
         sketch.drawRadar();
         sketch.drawLine();
         sketch.drawObject();
         sketch.drawText();
     }
 
     sketch.drawRadar = function() {
         sketch.push();
         sketch.translate(sketch.width/2,sketch.height-sketch.height*0.074); // moves the starting coordinats to new location
         sketch.noFill();
         sketch.strokeWeight(2);
         sketch.stroke(98,245,31);
         // draws  the arc lines
         sketch.arc(0,0,(sketch.width-sketch.width*0.0625),(sketch.width-sketch.width*0.0625),sketch.PI,sketch.TWO_PI);
         sketch.arc(0,0,(sketch.width-sketch.width*0.27),(sketch.width-sketch.width*0.27),sketch.PI,sketch.TWO_PI);
         sketch.arc(0,0,(sketch.width-sketch.width*0.479),(sketch.width-sketch.width*0.479),sketch.PI,sketch.TWO_PI);
         sketch.arc(0,0,(sketch.width-sketch.width*0.687),(sketch.width-sketch.width*0.687),sketch.PI,sketch.TWO_PI);
         // draws the angle lines
         sketch.line(-sketch.width/2,0,sketch.width/2,0);
         sketch.line(0,0,(-sketch.width/2)*sketch.cos(sketch.radians(30)),(-sketch.width/2)*sketch.sin(sketch.radians(30)));
         sketch.line(0,0,(-sketch.width/2)*sketch.cos(sketch.radians(60)),(-sketch.width/2)*sketch.sin(sketch.radians(60)));
         sketch.line(0,0,(-sketch.width/2)*sketch.cos(sketch.radians(90)),(-sketch.width/2)*sketch.sin(sketch.radians(90)));
         sketch.line(0,0,(-sketch.width/2)*sketch.cos(sketch.radians(120)),(-sketch.width/2)*sketch.sin(sketch.radians(120)));
         sketch.line(0,0,(-sketch.width/2)*sketch.cos(sketch.radians(150)),(-sketch.width/2)*sketch.sin(sketch.radians(150)));
         sketch.line((-sketch.width/2)*sketch.cos(sketch.radians(30)),0,sketch.width/2,0);
         sketch.pop();
     }
 
     sketch.drawLine = function() {
         sketch.push();
         sketch.strokeWeight(9);
         sketch.stroke(30,250,60);
         sketch.translate(sketch.width/2,sketch.height-sketch.height*0.074); // moves the starting coordinats to new location
         sketch.line(0,0,(sketch.height-sketch.height*0.12)*sketch.cos(sketch.radians(iAngle)),-(sketch.height-sketch.height*0.12)*sketch.sin(sketch.radians(iAngle))); // draws the line according to the angle
         sketch.pop();
       }
 
     sketch.drawObject = function() {
         sketch.push();
         sketch.translate(sketch.width/2,sketch.height-sketch.height*0.074); // moves the starting coordinats to new location
         sketch.strokeWeight(9);
         sketch.stroke(255,10,10); // red color
         pixsDistance = iDistance*(sketch.height-sketch.height*0.1666)*0.025; // covers the distance from the sensor from cm to pixels
         // limiting the range to 40 cms
         if(iDistance < 40 && iAngle > 87 && iAngle < 93){
           // draws the object according to the angle and the distance
             sketch.line(pixsDistance*sketch.cos(sketch.radians(iAngle)),-pixsDistance*sketch.sin(sketch.radians(iAngle)),950*sketch.cos(sketch.radians(iAngle)),-950*sketch.sin(sketch.radians(iAngle)));
         }
         sketch.pop();
       }
       
     sketch.drawText = function() { // draws the texts on the screen
   
         sketch.push();
         if(iDistance>40) {
             noObject = "Out of Range";
         }
         else {
             noObject = "In Range";
         }
         sketch.fill(0,0,0);
         sketch.noStroke();
         sketch.rect(0, sketch.height-sketch.height*0.0648, sketch.width, sketch.height)
         sketch.fill(98,245,31);
         sketch.textSize(12);
         sketch.text("10cm",sketch.width-sketch.width*0.3854,sketch.height-sketch.height*0.0833);
         sketch.text("20cm",sketch.width-sketch.width*0.281,sketch.height-sketch.height*0.0833);
         sketch.text("30cm",sketch.width-sketch.width*0.177,sketch.height-sketch.height*0.0833);
         sketch.text("40cm",sketch.width-sketch.width*0.0729,sketch.height-sketch.height*0.0833);
         // sketch.textSize(12);
         // sketch.text("Object: " + noObject, sketch.width-sketch.width*0.875, sketch.height-sketch.height*0.0277);
         // sketch.text("Angle: " + iAngle +" °", sketch.width-sketch.width*0.48, sketch.height-sketch.height*0.0277);
         // sketch.text("Distance: ", sketch.width-sketch.width*0.26, sketch.height-sketch.height*0.0277);
         // if(iDistance<40) {
         //     sketch.text("        " + iDistance +" cm", sketch.width-sketch.width*0.225, sketch.height-sketch.height*0.0277);
         // }
         sketch.textSize(12);
         sketch.fill(98,245,60);
         sketch.translate((sketch.width-sketch.width*0.4994)+sketch.width/2*sketch.cos(sketch.radians(30)),(sketch.height-sketch.height*0.0907)-sketch.width/2*sketch.sin(sketch.radians(30)));
         sketch.rotate(-sketch.radians(-60));
         sketch.text("30°",0,0);
         sketch.resetMatrix();
         sketch.translate((sketch.width-sketch.width*0.503)+sketch.width/2*sketch.cos(sketch.radians(60)),(sketch.height-sketch.height*0.0888)-sketch.width/2*sketch.sin(sketch.radians(60)));
         sketch.rotate(-sketch.radians(-30));
         sketch.text("60°",0,0);
         sketch.resetMatrix();
         sketch.translate((sketch.width-sketch.width*0.507)+sketch.width/2*sketch.cos(sketch.radians(90)),(sketch.height-sketch.height*0.0833)-sketch.width/2*sketch.sin(sketch.radians(90)));
         sketch.rotate(sketch.radians(0));
         sketch.text("90°",0,0);
         sketch.resetMatrix();
         sketch.translate(sketch.width-sketch.width*0.513+sketch.width/2*sketch.cos(sketch.radians(120)),(sketch.height-sketch.height*0.07129)-sketch.width/2*sketch.sin(sketch.radians(120)));
         sketch.rotate(sketch.radians(-30));
         sketch.text("120°",0,0);
         sketch.resetMatrix();
         sketch.translate((sketch.width-sketch.width*0.5104)+sketch.width/2*sketch.cos(sketch.radians(150)),(sketch.height-sketch.height*0.0574)-sketch.width/2*sketch.sin(sketch.radians(150)));
         sketch.rotate(sketch.radians(-60));
         sketch.text("150°",0,0);
         sketch.pop(); 
       }
   };
   
 // create a new instance of p5 and pass in the function for sketch 1
 new p5(s1);



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
