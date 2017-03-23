import React from 'react'
import {Modal, Button, Icon, Header} from 'semantic-ui-react'

const ConfirmationModal = (props) => {
    const {content, text, open, onClose, onConfirm} = props

    return (
        <Modal dimmer="blurring" open={open} className="tiny">
            <Header icon="archive" content={content} />
            <Modal.Content image>
                <h3>{text}</h3>
            </Modal.Content>
            <Modal.Actions>
                <Button color="red" onClick={onClose}>
                    <Icon name="remove" /> No
                </Button>
                <Button color="green" onClick={onConfirm}>
                    <Icon name="checkmark" /> Yes
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

ConfirmationModal.propTypes = {
    content: React.PropTypes.string,
    text: React.PropTypes.string,
    open: React.PropTypes.bool,
    onClose: React.PropTypes.func.isRequired,
    onConfirm: React.PropTypes.func.isRequired
}

export default ConfirmationModal
