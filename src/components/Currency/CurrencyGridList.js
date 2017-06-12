import _ from 'lodash'
import moment from 'moment'
import sprintf from 'sprintf'
import {Link} from 'react-router'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import Delete from 'material-ui/svg-icons/action/delete'
import * as ROUTES from '../../constants/routes'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import Paper from 'material-ui/Paper'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Edit from 'material-ui/svg-icons/image/edit'
import CurrencyCreateDialog from './CurrencyCreateDialog'
import SetCurrencyDialog from './SetCurrencyDialog'
import PrimaryCurrencyDialog from './PrimaryCurrencyDialog'
import SubMenu from '../SubMenu'
import ConfirmDialog from '../ConfirmDialog'
import GridList from '../GridList'
import Tooltip from '../ToolTip'
import Container from '../Container'
import CurrencyDetails from '../Currency/CurrencyDetails'

const listHeader = [
    {
        sorting: true,
        name: 'name',
        xs: 3,
        title: 'Аббревиатура'
    },
    {
        sorting: true,
        name: 'name',
        xs: 3,
        title: 'Курс'
    },
    {
        sorting: true,
        xs: 2,
        name: 'created_date',
        title: 'Дата обновления'
    },
    {
        sorting: false,
        xs: 4,
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
        semibold: {
            fontWeight: '600'
        },
        editContent: {
            width: '100%',
            backgroundColor: '#fff',
            color: '#333',
            padding: '20px 30px',
            boxSizing: 'border-box',
            marginBottom: '30px',
            '&>div': {
                marginBottom: '10px',
                '&:last-child': {
                    margin: '0'
                }
            }
        },
        titleButtons: {
            display: 'flex',
            justifyContent: 'flex-end'
        },
        information: {
            display: 'flex',
            alignItems: 'center'
        },
        link: {
            color: '#12aaeb !important',
            borderBottom: '1px dashed #12aaeb',
            fontWeight: '600'
        }
    })
)
const iconStyle = {
    icon: {
        color: '#666',
        width: 20,
        height: 20
    },
    button: {
        width: 48,
        height: 48,
        padding: 0
    }
}
const MINUS_ONE = -1

const CurrencyGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        updateDialog,
        primaryDialog,
        actionsDialog,
        confirmDialog,
        listData,
        detailData,
        classes,
        detailId,
        detailFilter,

        setCurrencyUpdateDialog,
        currencyData
    } = props

    const actions = (
        <div>
            <IconButton onTouchTap={actionsDialog.handleActionEdit}>
                <ModEditorIcon />
            </IconButton>

            <IconButton onTouchTap={actionsDialog.handleActionDelete}>
                <Delete />
            </IconButton>
        </div>
    )
    const currency = _.find(_.get(listData, 'data'), {'id': _.toInteger(_.get(detailData, 'id'))})

    const currencyDetail = (
        <CurrencyDetails
            key={_.get(detailData, 'id')}
            currentId = {_.get(detailData, 'id')}
            data={_.get(detailData, 'data') || {}}
            listData={listData}
            loading={_.get(detailData, 'detailLoading')}
            actionsDialog={actionsDialog}
            filter={detailFilter}
            setCurrencyUpdateDialog={setCurrencyUpdateDialog}
            currency={_.get(currency, 'name')}/>
    )

    const currentCurrency = _.get(primaryDialog.primaryCurrency, 'name')

    const currencyList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const rate = _.get(item, 'rate') || 'N/A'
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')
        return (
            <Row key={id}>
                <Col xs={3}>
                    <Link to={{
                        pathname: sprintf(ROUTES.CURRENCY_ITEM_PATH, id),
                        query: filter.getParams()
                    }}>{name}</Link>
                </Col>
                <Col xs={3}>1 {currentCurrency} = {rate} {name}</Col>
                <Col xs={2}>{createdDate}</Col>
                <Col xs={2}><a onClick={() => {
                    setCurrencyUpdateDialog.handleOpenSetCurrencyDialog(id)
                }} className={classes.link}>Установить курс</a></Col>
                <Col xs={2} style={{textAlign: 'right'}}>
                    <div className={classes.titleButtons}>
                        <Tooltip position="bottom" text="Изменить">
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                touch={true}
                                onTouchTap={() => {
                                    updateDialog.handleOpenUpdateDialog(id)
                                }}>
                                <Edit />
                            </IconButton>
                        </Tooltip>
                        <Tooltip position="bottom" text="Удалить">
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                touch={true}
                                onTouchTap={() => {
                                    confirmDialog.handleOpenConfirmDialog(id)
                                }}>
                                <Delete />
                            </IconButton>
                        </Tooltip>
                    </div>
                </Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: currencyList,
        loading: _.get(listData, 'listLoading')
    }
    const currentDetail = _.find(_.get(listData, 'data'), {'id': _.toInteger(detailId)})

    return (
        <Container>
            <SubMenu url={ROUTES.CURRENCY_LIST_URL}/>
            <div className={classes.addButtonWrapper}>
                <Tooltip position="left" text="Добавить валюту">
                    <FloatingActionButton
                        mini={true}
                        className={classes.addButton}
                        onTouchTap={createDialog.handleOpenCreateDialog}>
                        <ContentAdd />
                    </FloatingActionButton>
                </Tooltip>
            </div>

            <Paper zDepth={2}>
                <div className={classes.editContent}>
                    <div className={classes.semibold}>Основная валюта <i style={{fontWeight: '400', color: '#999'}}>(используется
                        при формировании стоимости продукта / заказа)</i></div>
                    <div className={classes.information}>
                        <div style={{marginRight: '10px'}}>Выбранная валюта: <span
                            className={classes.semibold}>{currentCurrency}</span></div>
                        <a className={classes.link} onClick={primaryDialog.handlePrimaryOpenDialog}>Изменить</a>
                    </div>
                </div>
            </Paper>

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

            <SetCurrencyDialog
                initialValues={setCurrencyUpdateDialog.initialValues}
                open={setCurrencyUpdateDialog.openSetCurrencyDialog}
                loading={setCurrencyUpdateDialog.setCurrencyLoading}
                onClose={setCurrencyUpdateDialog.handleCloseSetCurrencyDialog}
                onSubmit={setCurrencyUpdateDialog.handleSubmitSetCurrencyDialog}
                currencyData={currencyData}
                currentCurrency={currentCurrency}
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

            {detailId !== MINUS_ONE && <ConfirmDialog
                type="delete"
                message={_.get(currentDetail, 'name')}
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
    setCurrencyUpdateDialog: PropTypes.shape({
        setCurrencyLoading: PropTypes.bool.isRequired,
        openSetCurrencyDialog: PropTypes.bool.isRequired,
        handleOpenSetCurrencyDialog: PropTypes.func.isRequired,
        handleCloseSetCurrencyDialog: PropTypes.func.isRequired,
        handleSubmitSetCurrencyDialog: PropTypes.func.isRequired
    }),
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
    primaryDialog: PropTypes.shape({
        primaryCurrency: PropTypes.object,
        primaryCurrencyLoading: PropTypes.bool.isRequired,
        openPrimaryDialog: PropTypes.bool.isRequired,
        handlePrimaryOpenDialog: PropTypes.func.isRequired,
        handleSubmitPrimaryDialog: PropTypes.func.isRequired
    }).isRequired,
    actionsDialog: PropTypes.shape({
        handleActionEdit: PropTypes.func.isRequired,
        handleActionDelete: PropTypes.func.isRequired
    }).isRequired,
    currencyData: PropTypes.object.isRequired
}

export default CurrencyGridList
