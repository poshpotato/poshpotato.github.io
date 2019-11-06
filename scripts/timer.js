var time = -1
function timer(interval) {
    console.log("Time.");
    time += 1;
    console.log(Math.round(time));
    document.getElementById("timerOutput").innerHTML = time
    document.getElementById("timerButton").className = "void"
    setTimeout(function() {timer(interval);}, interval)
}
