import React, { useEffect, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const renderChart = (data, countries) => {
    return ( 
        <LineChart width={730} height={250} data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={countries[0]} stroke="green" />
            <Line type="monotone" dataKey={countries[1]} stroke="blue" />
        </LineChart>
    )
}

function Chart() {

    const [countries, setCountries] = useState();
    const [sickByDate, setSickByDate] = useState();
  useEffect(async () => {
    let rawData;
    fetch("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv")
        .then((res) => res.text())
        .then((res => {
            rawData = csvJSON(res);
            const random1 = Math.floor(Math.random() * rawData.length);
            const random2 = Math.floor(Math.random() * rawData.length);
            const country1 = rawData[random1];
            const country2 = rawData[random2];
            setCountries([country1["Country/Region"], country2["Country/Region"]]);
            let sickByDay = []; //[{date: "1/2/3", argentina: 50, japan: 100}]
            for (const prop in country1){
                if(isDate(prop)){
                    const day = {};
                    day.date = prop;
                    day[`${country1["Country/Region"]}`] = country1[prop];
                    day[`${country2["Country/Region"]}`] = country2[prop];
                    sickByDay.push(day);
                }
            }
            console.log(sickByDay);
            setSickByDate(sickByDay);
        }))
  }, []);

  const isDate = (prop) => prop.split("/").length === 3;

  function csvJSON(csv) {
    var lines = csv.split("\n");
    var result = [];
    var headers = lines[0].split(",");
    for (var i = 1; i < lines.length; i++) {
      var obj = {};
      var currentline = lines[i].split(",");
      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }
    return result;
  }
  
  return sickByDate ? <div>{renderChart(sickByDate, countries)}</div> : <></>;
}

export default Chart;
