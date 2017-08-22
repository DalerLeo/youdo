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
        const startDate = dateFormat(_.get(input, ['value', 'fromDate']))
        const endDate = dateFormat(_.get(input, ['value', 'toDate']))
        const dateLabel = error || (!startDate)
            ? '' : startDate === endDate
                ? startDate : startDate + ' - ' + endDate
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
                    <Popover className={classes.popOver}
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
                            startDate={_.get(input, ['value', 'fromDate']) || moment()}
                            endDate={_.get(input, ['value', 'toDate']) || moment()}
                            lang={'ru'}
                            ranges={ range }
                            onChange={ (which) => {
                                input.onChange({fromDate: which.startDate, toDate: which.endDate})
                            }}
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
