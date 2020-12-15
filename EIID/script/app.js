var html_clouds;
var html_stars;
var html_body;
var html_icon;
var html_welcomeText;

var html_rise_svg;
var html_fall_svg;

var suncalc;

var lat = 50.82803;
var long = 3.26487;

const listenToClouds = function (list) {
    for (i of list) {
        i.addEventListener("animationiteration", RandomClouds(i));
    }
}

const setSunPosition = function () {
    currentTime = new Date();

    var suncalcTimes = SunCalc.getTimes(/*Date*/ currentTime, /*Number*/ lat, /*Number*/ long /*Number (default=0)*/);

    var suncalcPosition = SunCalc.getPosition(/*Date*/ currentTime, /*Number*/ lat, /*Number*/ long /*Number (default=0)*/);

    //SET time values for sun
    setTimeValues(suncalcTimes.sunrise, suncalcTimes.sunset);

    // RESET scale 
    html_icon.style.transform = "scale(1)";

    // GET and SET altitude
    var altitude = suncalcPosition.altitude * 100;
    html_icon.style.bottom = altitude + "%";

    //GET and SET Horizontal value     
    var totalMinutes = ((suncalcTimes.sunset.getTime() - suncalcTimes.sunrise.getTime()) / 1000) / 60;

    var diff = ((currentTime.getTime() - suncalcTimes.sunrise.getTime()) / 1000) / 60;
    var percetage_timeleft = diff / totalMinutes * 100;

    html_icon.style.left = percetage_timeleft + "%"

    
    // SET Welcome Text
    html_welcomeText.innerHTML = `<h3>Good Day!</h3>
                                   <p></p>`
}

const setMoonPosition = function () {
    currentTime = new Date();
    var NextDay = currentTime.setDate(new Date().getDate()+1);

    //GET and SET MoonTimes 
    var mooncalcTimes = SunCalc.getMoonTimes(/*Date*/ currentTime, /*Number*/ lat, /*Number*/ long /*Number (default=0)*/);

    

    var mooncalcPosition = SunCalc.getMoonPosition(/*Date*/ currentTime, /*Number*/ lat, /*Number*/ long /*Number (default=0)*/);

    //SET time values for moon
    setTimeValues(mooncalcTimes.rise, mooncalcTimes.set);

    // GET and SET Vertical value
    var altitude = mooncalcPosition.altitude * 100;
    // html_icon.style.bottom = altitude + "%";
    html_icon.style.bottom = 80 + "%"
    // GET and SET size
    var scale = 410000 / mooncalcPosition.distance
    html_icon.style.transform = `scale(${scale})`;

    //GET and SET Horizontal value     
    var totalMinutes = ((mooncalcTimes.set.getTime() - mooncalcTimes.rise.getTime()) / 1000) / 60;

    var diff = ((currentTime.getTime() - mooncalcTimes.rise.getTime()) / 1000) / 60;
    var percetage_timeleft = diff / totalMinutes * 100;

    if (percetage_timeleft > 100 || percetage_timeleft < 0) {
        html_icon.style.display = "none";
    }
    else {
        html_icon.style.left = percetage_timeleft + "%"
        html_icon.style.display = "block";
    }
    


    // GET and SET Welcome Text
    var mooncalcTimesNextDay = SunCalc.getMoonTimes(/*Date*/ NextDay, /*Number*/ lat, /*Number*/ long /*Number (default=0)*/);
    var moonRise =  mooncalcTimesNextDay.rise;

    if(altitude < 0 ){
        html_welcomeText.innerHTML = `<h3>Good Evening!</h3>
        <p>It seems like there is no moon tonight it rises at <strong>${moonRise.getHours()}:${moonRise.getMinutes()}</strong> </p>`
    }
    else {
        html_welcomeText.innerHTML = `<h3>Good Evening!</h3>
                                   <p></p>`
    }
}

const setTimeValues = function (rise, fall) {
    html_rise.innerHTML = `${rise.getHours()}:${rise.getMinutes()}`;
    html_fall.innerHTML = `${fall.getHours()}:${fall.getMinutes()}`;
}



const RandomClouds = function (i) {
    let root = document.documentElement;

    // root.style.setProperty('--global-animation-duration-sm', (Math.floor(Math.random() * 10) + 20) + "s");
    // root.style.setProperty('--global-animation-duration-lg', (Math.floor(Math.random() * 25) + 70) + "s");

    if(html_body.clientWidth > 762) {
        i.style.animationDuration = (Math.floor(Math.random() * 25) + 75) + "s";
    }
    else {
        i.style.animationDuration = (Math.floor(Math.random() * 10) + 20) + "s";
    }


    i.style.transform += `rotate(${Math.floor(Math.random() * 30) - 30}deg)`;
    i.style.transform += `scale(${(Math.random() * 0.5) + 1})`;
    
    i.style.left = `-${Math.floor(Math.random() * 30) + 1}%`;
    i.style.top = `${Math.floor(Math.random() * 65) + 1}%`;

}

const RandomStars = function (list) {
    for (i of list) {
        i.style.animationDuration = `${Math.floor(Math.random() * 6) + 2}s`;
        i.style.top = `${Math.floor(Math.random() * 70) + 1}%`;
        i.style.left = `${Math.floor(Math.random() * 99) + 1}%`;
    }
}

const RefreshBody = function () {

    if (html_body.classList.contains("is-night")) {
        html_stars = document.querySelector(".js-stars").children;
        RandomStars(html_stars);
        setMoonPosition()
    }
    else {
        html_clouds = document.querySelector(".js-clouds").children;
        listenToClouds(html_clouds);
        setSunPosition();
    }

}


document.addEventListener('DOMContentLoaded', function () {
    console.log("Script Loaded!")

    html_body = document.body;
    html_icon = document.querySelector(".js-icon");
    html_welcomeText = document.querySelector(".js-welcomeText");
    html_rise_svg = document.querySelector(".js-rise_svg");
    html_fall_svg = document.querySelector(".js-fall_svg");
    html_fall = document.querySelector(".js-fall");
    html_rise = document.querySelector(".js-rise");
    

    var currentTime = new Date();

    var suncalcTimes = SunCalc.getTimes(/*Date*/ currentTime, /*Number*/ lat, /*Number*/ long /*Number (default=0)*/);

    //Add Eventlistener to button
    var sw = document.querySelectorAll(".js-switch")

    for (i of sw) {
        

        i.addEventListener("change", function () {
            if (this.value == "Day") {
                html_body.classList.remove("is-night");
                RefreshBody();
            }
            else if (this.value == "Night") {
                html_body.classList.add("is-night");
                RefreshBody();
            }
        });
    }
    
    //Set Theme according to sun position
    if (currentTime > suncalcTimes.sunset) {
        html_body.classList.add("is-night");
        var sw_night = document.querySelector(".js-switch--night");
        sw_night.checked = true;
    }
    RefreshBody();



    

});
