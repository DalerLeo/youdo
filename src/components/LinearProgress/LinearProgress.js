import React from 'react'

const LinearProgress = (props) => {
    return (
        <div {...props} className="progress">
            <div className="indeterminate"></div>
        </div>

    )
}

export default LinearProgress