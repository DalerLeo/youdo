import _ from 'lodash'
import React from 'react'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'

let days = []
const FIRST_DAY = 1
const LAST_DAY = 31
for (let i = FIRST_DAY; i <= LAST_DAY; i++) {
    const obj = {id: i, name: i, active: false}
    days.push(obj)
}
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
    withState('activeDays', 'updateDays', days)
)

const PlanChooseMonthDay = enhance((props) => {
    const {
        activeDays,
        updateDays,
        classes,
        input
    } = props

    const func = (day) => {
        const weekToActive = _.find(days, {'id': day})
        weekToActive.active = !weekToActive.active
        updateDays(days)
        input.onChange(_.filter(days, (d) => {
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
