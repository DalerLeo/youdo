import _ from 'lodash'
import React from 'react'
import moment from 'moment'
import SelectField from '../SelectField'

const year = _.map(_.range(11), (item) => {
    const year = moment().year()
    return {
        text: year - item,
        value: year - item
    }
})

const YearSelectField = (props) => {
    return (
        <SelectField
            placeholder="Year"
            options={year}
            {...props.input}
        />
    )
}

export default YearSelectField
