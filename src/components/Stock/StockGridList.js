import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import StockCreateDialog from './StockCreateDialog'
import ConfirmDialog from '../ConfirmDialog'
import SettingSideMenu from '../Setting/SettingSideMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FlatButton from 'material-ui/FlatButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import Edit from 'material-ui/svg-icons/image/edit'

const listHeader = [
    {
        sorting: true,
        name: 'id',
        xs: 1,
        title: 'Id'
    },
    {
        sorting: true,
        name: 'name',
        xs: 3,
        title: 'Наименование'
    },
    {
        sorting: true,
        name: 'manager',
        xs: 3,
        title: 'Завсклад'
    },
    {
        sorting: true,
        name: 'stockType',
        xs: 2,
        title: 'Тип склада'
    },
    {
        sorting: true,
        xs: 2,
        name: 'created_date',
        title: 'Дата создания'
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
        addButton: {
            '& svg': {
                width: '14px !important',
                height: '14px !important'
            }
        },
        rightPanel: {
            background: '#fff',
            flexBasis: 'calc(100% - 225px)',
            maxWidth: 'calc(100% - 225px)',
            paddingTop: '30px',
            overflowY: 'auto',
            overflowX: 'hidden',
            '& > div > div:first-child': {
                boxShadow: 'none !important'
            },
            '& > div > div:last-child > div > div': {
                boxShadow: 'none !important'
            }
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

const StockGridList = enhance((props) => {
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

    const stockDetail = (
        <span>a</span>
    )

    const main = 1

    const stockList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const manager = _.get(item, ['manager', 'firstName']) + ' ' + _.get(item, ['manager', 'secondName'])
        const stockType = _.toInteger(_.get(item, 'stockType')) === main ? 'Производственный' : 'Основной'
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')
        const iconButton = (
            <IconButton disableTouchRipple={true} className={classes.verticalButton} style={vertMenuStyle.button}>
                <MoreVertIcon />
            </IconButton>
        )
        return (
            <Row key={id} className={classes.listRow}>
                <Col xs={1}>{id}</Col>
                <Col xs={3}>{name}</Col>
                <Col xs={3}>{manager}</Col>
                <Col xs={2}>{stockType}</Col>
                <Col xs={2}>{createdDate}</Col>
                <Col xs={1} style={{textAlign: 'right'}}>
                    <IconMenu
                        iconButtonElement={iconButton}
                        iconStyle={vertMenuStyle.icon}
                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                        <MenuItem
                            primaryText="Изменить"
                            leftIcon={<Edit />}
                            onTouchTap={() => {
                                updateDialog.handleOpenUpdateDialog(id)
                            }}
                        />
                        <MenuItem
                            primaryText="Удалить "
                            leftIcon={<DeleteIcon />}
                            onTouchTap={() => {
                                confirmDialog.handleOpenConfirmDialog(id)
                            }}
                        />
                    </IconMenu>
                </Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: stockList,
        loading: _.get(listData, 'listLoading')
    }

    const addButtom = (
        <div className={classes.addButtonWrapper}>
            <FlatButton
                backgroundColor="#fff"
                labelStyle={{textTransform: 'none', paddingLeft: '2px', color: '#12aaeb'}}
                className={classes.addButton}
                label="добавить склад"
                onTouchTap={createDialog.handleOpenCreateDialog}
                icon={<ContentAdd color="#12aaeb"/>}>
            </FlatButton>
        </div>
    )

    return (
        <Container>
            <div className={classes.wrapper}>
                <SettingSideMenu currentUrl={ROUTES.STOCK_LIST_URL}/>
                <div className={classes.rightPanel}>
                    <GridList
                        filter={filter}
                        list={list}
                        detail={stockDetail}
                        filterDialog={addButtom}
                        actionsDialog={actions}
                    />
                </div>
            </div>

            <StockCreateDialog
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
            />

            <StockCreateDialog
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

StockGridList.propTypes = {
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

export default StockGridList
