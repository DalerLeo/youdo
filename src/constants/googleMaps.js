import _ from 'lodash'

export const GOOGLE_API_HOST = 'maps.googleapis.com'
export const GOOGLE_API_VERSION = '3.exp'
export const GOOGLE_USE_LIBRARY = ['geometry', 'drawing', 'places']
export const GOOGLE_API_KEY = 'AIzaSyD0ELuKaFVgU-ck3oT8fV9HDmfuOHB7KhI'
export const GOOGLE_API_URL = `https://${GOOGLE_API_HOST}/maps/api/js?v=${GOOGLE_API_VERSION}&libraries=${_.join(GOOGLE_USE_LIBRARY, ',')}&key=${GOOGLE_API_KEY}`
export const DEFAULT_LOCATION = {
    lat: 41.3076492,
    lng: 69.2705497
}
