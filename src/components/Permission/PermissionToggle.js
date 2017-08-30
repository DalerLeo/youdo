import React from 'react'
import {compose, withState} from 'recompose'
import Toggle from 'material-ui/Toggle'

const enhance = compose(
    withState('course', 'setCourse', false)
)

const PermissionToggle = enhance((props) => {
    const {input} = props
    return (
        <Toggle name="target" onChange={input.onChange}
            label="Включить"
        />
    )
})

export default PermissionToggle
