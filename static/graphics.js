var Euler = {heading: 180.0, pitch: -40.0, roll: 45.0};  // Global Var of IMU orientaion data
// Listen for SSE messages and process the data
window.addEventListener('message', function(event) {
  if (event.data) {
    console.log(event.data);
    const data = JSON.parse(event.data);
    if (data.Orientation) {
      // Process Orientation data
      Euler.heading = data.Orientation[0];
      Euler.pitch = data.Orientation[1];
      Euler.roll = data.Orientation[2];
    }
    if (data.Quaternion) {
      // Process Quaternion data
     
    }
    if (data.Calibration) {
      // Process Calibration data
    }

    // Pass the data to a processing function
    console.log(Euler);
  } else{
    console.log("Not getting SSE data");
  }
});

var s2 = function( sketch ) {

    sketch.setup = function() {
        let model = sketch.createCanvas(400, 400, sketch.WEBGL);
        model.parent('model');
    }
    sketch.draw = function() {
        sketch.background(64);

        sketch.push();
        // draw main body in red
        sketch.fill(255, 0, 0);
    
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


function draw_imu() {
    background(64);

    push();
    // draw main body in red
    fill(255, 0, 0);

    rotateY(sketch.radians(-Euler.heading));
    rotateX(sketch.radians(Euler.pitch));
    rotateZ(sketch.radians(-Euler.roll));

    box(10, 10, 200);

    // draw wings in green
    fill(0, 255, 0);
    beginShape(sketch.TRIANGLES);
    vertex(-100, 2, 30);
    vertex(0, 2, -80);
    vertex(100, 2, 30);  // wing top layer

    vertex(-100, -2, 30);
    vertex(0, -2, -80);
    vertex(100, -2, 30);  // wing bottom layer
    endShape();

    // draw wing edges in slightly darker green
    fill(0, 192, 0);
    beginShape(sketch.TRIANGLES);
    vertex(-100, 2, 30);  // No quads so use 2 triangles to cover wing edges
    vertex(-100, -2, 30);
    vertex(  0, 2, -80);
    
    vertex(  0, 2, -80);
    vertex(  0, -2, -80);
    vertex(-100, -2, 30); // Left wing edge

    vertex( 100, 2, 30);
    vertex( 100, -2, 30);
    vertex(  0, -2, -80);

    vertex(  0, -2, -80);
    vertex(  0, 2, -80);
    vertex( 100, 2, 30);  // Right wing edge

    vertex(-100, 2, 30);
    vertex(-100, -2, 30);
    vertex(100, -2, 30);

    vertex(100, -2, 30);
    vertex(100, 2, 30);
    vertex(-100, 2, 30);  // Back wing edge
    endShape();

    // draw tail in green
    fill(0, 255, 0);
    beginShape(sketch.TRIANGLES);
    vertex(-2, 0, 98);
    vertex(-2, -30, 98);
    vertex(-2, 0, 70);  // tail left layer

    vertex( 2, 0, 98);
    vertex( 2, -30, 98);
    vertex( 2, 0, 70);  // tail right layer
    endShape();

    // draw tail edges in slightly darker green
    fill(0, 192, 0);
    beginShape(sketch.TRIANGLES);
    vertex(-2, 0, 98);
    vertex(2, 0, 98);
    vertex(2, -30, 98);

    vertex(2, -30, 98);
    vertex(-2, -30, 98);
    vertex(-2, 0, 98);  // tail back edge

    vertex(-2, 0, 98);
    vertex(2, 0, 98);
    vertex(2, 0, 70);

    vertex(2, 0, 70);
    vertex(-2, 0, 70);
    vertex(-2, 0, 98);  // tail front edge
    
    vertex(-2, -30, 98);
    vertex(2, -30, 98);
    vertex(2, 0, 70);

    vertex(2, 0, 70);
    vertex(-2, 0, 70);
    vertex(-2, -30, 98);
    endShape();

    pop();
}


let radius = 200;
let lines = [1, 5, 10]; // Distances in meters
let angle = 0; // Initial angle for the sweeping line

var s1 = function( sketch ) {
    sketch.setup = function() {
        let radar = sketch.createCanvas(400, 225);
        sketch.angleMode(sketch.DEGREES);
        sketch.noFill();
        sketch.stroke(255);
        radar.parent('radar');
    }
    sketch.draw = function() {
        sketch.background(0);

        sketch.translate(sketch.width / 2, sketch.height);
        

        for (let i = 0; i < lines.length; i++) {
            let r = lines[i] * 20; // Convert meters to pixels (20 pixels per meter)
            sketch.drawSemiCircle(r); // Draw semi-circle at specified distances
            sketch.drawRadius(r); // Draw single radius line
            sketch.drawDistanceLabels(r, lines[i]); // Display distance labels
        }

        sketch.drawCircumference(); // Draw the circumference
        sketch.drawFadingLines(); // Draw fading radial lines
        angle += 1; // Increment angle for the sweeping lines
    }
    sketch.drawSemiCircle = function(r) {
        sketch.arc(0, 0, r * 2, r * 2, 180, 360); // Draw semi-circle
    }
      
    sketch.drawRadius = function(r) {
        sketch.line(0, 0, 0, -r); // Draw single radius line
    }
      
    sketch.drawDistanceLabel = function(r, distance) {
       sketch.textSize(12);
        sketch.textAlign(sketch.RIGHT, sketch.CENTER);
        sketch.text(distance + 'm', -5, -r); // Display distance labels
    }
      
    sketch.drawCircumference = function() {
        sketch.noFill();
        sketch.ellipse(0, 0, radius * 2); // Draw the circumference
      
        for(let i = -60; i <= 60; i+=30){
          sketch.drawLineAtAngle(i);
        }
    }
      
    sketch.drawLineAtAngle = function(degrees) {
          let x1 = (radius+10) * sketch.cos(degrees);
          let y1 = (radius+10) * sketch.sin(degrees);
          let x2 = (radius+10) * sketch.cos(degrees + 180);
          let y2 = (radius+10) * sketch.sin(degrees + 180);
          sketch.line(x1, y1, x2, y2);
    }
      
    sketch.drawFadingLines = function() {
        for (let i = 0; i <= 90; i++) {
          let alpha = sketch.map(i, 0, 180, 0, 255); // Reverse fading effect
          sketch.stroke(0, 255, 0, alpha); // Green color with alpha
          let x = radius * sketch.cos(i + angle);
          let y = radius * sketch.sin(i + angle);
          sketch.line(0, 0, x, y); // Draw the fading radial lines
        }
    }
      
    sketch.drawDistanceLabels = function() {
        sketch.textSize(12);
        sketch.textAlign(sketch.CENTER, sketch.CENTER);
        for (let i = 0; i < lines.length; i++) {
          let r = lines[i] * 20; // Convert meters to pixels (20 pixels per meter)
          sketch.text(lines[i] + 'm', 0, -r-10); // Display distance labels above the semi-circle
        }
    }
  };
  
// create a new instance of p5 and pass in the function for sketch 1
new p5(s1);