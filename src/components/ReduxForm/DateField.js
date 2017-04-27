/* eslint no-invalid-this: 0 */
/* eslint no-undefined: 0 */

import React from 'react'
import DatePicker from 'material-ui/DatePicker'

const DateField = ({input, meta: {error}}) => {
    return (
        <div>
            <DatePicker {...input} />
            {error && <span>{error}</span>}
        </div>
    )
}

export default DateField
