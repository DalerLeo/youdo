import _ from 'lodash'
import React from 'react'
import {compose, withState, withHandlers} from 'recompose'
import Toggle from 'material-ui/Toggle'
import {hashHistory} from 'react-router'

const pathname = '/permission'

const enhance = compose(
    withState('course', 'setCourse', false),
    withHandlers({
        toggle: props => () => {
            const {input, id, filter, status, update} = props
            input.onChange()
            hashHistory.push({pathname, query: filter.getParams({id: id, status: status})})
            update()
        }
    })
)

const PermissionToggle = enhance((props) => {
    const {status} = props
    const ON = 1
    const toggleStatus = _.toInteger(status)
    return (
        <Toggle
            toggled={toggleStatus === ON}
            onToggle={props.toggle}
            label="Включить"/>
    )
})

export default PermissionToggle
