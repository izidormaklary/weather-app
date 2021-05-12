(function () {
    const input = document.getElementById("input");
    const tpl = document.getElementById("tpl").content.cloneNode(true);;
    const tplTarget = document.getElementById("tplTarget");
    let d = new Date();
    let i = 0;
    let arrToday;
    let day2;
    let day3;
    let day4;
    let day5;
    let avgPerDayArr = [];
    let weatherPerDayArr = [];
    let imgSel;
    let avgToday;
    let avgDay2;
    let avgDay3;
    let avgDay4;
    let avgDay5;
    let l = 0;
    let dayName;
    function weekdays(){

        let weekday =[];
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

        dayName = weekday[d.getDay()+i];
        i++;
    }


    document.getElementById("run").addEventListener("click", e=>{
        let city = input.value;
        console.log(city);
        getWeather(city)


    });
    async function getWeather(city){
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=33577bf7e0092a0167929dc2e64a5874`;
        const data = await fetch(url);
        let weather = await data.json();
        console.log(weather)
        displayIt (weather);
    }
    function displayIt(weather){
        getAvg(weather);
        for (;i < 5;) {
            if (i > 6){ i = 0}
            const tpl = document.getElementById("tpl").content.cloneNode(true);
            const tplTarget = document.getElementById("tplTarget");


            const day = tpl.querySelector(".day");

            weekdays();

            day.innerText = dayName;

            const img = tpl.querySelector(".image");

            selectImage();
            img.setAttribute("src", imgSel)


            tpl.getElementById("tempTarget").innerText= avgPerDayArr[l].temp.toFixed(2)+"°C";

            tplTarget.appendChild(tpl);

            l++;

        }
        console.log(avgPerDayArr);
    }

    function getAvg(weather){
        const list = weather.list;

        let x = Math.ceil(( 24 - d.getHours())/3);

        arrToday = list.slice(0, x);
        day2 = list.slice(x, x+8);
        day3 = list.slice(x+8, x+16)
        day4 = list.slice(x+16, x+24)
        day5 = list.slice(x+24, x+32)
        weatherMainArr(arrToday)
        weatherMainArr(day2)
        weatherMainArr(day3)
        weatherMainArr(day4)
        weatherMainArr(day5)
        avgPerDay (arrToday, x);
        avgWindDir (arrToday, x);
        x = 8;
        avgPerDay (day2, x );
        avgPerDay (day3, x );
        avgPerDay (day4, x );
        avgPerDay (day5, x );




    }
    function avgWindDir(day, x){
        let initialValue = 0
        let sum = day.reduce(
            (accumulator, currentValue) => accumulator + currentValue.main.temp, initialValue);
        let avg = sum/x;

        avgPerDayArr.push({temp: avg})
    }
    function avgPerDay(day, x){
        let initialValue = 0
        let sum = day.reduce(
            (accumulator, currentValue) => accumulator + currentValue.main.temp, initialValue);
        let avg = sum/x;

        avgPerDayArr.push({temp: avg})
    }
    function weatherMainArr(day){
        let states =[];
        day.forEach(element => {
            states.push(element.weather[0].main)
        });

        weatherPerDayArr.push(mode(states));
    }
    function mode(arr){

        return arr.sort((a,b) =>
            arr.filter(v => v===a).length
            - arr.filter(v => v===b).length
        ).pop();
    }
    function selectImage(){
        let current = weatherPerDayArr[l];
        console.log(current)
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
})();