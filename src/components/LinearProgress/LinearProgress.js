import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'

const animationIndeterminate = 'indeterminate 1.5s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite'
const animationIndeterminateShort = 'indeterminate-short 1.5s cubic-bezier(0.165, 0.84, 0.44, 1) infinite'

const enhance = compose(
  injectSheet({
    progress: {
      position: 'absolute',
      left: '0',
      right: '0',
      height: '2px',
      display: 'block',
      backgroundColor: '#fff',
      overflow: 'hidden'
    },
    indeterminate: {
      backgroundColor: '#12aaeb',
      '&:before': {
        content: '""',
        position: 'absolute',
        backgroundColor: 'inherit',
        top: '0',
        left: '0',
        bottom: '0',
        willChange: 'left, right',
        WebkitAnimation: animationIndeterminate,
        animation: animationIndeterminate
      },
      '&:after': {
        content: '""',
        position: 'absolute',
        backgroundColor: 'inherit',
        top: '0',
        left: '0',
        bottom: '0',
        willChange: 'left, right',
        WebkitAnimation: animationIndeterminateShort,
        animation: animationIndeterminateShort,
        WebkitAnimationDelay: '1.15s',
        animationDelay: '1.15s'
      }
    },
    '@keyframes indeterminate': {
      '0%': {
        left: '-35%',
        right: '100%'
      },
      '60%': {
        left: '100%',
        right: '-90%'
      },
      '100%': {
        left: '100%',
        right: '-90%'
      }
    },
    '@keyframes indeterminate-short': {
      '0%': {
        left: '-200%',
        right: '100%'
      },
      '60%': {
        left: '107%',
        right: '-8%'
      },
      '100%': {
        left: '107%',
        right: '-8%'
      }
    }
  })
)

const LinearProgress = ({classes, props}) => {
  return (
    <div {...props} className={classes.progress}>
      <div className={classes.indeterminate}/>
    </div>

  )
}

export default enhance(LinearProgress)
