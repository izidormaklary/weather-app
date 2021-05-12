(function () {
    const input = document.getElementById("input");

    const tplTarget = document.getElementById("tplTarget");
    let d = new Date();
    let i = 0;

    let avgPerDayArr = [];

    let imgSel;

    let l = 0;
    let dayName;


    //variable to display the days based on the date of today, and the repetition of the displayIt function.
    function weekdays(turn){

        let weekday =[];
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";
        let dayInd = d.getDay()+turn

        // small tweak to stay in the boundaries of the weekday array
        if ( dayInd < 7){
        dayName = weekday[dayInd];
        }else {
            dayName = weekday[dayInd-7];
        }
    }

//the start of the process with getting the input value and running the core functions on pressing the search button
    document.getElementById("run").addEventListener("click", e=>{
        let city = input.value;
        bgImage(city);
        getWeather(city);
        bgNHeader();

    });

    //accessing the forecast for the location from the remote API
    async function getWeather(city){
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=e07224c4dd36df3b3ecab56342b4470c`;
        const data = await fetch(url);
        let weather = await data.json();

        displayIt (weather);
    }

    //cloning the template and displaying the values from the json file, which are processed beforehand
    function displayIt(weather){

        getAvg(weather);

        //empty the target before each iteration
        tplTarget.innerHTML = "";

        //five
        for (;i < 5;i++) {
            // selecting the right array object
            let avgForDay = avgPerDayArr[l];

            // cloning the template selecting the target
            const tpl = document.getElementById("tpl").content.cloneNode(true);
            const tplTarget = document.getElementById("tplTarget");

            //selecting the target for the weekdays, then the process then writing it in the element
            const day = tpl.querySelector(".day");
            weekdays(i);
            day.innerText = dayName;

            // selecting the index image based on the state of the weather, then adding its source
            const img = tpl.querySelector(".image");
            selectImage();
            img.setAttribute("src", imgSel)

            // adding the values from the object properties to the elements accordingly
            tpl.getElementById("tempTarget").innerText= avgForDay.temp.toFixed(2)+"°C";
            tpl.getElementById("windTarget").innerText= avgForDay.windDir + " "+avgForDay.windSpeed.toFixed(1)+"km/h";
            tplTarget.appendChild(tpl);

            l++;

        }
        //setting the values to the initial state
        i=0;
        l=0;
        g=0;

    }

    // core function which contains most of the functions,
    function getAvg(weather){

        // first an array for the days, it will hab objects with values
        avgPerDayArr = [];

        // getting the list (40 measurements for 5 days ahead)
        const list = weather.list;
        r = 0;
        z = 0;
        // x has the value of the measurements for today, because the list refreshes everytime a new measurements comes in
        let x = Math.ceil(( 24 - d.getHours())/3)-1;
        let arrayOfAll = [];
        //slicing the array accordingly and adding it to a new array, so every day has the right measurements from the list
        arrayOfAll.push(list.slice(0, x));
        arrayOfAll.push(list.slice(x, x+8));
        arrayOfAll.push(list.slice(x+8, x+16))
        arrayOfAll.push(list.slice(x+16, x+24))
        arrayOfAll.push(list.slice(x+24, x+32))

        // iterating through the measurements per day
        arrayOfAll.forEach(element=> {
            weatherMainArr(element);

            avgPerDay(element, element.length);

            avgWindDir(element, element.length);

            avgWindSpeed(element, element.length)
            r++;

        })

    }

    // avg: getting the measurements (see function name), and calculate the average based on the arrays length
    let r =0;
    function avgWindDir(day, x){
        let initialValue = 0
        let sum = day.reduce(
            (accumulator, currentValue) => accumulator + currentValue.wind.deg, initialValue);
        let avg = sum/x;



        avgPerDayArr[r].windDir = windDirShow(avg);


    }
    // avg ... see above
let z =0 ;
    function avgPerDay(day, x){
        let initialValue = 0
        let sum = day.reduce(
            (accumulator, currentValue) => accumulator + currentValue.main.temp, initialValue);
        let avg = sum/x;

        avgPerDayArr[z].temp = avg;
        z++;

    }
    // avg ... see above above ;)
    let g = 0;
    function avgWindSpeed(day, x){
        let initialValue = 0
        let sum = day.reduce(
            (accumulator, currentValue) => accumulator + currentValue.wind.speed, initialValue);
        let avg = sum/x;

        avgPerDayArr[g].windSpeed = avg;
        g++;

    }

    //adding the element from the main description of the weather to a temporary array
    function weatherMainArr(day){
        let states =[];
        day.forEach(element => {
            states.push(element.weather[0].main)
        });
        console.log(states)

        // creating the elements with the values
        avgPerDayArr.push({state:(mode(states)), temp: "", windDir: "", windSpeed:""})
    }

    //returns the most represented element from the temporary array
    function mode(arr){
        return arr.sort((a,b) =>
            arr.filter(v => v===a).length
            - arr.filter(v => v===b).length
        ).pop();
    }

    // this function selects the right img source for the different weathers
    function selectImage(){
        let current = avgPerDayArr[l].state;

        switch (current){
            case "Clear":
               imgSel = "./resources/sun.png";
                break;
            case "Rain":
                imgSel = "./resources/rain.png";
                break;
            case "Clouds":
                imgSel = "./resources/broken_clouds.png";
                break;

        }
    }

    //translates the wind directions average from a number to simpler cardinal directions
    function windDirShow(avg){
        switch (true){
            case (avg > 337 || avg <= 21):
                return "N"
                break;
            case (avg > 21 && avg <= 68):
                return "NE";
                break;
            case (avg > 68 && avg <= 112):
                return "E"
                break;
            case (avg > 112 && avg <= 157):
                return "SE"
                break;
            case (avg > 157 && avg <= 202):
                return "S"
                break;
            case (avg > 214 && avg <= 247):
                return "SW"
                break;
            case (avg > 259 && avg <= 292):
                return "W"
                break;
            case (avg > 292 && avg <= 337):
                return "NW"
                break;
        }
    }
    // transition from landingpage to nav
    function bgNHeader(){
       let wrap = document.getElementById("wrap");
       wrap.style.height= " auto";
       wrap.style.paddingTop = "20px";
       wrap.style.backgroundColor = "rgba(189, 225, 234, 0.60";
    }

    //setting background image of body to the first search result (input fields value) from the unsplash API
    async function bgImage (input){
        const url = `https://api.unsplash.com/search/photos?query=${input}%7D%20building&client_id=FNZDPuqGWIMhhkXhxQoXOT-iLllXdvto_idCPQeRX8s&orientation=landscape`;
        const data = await fetch(url);
        let image = await data.json();

        image = image.results[0].urls.regular;
        const container = document.getElementsByTagName("BODY")[0];

        container.style.backgroundImage= 'url('+image+')';

    }


})();