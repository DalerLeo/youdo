import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'

const enhance = compose(
  injectSheet({
    loader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '& > div': {
        position: 'relative',
        width: '6px',
        margin: '0 1.8px',
        height: '30px',
        background: '#17A3C5',
        transition: 'all 100ms ease',
        transform: 'scaleY(0)',
        animation: 'animation 600ms infinite',
        '&:nth-child(1)': {height: '10px', top: '5px'},
        '&:nth-child(2)': {height: '24px', top: '5px'},
        '&:nth-child(3)': {height: '36px', top: '6px'},
        '&:nth-child(4)': {height: '37px', top: '-5px'},
        '&:nth-child(5)': {height: '25px', top: '8px'},
        '&:nth-child(6)': {height: '24px', top: '2px'},
        '&:nth-child(7)': {height: '9px', top: '6px'}
      }
    },
    blue: {
      background: '#3394D2 !important'
    },
    '@keyframes animation': {
      '0%': {transform: 'scaleY(0.6)'},
      '50%': {transform: 'scaleY(1)'},
      '100%': {transform: 'scaleY(0.6)'}
    }
  })
)
const ONE = 1
const ELEMENTS_AMOUNT = 7
const BLUE_ELEMENTS = _.map(['2', '5'], _.parseInt)
const Loader = enhance((props) => {
  const {classes, size} = props
  const customStyles = {
    transform: 'scale(' + size + ')'
  }
  const elements = _.map(_.range(ELEMENTS_AMOUNT), (item, index) => {
    const hasBlueElements = _.includes(BLUE_ELEMENTS, (index + ONE))
    const HUNDRED = 100
    const animDelay = (index * HUNDRED) + 'ms'
    return (
      <div key={index} style={{animationDelay: animDelay}} className={hasBlueElements ? classes.blue : ''}>{null}</div>
    )
  })
  return (
    <div className={classes.loader} style={customStyles}>
      {elements}
    </div>
  )
})

Loader.defaultProps = {
  size: 0.75
}

export default Loader
