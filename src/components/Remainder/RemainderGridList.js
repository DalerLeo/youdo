import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'

/* Import DeleteIcon from 'material-ui/svg-icons/action/delete'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit' */
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import RemainderCreateDialog from './RemainderCreateDialog'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Tooltip from '../ToolTip'

/* Import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import Edit from 'material-ui/svg-icons/image/edit' */
import Arrow from 'material-ui/svg-icons/navigation/arrow-drop-down-circle'
import Paper from 'material-ui/Paper'
import RemainderDetails from './RemainderDetails'

const enhance = compose(
    injectSheet({
        wrapper: {
            padding: '20px 30px',
            '& .row': {
                lineHeight: '0px'
            }
        },
        addButton: {
            '& button': {
                backgroundColor: '#275482 !important'
            }
        },
        addButtonWrapper: {
            position: 'absolute',
            top: '10px',
            right: '0',
            marginBottom: '0px'
        },
        productList: {
            padding: '20px 30px',
            display: 'flex',
            justifyContent: 'space-between'
        },
        products: {
            display: 'flex',
            '& > div': {
                marginRight: '60px',
                '&:last-child': {
                    margin: '0'
                }
            }
        }
    })
)

const iconStyle = {
    icon: {
        color: '#129fdd',
        width: 25,
        height: 25
    },
    button: {
        width: 25,
        height: 25,
        padding: 0
    }
}

const RemainderGridList = enhance((props) => {
    const {
        createDialog,
        updateDialog,
        confirmDialog,
        detailData,
        classes
    } = props

    const list = (
        <Paper zDepth={1} >
            <div className={classes.wrapper}>
                <Row>
                    <Col xs={3}>Миф морозная свежесть</Col>
                    <Col xs={3}>Стиралный порошок</Col>
                    <Col xs={3}>Наименование склада 1</Col>
                    <Col xs={2} style={{textAlign: 'right'}}>200 кг</Col>
                    <Col xs={1} style={{textAlign: 'right'}}>
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}>
                            <Arrow/>
                        </IconButton>
                    </Col>
                </Row>
            </div>
            <RemainderDetails/>
        </Paper>
    )

    return (
        <Container>
            <SubMenu url={ROUTES.REMAINDER_LIST_URL}/>
            <div className={classes.addButtonWrapper}>
                <Tooltip position="left" text="Добавить склад">
                    <FloatingActionButton
                        mini={true}
                        className={classes.addButton}
                        onTouchTap={createDialog.handleOpenCreateDialog}>
                        <ContentAdd />
                    </FloatingActionButton>
                </Tooltip>
            </div>

            {list}

            <RemainderCreateDialog
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
            />

            <RemainderCreateDialog
                isUpdate={true}
                initialValues={updateDialog.initialValues}
                open={updateDialog.openUpdateDialog}
                loading={updateDialog.updateLoading}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
            />

            {detailData.data && <ConfirmDialog
                type="delete"
                message={_.get(detailData, ['data', 'name'])}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSendConfirmDialog}
                open={confirmDialog.openConfirmDialog}
            />}
        </Container>
    )
})

RemainderGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    createDialog: PropTypes.shape({
        createLoading: PropTypes.bool.isRequired,
        openCreateDialog: PropTypes.bool.isRequired,
        handleOpenCreateDialog: PropTypes.func.isRequired,
        handleCloseCreateDialog: PropTypes.func.isRequired,
        handleSubmitCreateDialog: PropTypes.func.isRequired
    }).isRequired,
    confirmDialog: PropTypes.shape({
        openConfirmDialog: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSendConfirmDialog: PropTypes.func.isRequired
    }).isRequired,
    updateDialog: PropTypes.shape({
        updateLoading: PropTypes.bool.isRequired,
        openUpdateDialog: PropTypes.bool.isRequired,
        handleOpenUpdateDialog: PropTypes.func.isRequired,
        handleCloseUpdateDialog: PropTypes.func.isRequired,
        handleSubmitUpdateDialog: PropTypes.func.isRequired
    }).isRequired,
    actionsDialog: PropTypes.shape({
        handleActionEdit: PropTypes.func.isRequired,
        handleActionDelete: PropTypes.func.isRequired
    }).isRequired
}

export default RemainderGridList
