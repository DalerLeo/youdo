/* eslint no-invalid-this: 0 */
/* eslint no-undefined: 0 */

import _ from 'lodash'
import React from 'react'
import injectSheet from 'react-jss'
import PropTypes from 'prop-types'
import {DateRange} from 'react-date-range-ru'
import {Popover} from 'material-ui'
import dateFormat from '../../../helpers/dateFormat'
import MUITextField from 'material-ui/TextField'
import moment from 'moment'

class PlanDateToDateField extends React.Component {
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
        const WEEK = 7
        const {classes, input, meta: {error}} = this.props
        const {open, anchorEl} = this.state
        const startDate = dateFormat(_.get(input, ['value', 'fromDate'])) || dateFormat(moment())
        const endDate = dateFormat(_.get(input, ['value', 'toDate'])) || dateFormat(moment().add(WEEK, 'days'))
        const dateLabel = error || (!startDate)
            ? '' : startDate === endDate
                ? startDate : startDate + ' - ' + endDate

        const onChange = (which) => {
            input.onChange({fromDate: which.startDate, toDate: which.endDate})
        }

        const defaultStart = _.get(input, ['value', 'fromDate']) || moment()
        const defaultEnd = _.get(input, ['value', 'toDate']) || moment().add(WEEK, 'days')

        return (
            <div className={classes.button}>
                <MUITextField
                    onFocus={this.handleOnTouchTap}
                    value={dateLabel}
                    className={classes.inputDateCustom}
                />
                <Popover
                     open={open}
                     anchorEl={anchorEl}
                     onRequestClose={this.handleOnRequestClose}>
                    <DateRange
                        startDate={defaultStart}
                        endDate={defaultEnd}
                        lang={'ru'}
                        calendars={1}
                        onChange={onChange}
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
                                color: '#fff',
                                height: '42px',
                                lineHeight: '18px',
                                padding: '12px'
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
        )
    }
}

PlanDateToDateField.defaultProps = {
    format: 'DD.MM.YYYY'
}

PlanDateToDateField.propTypes = {
    format: PropTypes.string
}

export default injectSheet({
    button: {
        width: '100%',
        '& button': {
            width: '100%'
        }
    },
    inputDateCustom: {
        fontSize: '13px !important',
        height: '30px !important',
        width: '100% !important',
        cursor: 'pointer !important',
        '& div': {
            fontSize: '13px !important'
        },
        '& label': {
            top: '20px !important',
            lineHeight: '5px !important'
        },
        '& input': {
            marginTop: '0 !important',
            fontWeight: '600 !important',
            color: '#12aaeb !important'
        },
        '& div:first-child': {
            height: '30px !important'
        },
        '& hr': {
            display: 'none !important'
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
})(PlanDateToDateField)
