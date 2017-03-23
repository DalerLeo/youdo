import React from 'react'
import {Loader, Dimmer} from 'semantic-ui-react'

const SaveLoader = (props) => {
    const {
        isLoading,
        ...defaultProps
    } = props

    return (
        <Dimmer active={isLoading} {...defaultProps}>
            <Loader>Save</Loader>
        </Dimmer>
    )
}

export default SaveLoader
