import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import CashboxCreateDialog from './CashboxCreateDialog'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import Edit from 'material-ui/svg-icons/image/edit'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Tooltip from '../ToolTip'

const listHeader = [
    {
        sorting: true,
        name: 'id',
        title: 'Id',
        xs: 2
    },
    {
        sorting: true,
        name: 'name',
        title: 'Name',
        xs: 2
    },
    {
        sorting: true,
        name: 'currency',
        title: 'Валюта',
        xs: 2
    },
    {
        sorting: true,
        name: 'cashier',
        title: 'Кассир',
        xs: 2
    },
    {
        sorting: true,
        name: 'type',
        title: 'Тип',
        xs: 2
    },
    {
        sorting: true,
        name: '',
        title: '',
        xs: 2
    }
]

const enhance = compose(
    injectSheet({
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
        }
    }),
)

const CashboxGridList = enhance((props) => {
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

    const cashboxDetail = (
        <span>a</span>
    )
    const bank = 1
    const cashboxList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const currency = _.get(item, ['currency', 'name']) || 'N/A'
        const cashier = _.get(item, ['cashier', 'firstName']) + ' ' + _.get(item, ['cashier', 'secondName'])
        const type = _.toInteger(_.get(item, 'type')) === bank ? 'банковский счет' : 'наличный'
        const iconButton = (
            <IconButton style={{padding: '0 12px'}}>
                <MoreVertIcon />
            </IconButton>
        )
        return (
            <Row key={id}>
                <Col xs={2}>{id}</Col>
                <Col xs={2}>{name}</Col>
                <Col xs={2}>{currency}</Col>
                <Col xs={2}>{cashier}</Col>
                <Col xs={2}>{type}</Col>
                <Col xs={2} style={{textAlign: 'right'}}>
                    <IconMenu
                        iconButtonElement={iconButton}
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
        list: cashboxList,
        loading: _.get(listData, 'listLoading')
    }

    return (
        <Container>
            <SubMenu url={ROUTES.CASHBOX_LIST_URL}/>

            <div className={classes.addButtonWrapper}>
                <Tooltip position="left" text="Добавить кассу">
                    <FloatingActionButton
                        mini={true}
                        className={classes.addButton}
                        onTouchTap={createDialog.handleOpenCreateDialog}>
                        <ContentAdd />
                    </FloatingActionButton>
                </Tooltip>
            </div>
            <GridList
                filter={filter}
                list={list}
                detail={cashboxDetail}
                actionsDialog={actions}
            />

            <CashboxCreateDialog
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
            />

            <CashboxCreateDialog
                initialValues={updateDialog.initialValues}
                isUpdate={true}
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

CashboxGridList.propTypes = {
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

export default CashboxGridList