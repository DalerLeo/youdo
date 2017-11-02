/* eslint no-invalid-this: 0 */
/* eslint no-undefined: 0 */

import _ from 'lodash'
import React from 'react'
import injectSheet from 'react-jss'
import PropTypes from 'prop-types'
import {DateRange} from 'react-date-range-ru'
import {Popover, FlatButton} from 'material-ui'
import dateFormat from '../../../helpers/dateFormat'
import MUITextField from 'material-ui/TextField'
import moment from 'moment'
import {hashHistory} from 'react-router'

const MINUS_ONE = -1
const MINUS_SEVEN = -7
const MINUS_THIRTY = -30
const x = new Date()
const TODAY = x.getDate()
const MONTH = x.getMonth()
const ZERO = 0
const ONE = 1
const TWO = 2
const FOUR = 4
const SIX = 6
const SEVEN = 7
const NINE = 9
const ELEVEN = 11
const THIRTY = 30
const THIRTY_ONE = 31
const DAY_OF_LAST_MONTH = (MONTH === ZERO || MONTH === TWO || MONTH === FOUR || MONTH === SIX || MONTH === SEVEN || MONTH === NINE || MONTH === ELEVEN)
    ? THIRTY_ONE : THIRTY
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
    },
    'Последние 30 дней': {
        startDate: (now) => {
            return now.add(MINUS_THIRTY, 'days')
        },
        endDate: (now) => {
            return now
        }
    },
    'Прев. месяц': {
        startDate: (now) => {
            return now.add((TODAY + DAY_OF_LAST_MONTH) * MINUS_ONE, 'day')
        },
        endDate: (now) => {
            return now.add(TODAY * MINUS_ONE, 'day')
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
        const {label, classes, input, meta: {error}, filter} = this.props
        const {
            open,
            anchorEl
        } = this.state
        const startDate = dateFormat(_.get(input, ['value', 'startDate']))
        const endDate = dateFormat(_.get(input, ['value', 'endDate']))
        const dateLabel = error || (!startDate)
            ? '' : startDate + ' - ' + endDate
        const onChange = (inputDate) => {
            const beginDateUrl = moment(_.get(inputDate, 'startDate')).format('YYYY-MM-DD')
            const endDateUrl = moment(_.get(inputDate, 'endDate')).format('YYYY-MM-DD')
            input.onChange(inputDate)
            hashHistory.push(filter.createURL({beginDate: beginDateUrl, endDate: endDateUrl}))
        }
        return (

            <div>
                <div className={classes.button}>
                    <MUITextField
                        name="dateField"
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
                        <div
                            className={classes.clear}
                            onClick={() => { input.onChange({startDate: undefined, endDate: undefined}) }}>
                            <FlatButton
                                label="Очистить"
                                labelStyle={{fontSize: '13px'}}
                            />
                        </div>
                        <DateRange
                            startDate={_.get(input, ['value', 'startDate']) || moment()}
                            endDate={_.get(input, ['value', 'endDate']) || moment()}
                            lang={'ru'}
                            ranges={ range }
                            onChange={onChange}
                            theme={{
                                Calendar: {width: 350},
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
