import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {weeks} from '../../containers/Plan/PlanList'

const enhance = compose(
    injectSheet({
        weeks: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
        },
        weekItem: {
            color: '#666',
            width: '32px',
            height: '32px',
            display: 'flex',
            background: '#efefef',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 200ms ease'
        },
        weekItemActive: {
            extend: 'weekItem',
            background: '#8de2b3',
            color: '#fff',
            fontWeight: '600'
        }
    })
)

const PlanChooseWeekday = enhance((props) => {
    const {
        activeWeeks,
        updateWeeks,
        classes,
        input
    } = props

    const func = (day) => {
        const weekToActive = _.find(weeks, {'id': day})
        weekToActive.active = !weekToActive.active
        updateWeeks(weeks)
        input.onChange(_.filter(weeks, (w) => {
            return w.active === true
        }))
    }
    return (
        <div className={classes.weeks}>
            {_.map(activeWeeks, (w) => {
                const id = _.get(w, 'id')
                const name = _.get(w, 'name')
                const active = _.get(w, 'active')
                return (
                    <div
                        key={id}
                        onClick={() => { func(id) }}
                        className={active ? classes.weekItemActive : classes.weekItem}>
                        {name}
                    </div>
                )
            })}
        </div>
    )
})

export default PlanChooseWeekday
