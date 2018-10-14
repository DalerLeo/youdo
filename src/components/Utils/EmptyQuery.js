import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import NotFound from 'components/Images/not-found.png'
import _ from 'lodash'

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
const EmptyQuery = enhance(({classes, size, text, list, loading}) => {
  const style = {
    paddingTop: `${size}px`,
    backgroundSize: `${size + THE}px`
  }

  if (!_.isEmpty(list) || loading) return null

  return (
    <div className={classes.emptyQuery} style={style}>
      {text || 'По вашему запросу ничего не найдено'}
    </div>
  )
})

EmptyQuery.propTypes = {
  text: PropTypes.string,
  size: PropTypes.number.isRequired,
  list: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired
}

export default EmptyQuery
