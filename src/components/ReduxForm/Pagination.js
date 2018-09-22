import React from 'react'
import PropTypes from 'prop-types'
import {hashHistory} from 'react-router'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import IconButton from 'material-ui/IconButton'
import ArrowLeftIcon from '../GridList/GridListNavPagination/ArrowLeftIcon'
import ArrowRightIcon from '../GridList/GridListNavPagination/ArrowRightIcon'

const enhance = compose(
  injectSheet({
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      color: '#5d6474'
    },
    customWrapper: {
      extend: 'wrapper',
      position: 'absolute',
      right: '30px',
      top: '-52px',
      height: '52px'
    },

    count: {
      marginRight: '15px',
      height: '54px !important',
      '& > div': {
        fontSize: '13px !important',
        marginTop: '3px !important'
      }
    },

    nav: {
      display: 'flex',
      alignItems: 'center'
    },
    gridPagination: {
      '& button': {
        padding: '0 !important',
        width: 'inherit !important',
        height: 'inherit !important',
        top: '2px'
      },
      '& button:first-child': {
        padding: '0 5px 0 10px !important'
      }
    }
  })
)
const Pagination = enhance(({classes, filter, customPagination}) => {
  const prev = filter.prevPage()
  const next = filter.nextPage()
  const firstPage = 1
  const startPage = (filter.getPageRange() * (filter.getCurrentPage() - firstPage)) + firstPage
  const startEnd = filter.getCounts() < (filter.getPageRange() * filter.getCurrentPage()) ? filter.getCounts() : filter.getPageRange() * filter.getCurrentPage()

  return (
    <div className={customPagination ? classes.customWrapper : classes.wrapper}>
      <div className={classes.nav}>
        <div>{startPage} - {startEnd} из {filter.getCounts()}</div>
        <div className={classes.gridPagination}>
          <IconButton
            disabled={Boolean(!prev)}
            disableTouchRipple={true}
            iconStyle={{color: 'rgba(0, 0, 0, 0.56)'}}
            onClick={() => prev && hashHistory.push(prev)}>
            <ArrowLeftIcon />
          </IconButton>

          <IconButton
            disabled={Boolean(!next)}
            disableTouchRipple={true}
            iconStyle={{color: 'rgba(0, 0, 0, 0.56)'}}
            onClick={() => next && hashHistory.push(next)}>
            <ArrowRightIcon />
          </IconButton>
        </div>
      </div>
    </div>
  )
})

Pagination.propTypes = {
  filter: PropTypes.object.isRequired
}
Pagination.defaultProps = {
  customPagination: false
}

export default Pagination
