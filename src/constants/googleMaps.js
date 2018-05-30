import _ from 'lodash'

export const GOOGLE_API_HOST = 'maps.googleapis.com'
export const GOOGLE_API_VERSION = '3.exp'
export const GOOGLE_USE_LIBRARY = ['geometry', 'drawing', 'places']
export const GOOGLE_API_KEY = 'AIzaSyDnUkBg_uV1aa4e7pyEvv3bVxN3RfwNQEo'
export const GOOGLE_API_URL = `https://${GOOGLE_API_HOST}/maps/api/js?v=${GOOGLE_API_VERSION}&libraries=${_.join(GOOGLE_USE_LIBRARY, ',')}&key=${GOOGLE_API_KEY}`
export const DEFAULT_LOCATION = {
  lat: 41.31115127095392,
  lng: 69.2797140777111
}
export const FLOATPANE = 'floatPane'
