import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import NotFound from 'components/Images/not-found.png'

const enhance = compose(
  injectSheet({
    emptyQuery: {
      background: 'url(' + NotFound + ') no-repeat center center',
      textAlign: 'center',
      fontSize: '13px',
      color: '#666 !important',
      '& svg': {
        width: '50px !important',
        height: '50px !important',
        color: '#999 !important'
      }
    }
  }))

const THE = 30
const EmptyQuery = enhance(({classes, size, text}) => {
  const style = {
    paddingTop: `${size}px`,
    backgroundSize: `${size + THE}px`
  }
  return (
    <div className={classes.emptyQuery} style={style}>
      {text}
    </div>
  )
})

EmptyQuery.propTypes = {
  position: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
}

export default EmptyQuery
