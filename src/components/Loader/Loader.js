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
    },
    '@-webkit-keyframes spin': {
      '0%': {'-webkit-transform': 'rotate(0deg)'},
      '25%': {'-webkit-transform': 'rotate(120deg)'},
      '50%': {'-webkit-transform': 'rotate(270deg)'},
      '100%': {'-webkit-transform': 'rotate(360deg)'}
    },

    '@keyframes spin': {
      '0%': {transform: 'rotate(0deg)'},
      '25%': {transform: 'rotate(120deg)'},
      '50%': {transform: 'rotate(270deg)'},
      '100%': {transform: 'rotate(360deg)'}
    },
    loadWrap: {
      zIndex: '99',
      background: '#fff9',
      position: 'absolute',
      top: '0',
      textAlign: 'center',
      paddingTop: '220px',
      height: '100%',
      width: '100%'
    },
    loaderStyle: {
      border: '5px solid #f3f3f3',
      borderRadius: '50%',
      borderTop: '8px solid #78909C',
      width: '75px',
      height: '75px',
      display: 'inline-block',
      'WebkitAnimation': 'spin 800ms linear infinite',
      animation: 'spin 800ms linear infinite'
    }
  })
)
const loaderStyle = {
  border: '10px solid #f3f3f3',
  borderRadius: '50%',
  borderTop: '8px solid #636ec1',
  width: '120px',
  height: '120px',
  display: 'inline-block',
  'WebkitAnimation': 'spin 800ms linear infinite',
  animation: 'spin 800ms linear infinite'
}
const loadWrap = {
  display: 'none',
  zIndex: '99',
  background: '#fff9',
  position: 'absolute',
  top: '0',
  textAlign: 'center',
  paddingTop: '300px',
  height: '100%',
  width: '100%'
}
const ONE = 1
const ELEMENTS_AMOUNT = 7
const BLUE_ELEMENTS = _.map(['2', '5'], _.parseInt)
const Loader = enhance((props) => {
  const {classes, size} = props
  const customStyles = {
    transform: 'scale(' + size + ')'
  }

  return (
    <div className={classes.loadWrap} id="loader">
      <div className={classes.loaderStyle}/>
    </div>
  )
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
