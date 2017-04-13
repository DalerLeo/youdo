import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import ShopDetailsMap from "../ShopDetailsMap/ShopDetailsMap";

const enhance = compose(
    injectSheet()
)

const ShopDetails = enhance(({title, open, onClose, onSubmit}) => {
    const actions = [
        <FlatButton
            label="Cancel"
            primary={true}
            onTouchTap={onClose}
        />,
        <FlatButton
            label="Create"
            primary={true}
            keyboardFocused={true}
            onTouchTap={onSubmit}
        />
    ]

    return (
        <Dialog
            title={title}
            actions={actions}
            modal={false}
            open={open}
            onRequestClose={onClose}>
            The actions in this window were passed in as an array of React objects.
        </Dialog>
    )
})

ShopDetails.propTyeps = {
    title: React.PropTypes.string.isRequired,
    open: React.PropTypes.bool.isRequired,
    onClose: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func.isRequired,
    loading: React.PropTypes.bool.isRequired
}

export default ShopDetails
