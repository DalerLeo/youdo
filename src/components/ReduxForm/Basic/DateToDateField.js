/* eslint no-invalid-this: 0 */
/* eslint no-undefined: 0 */

import _ from 'lodash'
import React from 'react'
import injectSheet from 'react-jss'
import PropTypes from 'prop-types'
import {DateRange} from 'react-date-range-ru'
import {Popover, FlatButton} from 'material-ui'
import Close from 'material-ui/svg-icons/navigation/close'
import Check from 'material-ui/svg-icons/navigation/check'
import dateFormat from '../../../helpers/dateFormat'
import {getLanguage} from '../../../helpers/storage'
import t from '../../../helpers/translate'
import MUITextField from 'material-ui/TextField'
import moment from 'moment'
import ToolTip from '../../ToolTip/ToolTip'

const MINUS_ONE = -1
const MINUS_SEVEN = -7
const x = new Date()
const TODAY = x.getDate()
const ONE = 1
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

  'Текущий месяц': {
    startDate: (now) => {
      return now.add((TODAY * MINUS_ONE) + ONE, 'days')
    },
    endDate: (now) => {
      return now
    }
  }
}

const rangeEn = {
  'Today': {
    startDate: (now) => {
      return now
    },
    endDate: (now) => {
      return now
    }
  },

  'Yesterday': {
    startDate: (now) => {
      return now.add(MINUS_ONE, 'days')
    },
    endDate: (now) => {
      return now.add(MINUS_ONE, 'days')
    }
  },

  'Last 7 days': {
    startDate: (now) => {
      return now.add(MINUS_SEVEN, 'days')
    },
    endDate: (now) => {
      return now
    }
  },

  'Current month': {
    startDate: (now) => {
      return now.add((TODAY * MINUS_ONE) + ONE, 'days')
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
    this.handleOnRequestClose = this.handleOnRequestClose.bind(this)
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
    const lang = getLanguage() === 'uz' ? 'ru' : getLanguage()
    const {
            open,
            anchorEl
        } = this.state
    const startDate = dateFormat(_.get(input, ['value', 'fromDate']))
    const endDate = dateFormat(_.get(input, ['value', 'toDate']))
    const dateLabel = error || (!startDate)
            ? ''
            : startDate === endDate
                ? startDate
                : `${startDate} - ${endDate}`
    return (

            <div>
                <div className={classes.button}>
                    <MUITextField
                        errorText={error}
                        floatingLabelText={label}
                        onFocus={this.handleOnTouchTap}
                        value={dateLabel}
                        className={classes.inputDateCustom}
                    />
                    <Popover
                        open={open}
                        anchorEl={anchorEl}
                        onRequestClose={this.handleOnRequestClose}>
                        <div className={classes.clear}>
                            <ToolTip position="top" text={t('Очистить')}>
                                <FlatButton
                                    disableTouchRipple={true}
                                    onClick={() => { input.onChange({startDate: undefined, endDate: undefined}) }}>
                                    <Close color="#fff"/>
                                </FlatButton>
                            </ToolTip>
                            <ToolTip position="top" text={t('Применить')}>
                                <FlatButton
                                    disableTouchRipple={true}
                                    onClick={() => { this.handleOnRequestClose() }}>
                                    <Check color="#fff"/>
                                </FlatButton>
                            </ToolTip>
                        </div>
                        <DateRange
                            startDate={_.get(input, ['value', 'fromDate']) || moment()}
                            endDate={_.get(input, ['value', 'toDate']) || moment()}
                            lang={lang}
                            ranges={ lang === 'en' ? rangeEn : range }
                            onChange={ (which) => {
                              input.onChange({fromDate: which.startDate, toDate: which.endDate})
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
    '& button': {
      width: '100%'
    }
  },
  inputDateCustom: {
    fontSize: '13px !important',
    height: '45px !important',
    marginTop: '7px',
    width: '100% !important',
    '& div': {
      fontSize: '13px !important'
    },
    '& label': {
      top: '20px !important',
      lineHeight: '5px !important'
    },
    '& input': {
      marginTop: '0 !important'
    },
    '& div:first-child': {
      height: '45px !important'
    },
    '& div:first-child div:first-child': {
      transform: 'translate(0px, 0px) !important'
    }
  },
  clear: {
    position: 'absolute',
    bottom: '0',
    display: 'flex',
    justifyContent: 'space-between',
    borderRadius: '3px',
    margin: '10px',
    width: '140px',
    '& > div': {
      width: '100%'
    },
    '& button': {
      margin: '0 5px!important',
      width: '100%',
      background: '#5d6474 !important',
      minWidth: 'unset !important',
      lineHeight: '0 !important',
      height: '26px !important',
      '& svg': {
        width: '18px !important',
        height: '18px !important'
      },
      '& span': {
        textTransform: 'none !important',
        color: '#fff !important'
      }
    }
  },
  submit: {
    position: 'absolute',
    bottom: '0',
    backgroundColor: '#5d6474',
    borderRadius: '3px',
    margin: '10px',
    width: '140px',
    '& button': {
      width: '100%',
      '& span': {
        textTransform: 'none !important',
        color: '#fff !important'
      }
    }
  }
})(DateToDateField)
