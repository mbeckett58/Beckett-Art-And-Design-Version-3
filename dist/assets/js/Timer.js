export class Timer {

     constructor() {
        this.count = 0;
        this.st = new Date().getTime();
    }

    showTime = function (message) {
        console.log(message + " " + ++this.count + ": "
            + (this.st ? new Date().getTime() - this.st : 0) + " ms");
    }

}
