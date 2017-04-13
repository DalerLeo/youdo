/* global Blob, URL */
import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState, withPropsOnChange} from 'recompose'
import {Modal, Dimmer, Loader} from 'semantic-ui-react'
import './DownloadDialog.css'

const enhance = compose(
    withState('downloadFile', 'setDownloadFile', null),

    // Save file in memory
    withPropsOnChange((props, nextProps) => {
        return props.open && nextProps.file && props.file !== nextProps.file
    }, (props) => {
        const {file, setDownloadFile} = props
        file && setDownloadFile(URL.createObjectURL(new Blob([file])))
    }),

    // Clear memory after download file
    withPropsOnChange((props, nextProps) => {
        return !nextProps.open && props.open !== nextProps.open && nextProps.file
    }, (props) => {
        const {downloadFile} = props
        downloadFile && _.delay(() => URL.revokeObjectURL(downloadFile), 500)
    }),
)

const DownloadDialog = enhance((props) => {
    const {open, loading, downloadFile, filename, onClose} = props
    const dimmer = props.dimmer || 'blurring'

    return (
        <Modal className="tiny" dimmer={dimmer} open={open} onClose={onClose}>
            <Modal.Content image>
                <Dimmer active={loading} inverted={true}>
                    <Loader />
                </Dimmer>
                <Modal.Description>
                    <a download={filename} href={downloadFile} onClick={onClose}>
                        <h3>Download</h3>
                    </a>
                </Modal.Description>
            </Modal.Content>
        </Modal>
    )
})

DownloadDialog.propTypes = {
    loading: PropTypes.bool.isRequired,
    file: PropTypes.any,
    filename: PropTypes.string.isRequired
}

export default DownloadDialog
