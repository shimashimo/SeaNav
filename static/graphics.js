let iDistance = 0;
let iAngle = 0;

var s1 = function( sketch ) {
    sketch.setup = function() {
        let radar = sketch.createCanvas(1920, 1080);
        sketch.smooth();
        radar.parent('radar');
    }
    sketch.draw = function() {
        iDistance = Math.random()*100;
        console.log(iDistance);
        sketch.fill(98,245,31);
        sketch.noStroke();
        sketch.fill(0,4); 
        sketch.rect(0, 0, sketch.width, 1010); 

        sketch.fill(98,245,31); // green color

        sketch.drawRadar();
        sketch.drawLine();
        sketch.drawObject();
        sketch.drawText();

        if(iAngle == 360) {
            iAngle = 0;
        } else {
            iAngle++;
        }
        // console.log("loop start");
    }

    sketch.drawRadar = function() {
        sketch.push();
        sketch.translate(sketch.width / 2, 1000);
        sketch.noFill();
        sketch.strokeWeight(2);
        sketch.stroke(98,245,31);
        // draws  the arc lines
        sketch.arc(0,0,1800,1800,sketch.PI,sketch.TWO_PI);
        sketch.arc(0,0,1400,1400,sketch.PI,sketch.TWO_PI);
        sketch.arc(0,0,1000,1000,sketch.PI,sketch.TWO_PI);
        sketch.arc(0,0,600,600,sketch.PI,sketch.TWO_PI);
        // draws the angle lines
        sketch.line(-960,0,960,0);
        sketch.line(0,0,-960*sketch.cos(sketch.radians(30)),-960*sketch.sin(sketch.radians(30)));
        sketch.line(0,0,-960*sketch.cos(sketch.radians(60)),-960*sketch.sin(sketch.radians(60)));
        sketch.line(0,0,-960*sketch.cos(sketch.radians(90)),-960*sketch.sin(sketch.radians(90)));
        sketch.line(0,0,-960*sketch.cos(sketch.radians(120)),-960*sketch.sin(sketch.radians(120)));
        sketch.line(0,0,-960*sketch.cos(sketch.radians(150)),-960*sketch.sin(sketch.radians(150)));
        sketch.line(-960*sketch.cos(sketch.radians(30)),0,960,0);
        sketch.pop();
    }

    sketch.drawLine = function() {
        sketch.push();
        sketch.strokeWeight(9);
        sketch.stroke(30,250,60);
        sketch.translate(960,1000); // moves the starting coordinats to new location
        sketch.line(0,0,950*sketch.cos(sketch.radians(iAngle)),-950*sketch.sin(sketch.radians(iAngle))); // draws the line according to the angle
        sketch.pop();
      }

    sketch.drawObject = function() {
        sketch.push();
        sketch.translate(960,1000); // moves the starting coordinats to new location
        sketch.strokeWeight(9);
        sketch.stroke(255,10,10); // red color
        pixsDistance = iDistance*22.5; // covers the distance from the sensor from cm to pixels
        // limiting the range to 40 cms
        if(iDistance<40 && iAngle > 87 && iAngle < 93){
          // draws the object according to the angle and the distance
            // sketch.line(pixsDistance*sketch.cos(sketch.radians(iAngle)),-pixsDistance*sketch.sin(sketch.radians(iAngle)),950*sketch.cos(sketch.radians(iAngle)),-950*sketch.sin(sketch.radians(iAngle)));
            for(let i = 87; i < 93; i++) {
                sketch.line(pixsDistance*sketch.cos(sketch.radians(i)),-pixsDistance*sketch.sin(sketch.radians(i)),950*sketch.cos(sketch.radians(i)),-950*sketch.sin(sketch.radians(i)));
            }
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
        sketch.rect(0, 1010, sketch.width, 1080);
        sketch.fill(98,245,31);
        sketch.textSize(25);
        sketch.text("10cm",1180,990);
        sketch.text("20cm",1380,990);
        sketch.text("30cm",1580,990);
        sketch.text("40cm",1780,990);
        sketch.textSize(40);
        sketch.text("Object: " + noObject, 240, 1050);
        sketch.text("Angle: " + iAngle +" °", 1050, 1050);
        sketch.text("Distance: ", 1380, 1050);
        if(iDistance<40) {
            sketch.text("        " + iDistance +" cm", 1400, 1050);
        }
        sketch.textSize(25);
        sketch.fill(98,245,60);
        sketch.translate(961+960*sketch.cos(sketch.radians(30)),982-960*sketch.sin(sketch.radians(30)));
        sketch.rotate(-sketch.radians(-60));
        sketch.text("30°",0,0);
        sketch.resetMatrix();
        sketch.translate(954+960*sketch.cos(sketch.radians(60)),984-960*sketch.sin(sketch.radians(60)));
        sketch.rotate(-sketch.radians(-30));
        sketch.text("60°",0,0);
        sketch.resetMatrix();
        sketch.translate(945+960*sketch.cos(sketch.radians(90)),990-960*sketch.sin(sketch.radians(90)));
        sketch.rotate(sketch.radians(0));
        sketch.text("90°",0,0);
        sketch.resetMatrix();
        sketch.translate(935+960*sketch.cos(sketch.radians(120)),1003-960*sketch.sin(sketch.radians(120)));
        sketch.rotate(sketch.radians(-30));
        sketch.text("120°",0,0);
        sketch.resetMatrix();
        sketch.translate(940+960*sketch.cos(sketch.radians(150)),1018-960*sketch.sin(sketch.radians(150)));
        sketch.rotate(sketch.radians(-60));
        sketch.text("150°",0,0);
        sketch.pop(); 
      }
  };
  
// create a new instance of p5 and pass in the function for sketch 1
new p5(s1);