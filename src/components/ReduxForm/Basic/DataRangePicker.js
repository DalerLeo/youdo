/* eslint no-invalid-this: 0 */
/* eslint no-undefined: 0 */

import _ from 'lodash'
import React from 'react'
import injectSheet from 'react-jss'
import PropTypes from 'prop-types'
import DateRange from 'react-date-range-ru'
import {Popover, FlatButton} from 'material-ui'
import dateFormat from '../../../helpers/dateFormat'

const MINUS_ONE = -1
const MINUS_SEVEN = -7
const MINUS_THIRTY = -30
const range = {
  'Сегодня': {
    startDate: (now) => {
      return now
    },
    endDate: (now) => {
      return now
    }
  },

  'Вчера': {
    startDate: (now) => {
      return now.add(MINUS_ONE, 'days')
    },
    endDate: (now) => {
      return now.add(MINUS_ONE, 'days')
    }
  },

  'Последние 7 дней': {
    startDate: (now) => {
      return now.add(MINUS_SEVEN, 'days')
    },
    endDate: (now) => {
      return now
    }
  },

  'Последние 30 дней': {
    startDate: (now) => {
      return now.add(MINUS_THIRTY, 'days')
    },
    endDate: (now) => {
      return now
    }
  }
}

class DateToDateField extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      starting: false
    }
  }

    handleOnTouchTap = (event) => {
      event.preventDefault()

      this.setState({
        anchorEl: event.currentTarget,
        open: !this.props.open
      })
    }

    handleOnRequestClose = () => {
      this.setState({
        open: false
      })
    }
    render () {
      const {label, classes, input, meta: {error}} = this.props
      const {
        open,
        anchorEl
      } = this.state
      const startDate = dateFormat(_.get(input, ['value', 'startDate']))
      const endDate = dateFormat(_.get(input, ['value', 'endDate']))
      const dateLabel = error || (!startDate)
        ? label : startDate === endDate
          ? startDate : startDate + ' - ' + endDate
      return (

        <div>
          <div className={classes.button}>
            <FlatButton
              label={dateLabel}
              onTouchTap={this.handleOnTouchTap}/>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onRequestClose={this.handleOnRequestClose}
            >
              <DateRange
                linkedCalendars={ true }
                lang={'ru'}
                ranges={ range }
                onChange={ (which) => {
                  input.onChange(which)
                }}
                theme={{
                  Calendar: {width: 300},
                  PredefinedRangesItemActive: {
                    background: '#98a1b7',
                    color: '#fff'
                  },
                  PredefinedRanges: {marginLeft: 10, marginTop: 10},
                  DateRange: {
                    background: '#ffffff'
                  },
                  MonthAndYear: {
                    background: '#5d6474',
                    color: '#fff'
                  },
                  MonthButton: {
                    background: '#fff'
                  },
                  MonthArrowPrev: {
                    borderRightColor: '#5d6474'
                  },
                  MonthArrowNext: {
                    borderLeftColor: '#5d6474'
                  },
                  Weekday: {
                    background: '#fff',
                    color: '#5d6474'
                  },
                  Day: {
                    transition: 'transform .1s ease, box-shadow .1s ease, background .1s ease'
                  },
                  DaySelected: {
                    background: '#5d6474'
                  },
                  DayActive: {
                    background: '#8e44ad',
                    boxShadow: 'none'
                  },
                  DayInRange: {
                    background: '#7e8698',
                    color: '#fff'
                  },
                  DayHover: {
                    background: '#98a1b7',
                    color: '#fff'
                  }
                }}
              />
            </Popover>
          </div>
        </div>
      )
    }
}

DateToDateField.defaultProps = {
  format: 'DD.MM.YYYY'
}

DateToDateField.propTypes = {
  format: PropTypes.string
}

export default injectSheet({
  button: {
    display: 'flex',
    border: 'solid 1px #efefef !important',
    '& button': {
      '& > div': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }
    }
  }
})(DateToDateField)
