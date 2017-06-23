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
import CircularProgress from 'material-ui/CircularProgress'
import CurrencyCreateDialog from './CurrencyCreateDialog'
import SetCurrencyDialog from './SetCurrencyDialog'
import PrimaryCurrencyDialog from './PrimaryCurrencyDialog'
import SubMenu from '../SubMenu'
import ConfirmDialog from '../ConfirmDialog'
import GridList from '../GridList'
import Tooltip from '../ToolTip'
import Container from '../Container'
import numberFormat from '../../helpers/numberFormat'

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
        },
        wrap: {
            display: 'flex',
            margin: '0 -28px',
            padding: '0 28px 0 0',
            minHeight: 'calc(100% - 41px)'
        },
        leftSide: {
            flexBasis: '25%'
        },
        rightSide: {
            flexBasis: '75%',
            marginLeft: '28px'
        }
    })
)
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
    const currencyList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        return (
            <Row key={id}>
                <Link to={{
                    pathname: sprintf(ROUTES.CURRENCY_ITEM_PATH, id),
                    query: filter.getParams()
                }}>{name}</Link>
            </Row>
        )
    })
    const currency = _.find(_.get(listData, 'data'), (o) => {
        return o.id === _.toInteger(_.get(detailData, 'id'))
    })
    const currentCurrency = _.get(primaryDialog.primaryCurrency, 'name')
    console.log(_.get(listData, 'data'), _.toInteger(_.get(detailData, 'id')), currency)

    const historyList = _.map(_.get(detailData, ['data', 'results']), (item) => {
        const currentCurrencyExp = _.get(primaryDialog.primaryCurrency, 'name')
        const id = _.get(item, 'id')
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')
        const rate = numberFormat(_.get(item, 'rate')) || 'N/A'
        return (
            <Row key={id}>
                <Col xs={4}>{id}</Col>
                <Col xs={4}>1 UZS = {rate} {currentCurrencyExp}</Col>
                <Col xs={4}>{createdDate}</Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: historyList,
        loading: _.get(detailData, 'detailLoading')
    }
    const currentDetail = _.find(_.get(listData, 'data'), {'id': _.toInteger(detailId)})
    const customData = {
        id: _.get(detailData, 'id'),
        dialog: setCurrencyUpdateDialog,
        listData: listData
    }
    const log = customData
    const detail = <div>a</div>
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
            <div className={classes.wrap}>
                <div className={classes.leftSide}>
                    <div className={classes.outerTitle} style={{paddingLeft: '30px'}}>
                        <div>Валюты</div>
                    </div>
                    <Paper zDepth={2} style={{height: '100%'}}>
                        <div className={classes.listWrapper}>
                            {_.get(listData, 'listLoading')
                                ? <div style={{textAlign: 'center'}}>
                                    <CircularProgress size={100} thickness={6}/>
                                </div>
                                : currencyList
                            }
                        </div>
                    </Paper>
                </div>
                <div className={classes.rightSide}>
                    <PrimaryCurrencyDialog
                        open={primaryDialog.openPrimaryDialog}
                        onClose={primaryDialog.handlePrimaryCloseDialog}
                        initialValues={primaryDialog.initialValues}
                        loading={primaryDialog.primaryCurrencyLoading}
                        onSubmit={primaryDialog.handleSubmitPrimaryDialog}
                    />
                    <div className={classes.outerTitle}>История</div>
                    <GridList
                        filter={detailFilter}
                        list={list}
                        detail={detail}
                        actionsDialog={actions}
                    />

                    <SetCurrencyDialog
                        initialValues={setCurrencyUpdateDialog.initialValues}
                        open={setCurrencyUpdateDialog.openSetCurrencyDialog}
                        currentId={_.get(detailData, 'id')}
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
                </div>
            </div>
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
