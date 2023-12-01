let iDistance = 0;
let iAngle = 0;

var s1 = function( sketch ) {
    sketch.setup = function() {
        let radar = sketch.createCanvas(480, 280);
        // sketch.smooth();
        radar.parent('radar');
    }
    sketch.draw = function() {
        iDistance = 31;

        if(iAngle == 360) {
            iAngle = 0;
        } else {
            iAngle++;
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