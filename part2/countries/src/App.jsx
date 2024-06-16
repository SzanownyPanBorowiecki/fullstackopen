import { useState, useEffect } from 'react'
import countryService from './services/restcountries.jsx'
import weatherService from './services/openweather.jsx'

const CurrentWeather = ({latitude, longitude}) => {
  const [weather, setWeather] = useState(null)
  const [statusMessage, setStatusMessage] = useState(null)

  useEffect(() => {
    setStatusMessage('Loading weather...')
    weatherService
      .getCurrentWeather(latitude, longitude)
      .then(weatherData => setWeather(weatherData))
      .then(() => setStatusMessage(null))
      .catch(error => setStatusMessage(`Error loading weather data: ${error}`))
  }, [])
  
  if (weather === null) return <div>{statusMessage}</div>

  return (
    <div>
      <div>temperature: {weather.main.temp} Celsius</div>
      <div><img src={weatherService.getIconURL(weather.weather[0].icon, true)} /></div>
      <div>wind: {weather.wind.speed} m/s</div>
    </div>
  )
}

const CountryInfo = ({country}) => {
  if (country === null) return null

  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>capital: {country.capital}</div>
      <div>area: {country.area} km<sup>2</sup></div>
      <h4>languages:</h4>
      <ul>
        {Object.entries(country.languages).map(([code, name]) => <li key={code}>{name}</li>)}
      </ul>
      <img src={country.flags.png} />
      <h2>Weather in {country.capital}</h2>
      <CurrentWeather latitude={country.capitalInfo.latlng[0]} longitude={country.capitalInfo.latlng[1]} />
    </div>
  )
}

const FilterInput = ({onChange}) => {
  const [value, setValue] = useState('')
  
  const handleChange = event => {
    setValue(event.target.value)
    onChange(event.target.value)
  }

  return (
    <div>
      <form>find countries <input value={value} onChange={event => handleChange(event)} /></form>
    </div>
  )
}

const CountryList = ({countries, onSelect}) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }

  return (
    <div>
      {countries.map(c => 
        <div key={c.name.common}>
          {c.name.common} <button onClick={() => onSelect(c)}>show</button>
        </div>
      )}
    </div>
  )
}

const CountryPicker = ({countries, onChange}) => {
  const [country, setCountry] = useState(null)
  const [filter, setFilter] = useState('')

  useEffect(() => onChange(country), [country])

  const handleFilterInputChange = val => {
    setCountry(null)
    setFilter(val.toLowerCase())
  }

  const filteredCountries = 
    filter.length !== 0 
      ? countries.filter(c => c.name.common.toLowerCase().includes(filter))
      : []
  
  if (country === null && filteredCountries.length === 1){
    setCountry(filteredCountries[0])
  } 

  return (
    <div>
      <FilterInput onChange={val => handleFilterInputChange(val)} />
      {country === null 
        ? <CountryList countries={filteredCountries} onSelect={country => setCountry(country)} /> 
        : null}
    </div>
  )
}


const App = () => {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState(null)
  const [statusMessage, setStatusMessage] = useState(null)

  useEffect(() => {
    setStatusMessage(`Downloading countries data...`)

    countryService
      .getAll()
      .then(initialCountries => {
        initialCountries.sort((a,b) => {
          if (a.name.common > b.name.common) return 1
          else if (a.name.common < b.name.common) return -1
          return 0
        })
        setCountries(initialCountries)
        })
      .then(() => setStatusMessage(null))
      .catch(error => setStatusMessage(`Error downloading countries: ${error}`))
  }, [])

  if (countries.length === 0) return <div>{statusMessage}</div>

  return (
    <div>
      <CountryPicker countries={countries} onChange={obj => setCountry(obj)} />
      <CountryInfo country={country} />
    </div>
  )
}

export default App
