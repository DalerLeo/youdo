import _ from 'lodash'
import React from 'react'
import {compose, withState, withPropsOnChange} from 'recompose'
import injectSheet from 'react-jss'

const FIRST_DAY = 1
const LAST_DAY = 31
const days = _.map(_.range(FIRST_DAY, LAST_DAY + FIRST_DAY), (item) => {
    return {
        id: item,
        name: item,
        active: false
    }
})
days.push('', '', '', '')
const enhance = compose(
    injectSheet({
        weeks: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
        },
        weekItem: {
            color: '#666',
            width: 'calc((100% / 7) - 5px)',
            marginBottom: '5px',
            height: '32px',
            display: 'flex',
            background: '#efefef',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 200ms ease',
            '&:nth-child(7n + 7)': {
                marginRight: '0'
            }
        },
        weekItemDisabled: {
            color: '#666',
            width: 'calc((100% / 7) - 5px)',
            marginBottom: '5px',
            height: '32px',
            background: 'transparent'
        },
        weekItemActive: {
            extend: 'weekItem',
            background: '#8de2b3',
            color: '#fff',
            fontWeight: '600'
        }
    }),
    withState('activeDays', 'updateDays', days),
    withPropsOnChange((props, nextProps) => {
        return _.get(props, ['input', 'value']) !== _.get(nextProps, ['input', 'value'])
    }, (props) => {
        _.map(days, (item) => {
            if (item.id) {
                item.active = false
            }
        })
        _.map(_.get(props, ['input', 'value']), (obj) => {
            _.map(days, (item) => {
                if (obj.id === item.id) {
                    item.active = true
                }
            })
        })
    }),
)

const PlanChooseMonthDay = enhance((props) => {
    const {
        activeDays,
        updateDays,
        classes,
        input
    } = props

    const func = (day) => {
        const weekToActive = _.find(activeDays, {'id': day})
        weekToActive.active = !weekToActive.active
        updateDays(days)
        input.onChange(_.filter(activeDays, (d) => {
            return d.active === true
        }))
    }
    return (
        <div className={classes.weeks}>
            {_.map(activeDays, (w, i) => {
                const id = _.get(w, 'id')
                const name = _.get(w, 'name')
                const active = _.get(w, 'active')
                if (id) {
                    return (
                        <div
                            key={i}
                            onClick={() => { func(id) }}
                            className={active ? classes.weekItemActive : classes.weekItem}>
                            {name}
                        </div>
                    )
                }
                return (
                    <div
                        key={i}
                        className={classes.weekItemDisabled}>
                        {name}
                    </div>
                )
            })}
        </div>
    )
})

export default PlanChooseMonthDay
