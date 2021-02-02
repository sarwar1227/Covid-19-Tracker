import React, { useState, useEffect } from "react";
import './App.css';
import { FormControl, Select, MenuItem, Card, CardContent } from '@material-ui/core';
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from './Table';
import { sortData } from './util'
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";
import { prettyPrintStat } from './util';

const App = () => {
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState('Worldwide');
    const [countryInfo, setCountryInfo] = useState({});
    const [tableData, setTableData] = useState([]);
    const [mapCenter, setMapCenter] = useState({
        lat: 34.8076,
        lng: -40.4790,
    })
    const [mapZoom, setMapZoom] = useState(3);
    const [mapCountries, setMapCountries] = useState([]);
    const [casesType, setCasesType] = useState(["cases"]);

    useEffect(() => {
        const getCountryData = async () => {
            try {
                const URL = `https://disease.sh/v3/covid-19/all`;
                const worldwide_json = await fetch(URL);
                const worlwide_data = await worldwide_json.json();
                setCountryInfo(worlwide_data);
            } catch (err) {
                console.log(err);
            }
        }
        getCountryData();
    }, []);

    useEffect(() => {
        const getCountriesData = async () => {
            try {
                const json_response = await fetch('https://disease.sh/v3/covid-19/countries');
                const converted_response = await json_response.json();
                const useful_data = converted_response.map((country) => {
                    return {
                        name: country.country,  //UK,USA.India,Pakistan
                        value: country.countryInfo.iso2, //Ind , Pak ,Afg
                    }
                });
                setCountries(useful_data);
                const sorted_response = sortData(converted_response);
                setTableData(sorted_response);
                setMapCountries(sorted_response);
            } catch (err) {
                console.log(err);
            }
        }
        getCountriesData();
    }, [countries]);

    const onCountryChange = async (event) => {
        try {
            const country_code = event.target.value;
            const url = (country_code === 'Worldwide')
                ? (`https://disease.sh/v3/covid-19/all`)
                : (`https://disease.sh/v3/covid-19/countries/${country_code}`);
            const JSON_RESPONSE = await fetch(url);
            const CONVERTED_RESPONSE = await JSON_RESPONSE.json();
            setCountry(country_code);
            setCountryInfo(CONVERTED_RESPONSE);
            setMapCenter([CONVERTED_RESPONSE.countryInfo.lat, CONVERTED_RESPONSE.countryInfo.long]);
            setMapZoom(5);
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <>
            <div className="app">
                <div className="app__left">
                    <div className="app__header">
                        <h1>Covid-19 Tracker App</h1>
                        <FormControl className="app__dropdown">
                            <Select
                                variant="outlined"
                                value={country}
                                onChange={onCountryChange}
                            >
                                <MenuItem value="Worldwide">Worldwide</MenuItem>
                                {
                                    countries.map((country, index) => <MenuItem key={index} value={country.value}>{country.name}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                    </div>

                    <div className="app__stats">
                        <InfoBox
                            isRed
                            active={casesType === "cases"}
                            onClick={e => setCasesType('cases')}
                            title="CoronaVirus Cases"
                            total={prettyPrintStat(countryInfo.cases)}
                            cases={prettyPrintStat(countryInfo.todayCases)}
                        />
                        <InfoBox
                            active={casesType === "recovered"}
                            onClick={e => setCasesType('recovered')}
                            title="Recovered"
                            total={prettyPrintStat(countryInfo.recovered)}
                            cases={prettyPrintStat(countryInfo.todayRecovered)}

                        />
                        <InfoBox
                            isRed
                            active={casesType === "deaths"}
                            onClick={e => setCasesType('deaths')}
                            title="Deaths"
                            total={prettyPrintStat(countryInfo.deathss)}
                            cases={prettyPrintStat(countryInfo.todayDeaths)}

                        />
                    </div>

                    <div className="app__map">
                        <Map Center={mapCenter} Zoom={mapZoom} countries={mapCountries} casesType={casesType} />
                    </div>

                </div>
                <Card className="app__right">
                    <CardContent>
                        <h3>Live Cases By Country</h3>
                        <Table countries={tableData} />
                        <h3>Worldwise New Cases</h3>
                        <LineGraph casesType={casesType} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
export default App;