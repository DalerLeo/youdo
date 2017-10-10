import _ from 'lodash'
import React from 'react'
import {compose, withPropsOnChange, withState} from 'recompose'
import injectSheet from 'react-jss'

const weeks = [
    {id: 1, name: 'Пн', active: false},
    {id: 2, name: 'Вт', active: false},
    {id: 3, name: 'Ср', active: false},
    {id: 4, name: 'Чт', active: false},
    {id: 5, name: 'Пт', active: false},
    {id: 6, name: 'Сб', active: false},
    {id: 0, name: 'Вс', active: false}
]

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
    }),
    withState('activeWeeks', 'updateWeeks', weeks),
    withPropsOnChange((props, nextProps) => {
        return (_.get(props, ['input', 'value']) !== _.get(nextProps, ['input', 'value']))
    }, (props) => {
        _.map(weeks, (item) => {
            item.active = false
        })
        _.map(_.get(props, ['input', 'value']), (obj) => {
            _.map(weeks, (item) => {
                if (obj.id === item.id) {
                    item.active = true
                }
            })
        })
    }),
)

const PlanChooseWeekday = enhance((props) => {
    const {
        // SelectedWeekDay,
        activeWeeks,
        updateWeeks,
        classes,
        input
    } = props

    const func = (day) => {
        const weekToActive = _.find(activeWeeks, {'id': day})
        weekToActive.active = !weekToActive.active
        updateWeeks(weeks)
        input.onChange(_.filter(activeWeeks, (w) => {
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
