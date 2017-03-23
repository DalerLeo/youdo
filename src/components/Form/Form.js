import React from 'react'
import SaveLoader from '../SaveLoader'

const Form = (props) => {
    const {
        loading,
        children,
        ...defaultProps
    } = props
    return (
        <form className="ui form" {...defaultProps}>
            <SaveLoader isLoading={loading} />
            {children}
        </form>
    )
}

Form.propTypes = {
    loading: React.PropTypes.bool,
    children: React.PropTypes.node
}

export default Form
