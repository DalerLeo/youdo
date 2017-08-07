import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import MeasurementCreateDialog from './MeasurementCreateDialog'
import ConfirmDialog from '../ConfirmDialog'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FlatButton from 'material-ui/FlatButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import SettingSideMenu from '../Setting/SettingSideMenu'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import Edit from 'material-ui/svg-icons/image/edit'

const listHeader = [
    {
        sorting: true,
        name: 'id',
        xs: 2,
        title: 'Id'
    },
    {
        sorting: true,
        name: 'name',
        xs: 9,
        title: 'Наименование'
    },
    {
        sorting: false,
        xs: 1,
        name: 'actions',
        title: ''
    }
]

const enhance = compose(
    injectSheet({
        addButton: {
            '& svg': {
                width: '14px !important',
                height: '14px !important'
            }
        },
        wrapper: {
            display: 'flex',
            margin: '0 -28px',
            height: 'calc(100% + 28px)'
        },
        addButtonWrapper: {
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            marginLeft: '-18px'
        },
        rightPanel: {
            background: '#fff',
            flexBasis: 'calc(100% - 225px)',
            maxWidth: 'calc(100% - 225px)',
            paddingTop: '10px',
            overflowY: 'auto',
            overflowX: 'hidden'
        },
        verticalButton: {
            border: '2px #dfdfdf solid !important',
            borderRadius: '50%',
            opacity: '0',
            '& > div': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
        },
        listRow: {
            margin: '0 -30px !important',
            width: 'auto !important',
            padding: '0 30px',
            '&:hover button': {
                opacity: '1'
            }
        }
    })
)

const vertMenuStyle = {
    button: {
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30
    },
    icon: {
        color: '#666',
        width: 18,
        height: 18
    }
}

const MeasurementGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        updateDialog,
        actionsDialog,
        confirmDialog,
        listData,
        detailData,
        classes
    } = props

    const actions = (
        <div>
            <IconButton onTouchTap={actionsDialog.handleActionEdit}>
                <ModEditorIcon />
            </IconButton>

            <IconButton onTouchTap={actionsDialog.handleActionDelete}>
                <DeleteIcon />
            </IconButton>
        </div>
    )

    const measurementDetail = (
        <span>a</span>
    )

    const measurementList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const iconButton = (
            <IconButton
                disableTouchRipple={true}
                className={classes.verticalButton}
                style={vertMenuStyle.button}>
                <MoreVertIcon />
            </IconButton>
        )
        return (
            <Row key={id} className={classes.listRow}>
                <Col xs={2}>{id}</Col>
                <Col xs={9}>{name}</Col>
                <Col xs={1} style={{textAlign: 'right'}}>
                    <IconMenu
                        iconButtonElement={iconButton}
                        iconStyle={vertMenuStyle.icon}
                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                        <MenuItem
                            primaryText="Изменить"
                            leftIcon={<Edit />}
                            onTouchTap={() => { updateDialog.handleOpenUpdateDialog(id) }}
                        />
                        <MenuItem
                            primaryText="Удалить "
                            leftIcon={<DeleteIcon />}
                            onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(id) }}
                        />
                    </IconMenu>
                </Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: measurementList,
        loading: _.get(listData, 'listLoading')
    }

    const addButton = (
        <div className={classes.addButtonWrapper}>
            <FlatButton
                backgroundColor="#fff"
                labelStyle={{textTransform: 'none', paddingLeft: '2px', color: '#12aaeb'}}
                className={classes.addButton}
                label="добавить измерение"
                onTouchTap={createDialog.handleOpenCreateDialog}
                icon={<ContentAdd color="#12aaeb"/>}>
            </FlatButton>
        </div>
    )

    return (
        <Container>
            <div className={classes.wrapper}>
                <SettingSideMenu currentUrl={ROUTES.MEASUREMENT_LIST_URL}/>
                <div className={classes.rightPanel}>
                    <GridList
                        filter={filter}
                        list={list}
                        detail={measurementDetail}
                        actionsDialog={actions}
                        addButton={addButton}
                        listShadow={false}
                    />
                </div>
            </div>

            <MeasurementCreateDialog
                initialValues={{}}
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
            />

            <MeasurementCreateDialog
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
                loading={confirmDialog.confirmLoading}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSendConfirmDialog}
                open={confirmDialog.openConfirmDialog}
            />}
        </Container>
    )
})

MeasurementGridList.propTypes = {
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
        confirmLoading: PropTypes.bool.isRequired,
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

export default MeasurementGridList
