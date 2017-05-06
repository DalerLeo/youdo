import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import FlatButton from 'material-ui/FlatButton'
import * as ROUTES from '../../constants/routes'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import Edit from 'material-ui/svg-icons/image/edit'
import CurrencyCreateDialog from './CurrencyCreateDialog'
import PrimaryCurrencyDialog from './PrimaryCurrencyDialog'
import SubMenu from '../SubMenu'
import DeleteDialog from '../DeleteDialog'
import ConfirmDialog from '../ConfirmDialog'
import GridList from '../GridList'
import Container from '../Container'
import Tooltip from '../ToolTip'
import InfoIcon from '../InfoIcon'

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
        xs: 6,
        title: 'Наименование'
    },
    {
        sorting: true,
        xs: 3,
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
        editContent: {
            width: '100%',
            backgroundColor: '#ffffff',
            padding: '20px 30px',
            boxSizing: 'border-box',
            marginBottom: '30px',
            boxShadow: '0px 0px 3px #969696',
            color: '#464646',
            '& div:first-child': {
                fontWeight: 'bold'
            }
        },
        button: {
            padding: '0 15px',
            '& > div >span': {
                color: '#12aaeb',
                padding: '0 !important',
                textTransform: 'inherit !important',
                borderBottom: '1px dashed #12aaeb'
            }
        }
    })
)

const CurrencyGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        updateDialog,
        primaryDialog,
        actionsDialog,
        confirmDialog,
        deleteDialog,
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

    const currencyDetail = (
        <span>a</span>
    )

    const currencyList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')
        const iconButton = (
            <IconButton style={{padding: '0 12px'}}>
                <MoreVertIcon />
            </IconButton>
        )
        return (
            <Row key={id} style={{alignItems: 'center'}}>
                <Col xs={2}>{id}</Col>
                <Col xs={6}>{name}</Col>
                <Col xs={3}>{createdDate}</Col>
                <Col xs={1} style={{textAlign: 'right'}}>
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
                            onTouchTap={confirmDialog.handleOpenConfirmDialog}
                        />
                    </IconMenu>
                </Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: currencyList,
        loading: _.get(listData, 'listLoading')
    }

    return (
        <Container>
            <SubMenu url={ROUTES.CURRENCY_LIST_URL}/>
            <div className={classes.addButtonWrapper}>
                <Tooltip position="left" text="Добавить продукт">
                    <FloatingActionButton
                        mini={true}
                        className={classes.addButton}
                        onTouchTap={createDialog.handleOpenCreateDialog}>
                        <ContentAdd />
                    </FloatingActionButton>
                </Tooltip>
            </div>

            <div className={classes.editContent}>
                <div className={classes.title}>Основная валюта</div>
                <div>
                    Вибранная валюта: {_.get(primaryDialog.primaryCurrency, 'name')}
                    <FlatButton
                        label="Изменить"
                        className={classes.button}
                        onTouchTap={primaryDialog.handlePrimaryOpenDialog}/>
                </div>
                <div>
                    <IconButton>
                        <InfoIcon color="#464646"/>
                    </IconButton>
                    Lorem impus dolar
                </div>
            </div>

            <PrimaryCurrencyDialog
                open={primaryDialog.openPrimaryDialog}
                onClose={primaryDialog.handlePrimaryCloseDialog}
                initialValues={primaryDialog.initialValues}
                loading={primaryDialog.primaryCurrencyLoading}
                onSubmit={primaryDialog.handleSubmitPrimaryDialog}
            />

            <GridList
                filter={filter}
                list={list}
                detail={currencyDetail}
                actionsDialog={actions}
            />

            <CurrencyCreateDialog
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
            />

            <CurrencyCreateDialog
                isUpdate={true}
                initialValues={updateDialog.initialValues}
                open={updateDialog.openUpdateDialog}
                loading={updateDialog.updateLoading}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
            />

            <DeleteDialog
                filter={filter}
                open={deleteDialog.openDeleteDialog}
                onClose={deleteDialog.handleCloseDeleteDialog}
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

CurrencyGridList.propTypes = {
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
    deleteDialog: PropTypes.shape({
        openDeleteDialog: PropTypes.bool.isRequired,
        handleOpenDeleteDialog: PropTypes.func.isRequired,
        handleCloseDeleteDialog: PropTypes.func.isRequired
    }).isRequired,
    updateDialog: PropTypes.shape({
        updateLoading: PropTypes.bool.isRequired,
        openUpdateDialog: PropTypes.bool.isRequired,
        handleOpenUpdateDialog: PropTypes.func.isRequired,
        handleCloseUpdateDialog: PropTypes.func.isRequired,
        handleSubmitUpdateDialog: PropTypes.func.isRequired
    }).isRequired,
    primaryDialog: PropTypes.shape({
        primaryCurrency: PropTypes.object,
        primaryCurrencyLoading: PropTypes.bool.isRequired,
        openPrimaryDialog: PropTypes.bool.isRequired,
        handlePrimaryOpenDialog: PropTypes.func.isRequired,
        handleClosePrimaryDialog: PropTypes.func.isRequired,
        handleSubmitPrimaryDialog: PropTypes.func.isRequired
    }).isRequired,
    actionsDialog: PropTypes.shape({
        handleActionEdit: PropTypes.func.isRequired,
        handleActionDelete: PropTypes.func.isRequired
    }).isRequired
}

export default CurrencyGridList
