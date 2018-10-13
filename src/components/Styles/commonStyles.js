import React from 'react'
import Loader from 'components/Loader/Loader'

export const DISPLAY_FLEX_CENTER = {
  display: 'flex',
  alignItems: 'center'
}
export const DISPLAY_FLEX_CENTER_CENTER = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}
export const DISPLAY_FLEX_START = {
  display: 'flex',
  alignItems: 'start'
}

export const COLOR_GREEN = '#81c784'
export const COLOR_RED = '#e57373'

export const getLoader = (h, size) => (
  <div style={{...DISPLAY_FLEX_CENTER_CENTER, height: h + 'px'}}>
    <Loader size={size}/>
  </div>
)
