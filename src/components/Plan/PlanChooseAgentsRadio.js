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
        color: '#455a64',
        fontWeight: '600',
        fill: '#455a64'
    },
    default: {
        color: '#757575',
        fill: '#757575'
    }
}

const PlanChooseAgentsRadio = (props) => {
    const {input, data, agents} = props
    const activeAgents = _.map(data, (obj) => {
        return {
            id: _.get(obj, ['agent', 'id']),
            firstName: _.get(obj, ['agent', 'firstName']),
            secondName: _.get(obj, ['agent', 'firstName'])
        }
    })
    const remainAgents = _.differenceBy(agents, activeAgents, 'id')
    const activeRadioButtons = _.map(activeAgents, (item) => {
        return (
            <RadioButton
                key={item.id}
                value={item.id}
                labelStyle={styles.active}
                iconStyle={styles.active}
                style={{width: 140, marginBottom: 10}}
                label={item.firstName}
            />
        )
    })
    const defaultRadioButtons = _.map(remainAgents, (item) => {
        return (
            <RadioButton
                key={item.id}
                value={item.id}
                labelStyle={styles.default}
                iconStyle={styles.default}
                style={{width: 140, marginBottom: 10}}
                label={item.firstName}
            />
        )
    })

    return (
        <RadioButtonGroup
            name="agent"
            style={radioButtonGroupStyle}
            onChange={input.onChange}
            valueSelected={input.value}
            defaultSelected={input.value}>
            {activeRadioButtons}
            {defaultRadioButtons}
        </RadioButtonGroup>
    )
}

export default PlanChooseAgentsRadio
