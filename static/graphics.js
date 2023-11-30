let radius = 200;
let lines = [1, 5, 10]; // Distances in meters
let angle = 90; // Initial angle for the sweeping line
let iDistance = Math.random()*100;
let iAngle = 90;

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
        // console.log("loop start");
        sketch.translate(sketch.width / 2, sketch.height);
        
        for (let i = 0; i < lines.length; i++) {
            let r = lines[i] * 20; // Convert meters to pixels (20 pixels per meter)
            sketch.drawSemiCircle(r); // Draw semi-circle at specified distances
            sketch.drawRadius(r); // Draw single radius line
            sketch.drawDistanceLabels(r, lines[i]); // Display distance labels
        }
        sketch.drawFadingLines(); // Draw fading radial lines
        sketch.drawCircumference(); // Draw the circumference

        //sketch.drawObject();
        sketch.stroke(255, 10, 10);
        sketch.circle(0,0, 1000);
        angle += 1; // Increment angle for the sweeping lines
    }
    sketch.drawSemiCircle = function(r) {
        sketch.arc(0, 0, r * 2, r * 2, 180, 360); // Draw semi-circle
    }
  
    sketch.drawCircle = function(r) {
      sketch.arc(0, 0, r * 2, r * 2, 360, 360); // Draw semi-circle
  }
      
    sketch.drawRadius = function(r) {
        sketch.line(0, 0, 0, -r); // Draw single radius line
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
          if(lines[i] == 1) {
            sketch.text(25 + 'cm', 0, -r-10);
          } else if(lines[i] == 5) {
            sketch.text(200 + 'cm', 0, -r-10);
          }
          else if (lines[i] == 10) {
            sketch.text(600 + 'cm', 0, -r-10);
          }
        //   sketch.text(lines[i]*2+23 + 'cm', 0, -r-10); // Display distance labels above the semi-circle
        }
    }

    sketch.drawObject = function() {
        sketch.push();
        sketch.translate(sketch.width / 2, sketch.height); // moves the starting coordinates to a new location
        sketch.strokeWeight(2);
        sketch.stroke(255, 10, 10); // red color
        pixsDistance = iDistance * 22.5; // converts the distance from the sensor from cm to pixels
        // limiting the range to 40 cms
        // console.log("here")
        if (iDistance < 200) {
            let x = 0; // x-coordinate for square (center)
            let y = -100; // y-coordinate for square (top center)
            sketch.square(x, y, 20); // draw a square at the calculated coordinates
        }
        sketch.translate(sketch.width / 2, sketch.height);
        sketch.square(500, 500, 5000);
        sketch.pop();
    }
  };
  
// create a new instance of p5 and pass in the function for sketch 1
new p5(s1);