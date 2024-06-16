import axios from 'axios'

const api_key = import.meta.env.VITE_OPENWEATHER_API_KEY
const baseUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${api_key}`
const baseUrlIcon = 'https://openweathermap.org/img/wn'

const getCurrentWeather = (lat, lon) => {
    const request = axios.get(`${baseUrl}&lat=${lat}&lon=${lon}&units=metric`)
    return request.then(response => response.data)
}

const getIconURL = (code, large = false) => {
    const res = `${baseUrlIcon}/${code}${large ? '@2x' : ''}.png`
    console.log(code, large, res)
    return res
}

export default {getCurrentWeather, getIconURL}