import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import CircularProgress from 'material-ui/CircularProgress'

const enhance = compose(
    injectSheet({
        dottedList: {
            padding: '20px 0'
        }
    }),
)

const ManufactureDetails = enhance((props) => {
    const {
        classes,
        loading,
        data,
        updateDialog,
        confirmDialog
    } = props
    const id = _.get(data, 'id')

    if (loading) {
        return (
            <div className={classes.loader}>
                <div>
                    <CircularProgress size={100} thickness={6}/>
                </div>
            </div>
        )
    }

    return (
        <div key={id} className={classes.wrapper}>
            Detail Content
        </div>
    )
})

ManufactureDetails.propTypes = {
    updateDialog: PropTypes.shape({
        handleOpenUpdateDialog: PropTypes.func.isRequired
    }),
    confirmDialog: PropTypes.shape({
        handleOpenConfirmDialog: PropTypes.func.isRequired
    })
}

export default ManufactureDetails
