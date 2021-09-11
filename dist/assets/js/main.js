
import { Timer } from './Timer.js'
import { Slideshow } from './Slideshow.js'

let t = new Timer()

function timer() {
    return "" + (st ? new Date().getTime() - st : 0) + " ms";
}

var configSlideshow = {
    dataUrl: "assets/data/Pricing Catalog.csv",
    templateUrl: "assets/templates/templates.html"
};
t.showTime("new Slideshow before");

//console.log("init before " + ++count + ": " + timer());

var ss = new Slideshow(configSlideshow, start, t);

t.showTime("new Slideshow after");

function start() {
    t.showTime("'start' before");

     ss.loadImages({
        target: document.getElementById("outer")
    });

    t.showTime("'start' after");

}


