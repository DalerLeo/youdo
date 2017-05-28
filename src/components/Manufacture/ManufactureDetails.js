import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Col} from 'react-flexbox-grid'
import CircularProgress from 'material-ui/CircularProgress'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import IconButton from 'material-ui/IconButton'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'

const enhance = compose(
    injectSheet({
        dottedList: {
            padding: '20px 0'
        },
        wrapper: {
            width: '100%'
        }
    }),
)

const ManufactureDetails = enhance((props) => {
    const {
        classes,
        loading,
        data,
        handleOpenUpdateDialog,
        handleOpenConfirmDialog
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
    const ingredientList = _.map(_.get(data, 'ingredient'), (item) => {
        const itemId = _.get(item, 'id')
        const ingredient = _.get(item, ['ingredient', 'name'])
        const amount = _.get(item, 'amount')
        const measurement = _.get(item, ['ingredient', 'measurement', 'name'])
        return (
        <li key={itemId} className="dottedList">
            <Col xs={7}>{ingredient}</Col>
            <Col xs={2}>{amount} {measurement}</Col>
            <Col xs={1}>
                <IconButton>
                    <ModEditorIcon />
                </IconButton>
            </Col>
            <Col xs={1}>
                <IconButton>
                    <DeleteIcon />
                </IconButton>
            </Col>
        </li>
        )
    })

    return (
        <div key={id} className={classes.wrapper}>
            Detail Content
            <button onClick={() => {
                handleOpenConfirmDialog()
            }}>Delete
            </button>
            <button onClick={() => {
                handleOpenUpdateDialog(id)
            }}>Update
            </button>
            <ul className={classes.rawMaterials}>
                <li key={id} className="dottedList">
                    <Col xs={7}>
                        <strong>Сырье</strong>
                    </Col>
                    <Col xs={2}>
                        <strong>Обьем</strong>
                    </Col>
                </li>
                {ingredientList}
            </ul>
        </div>
    )
})

ManufactureDetails.propTypes = {
    handleOpenUpdateDialog: PropTypes.func.isRequired,
    handleOpenConfirmDialog: PropTypes.func.isRequired
}

export default ManufactureDetails
