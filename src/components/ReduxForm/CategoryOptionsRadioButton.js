import React from 'react'
import _ from 'lodash'
import {compose} from 'recompose'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'

const enhance = compose()
const CategoryOptionsRadioButton = enhance((props) => {
    const {input, optionsList, loading} = props
    const value = _.toInteger(_.get(input, 'value'))

    if (loading) {
        return null
    }
    return (
        <RadioButtonGroup
            name="options"
            onChange={input.onChange}
            valueSelected={value}
            defaultSelected={value}>
            {_.map(optionsList, (item, index) => {
                const optionID = _.toInteger(_.get(item, 'id'))
                const title = _.get(item, 'title')
                return (
                    <RadioButton
                        style={{margin: '10px 16px 0 0', width: 'auto'}}
                        label={title}
                        key={index}
                        value={optionID}/>
                )
            })}
        </RadioButtonGroup>
    )
})

export default CategoryOptionsRadioButton
