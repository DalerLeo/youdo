import _ from 'lodash'
import React from 'react'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'

const radioButtonGroupStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: '10px'
}
const styles = {
    active: {
        color: '#12aaeb',
        fill: '#12aaeb'
    },
    default: {
        color: '#333'
    }
}

const PlanChooseAgentsRadio = (props) => {
    const {input, data, agents} = props
    const radioButtons = _.map(agents, (item) => {
        return _.map(data, (obj) => {
            return (
                <RadioButton
                    key={item.id}
                    value={item.id}
                    labelStyle={obj.agent.id === item.id ? styles.active : styles.default}
                    iconStyle={obj.agent.id === item.id ? styles.active : styles.default}
                    style={{width: 140, marginBottom: 10}}
                    label={item.firstName}
                />
            )
        })
    })

    return (
        <RadioButtonGroup
            name="agents"
            style={radioButtonGroupStyle}
            onChange={input.onChange}
            defaultSelected={input.value}>
            {radioButtons}
        </RadioButtonGroup>
    )
}

export default PlanChooseAgentsRadio
