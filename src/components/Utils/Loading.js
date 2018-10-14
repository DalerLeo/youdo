import Loader from 'components/Loader/Loader'
import React from 'react'
import {DISPLAY_FLEX_CENTER_CENTER} from 'components/Styles/commonStyles'
import PropTypes from 'prop-types'

const Loading = ({height, size, loading}) => {
  if (!loading) return null
  return (
    <div style={{...DISPLAY_FLEX_CENTER_CENTER, height: height + 'px'}}>
      <Loader size={size}/>
    </div>
  )
}

Loading.propTypes = {
  height: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired
}

export default Loading
