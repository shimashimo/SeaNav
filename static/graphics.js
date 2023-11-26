let radius = 200;
let lines = [1, 5, 10]; // Distances in meters
let angle = 0; // Initial angle for the sweeping line

function setup() {
  canvas = createCanvas(400, 225);
  canvas.parent('radar');
  angleMode(DEGREES);
  noFill();
  stroke(255);
}

function draw() {
  background(0);

  translate(width / 2, height);
  

  for (let i = 0; i < lines.length; i++) {
    let r = lines[i] * 20; // Convert meters to pixels (20 pixels per meter)
    drawSemiCircle(r); // Draw semi-circle at specified distances
    drawRadius(r); // Draw single radius line
    drawDistanceLabels(r, lines[i]); // Display distance labels
  }

  drawCircumference(); // Draw the circumference
  drawFadingLines(); // Draw fading radial lines
  angle += 1; // Increment angle for the sweeping lines
}

function drawSemiCircle(r) {
  arc(0, 0, r * 2, r * 2, 180, 360); // Draw semi-circle
}

function drawRadius(r) {
  line(0, 0, 0, -r); // Draw single radius line
}

function drawDistanceLabel(r, distance) {
  textSize(12);
  textAlign(RIGHT, CENTER);
  text(distance + 'm', -5, -r); // Display distance labels
}

function drawCircumference() {
  noFill();
  ellipse(0, 0, radius * 2); // Draw the circumference

  for(let i = -60; i <= 60; i+=30){
    drawLineAtAngle(i);
  }
}

function drawLineAtAngle(degrees) {
    let x1 = (radius+10) * cos(degrees);
    let y1 = (radius+10) * sin(degrees);
    let x2 = (radius+10) * cos(degrees + 180);
    let y2 = (radius+10) * sin(degrees + 180);
    line(x1, y1, x2, y2);
}

function drawFadingLines() {
  for (let i = 0; i <= 90; i++) {
    let alpha = map(i, 0, 180, 0, 255); // Reverse fading effect
    stroke(0, 255, 0, alpha); // Green color with alpha
    let x = radius * cos(i + angle);
    let y = radius * sin(i + angle);
    line(0, 0, x, y); // Draw the fading radial lines
  }
}

function drawDistanceLabels() {
  textSize(12);
  textAlign(CENTER, CENTER);
  for (let i = 0; i < lines.length; i++) {
    let r = lines[i] * 20; // Convert meters to pixels (20 pixels per meter)
    text(lines[i] + 'm', 0, -r-10); // Display distance labels above the semi-circle
  }
}
