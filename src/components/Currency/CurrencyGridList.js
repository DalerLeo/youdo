import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import Dollar from 'material-ui/svg-icons/editor/monetization-on'
import Delete from 'material-ui/svg-icons/action/delete'
import * as ROUTES from '../../constants/routes'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FlatButton from 'material-ui/FlatButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Edit from 'material-ui/svg-icons/image/edit'
import CurrencyCreateDialog from './CurrencyCreateDialog'
import AddCourseDialog from './AddCourseDialog'
import HistoryListDialog from './HistoryListDialog'
import ConfirmDialog from '../ConfirmDialog'
import GridList from '../GridList'
import Container from '../Container'
import Tooltip from '../ToolTip'
import getConfig from '../../helpers/getConfig'
import numberFormat from '../../helpers/numberFormat'
import toBoolean from '../../helpers/toBoolean'
import SettingSideMenu from '../Settings/SettingsSideMenu'
import dateTimeFormat from '../../helpers/dateTimeFormat'

const listHeader = [
    {
        sorting: true,
        name: 'id',
        xs: 1,
        title: '№'
    },
    {
        sorting: false,
        name: 'name',
        xs: 3,
        title: 'Валюта'
    },
    {
        sorting: true,
        xs: 4,
        name: 'rate',
        title: 'Курс'
    },
    {
        sorting: true,
        xs: 3,
        name: 'created_date',
        title: 'Дата обновления'
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
        loader: {
            width: '100%',
            height: '100%',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        addButton: {
            '& svg': {
                width: '14px !important',
                height: '14px !important'
            }
        },
        semibold: {
            display: 'flex',
            position: 'relative',
            fontWeight: '600'
        },
        editContent: {
            width: '100%',
            backgroundColor: '#fff',
            color: '#333',
            padding: '20px 30px',
            marginBottom: '15px',
            '&>div': {
                marginBottom: '10px',
                '&:last-child': {
                    margin: '0'
                }
            }
        },
        wrap: {
            display: 'flex',
            minHeight: 'calc(100% - 120px)'
        },
        leftSide: {
            flexBasis: '25%'
        },
        list: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 30px',
            borderBottom: '1px #efefef solid',
            cursor: 'pointer',
            '& > div:first-child': {
                fontWeight: '600'
            },
            '& > div:last-child': {
                textAlign: 'right'
            }
        },
        cursor: {
            cursor: 'pointer'
        },
        rightTitle: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        btnSend: {
            color: '#12aaeb !important'
        },
        btnAdd: {
            right: '0',
            color: '#8acb8d !important',
            position: 'absolute'
        },
        btnRemove: {
            color: '#e57373 !important'
        },
        outerTitle: {
            extend: 'flex',
            justifyContent: 'space-between',
            fontWeight: '600',
            paddingBottom: '10px',
            paddingTop: '5px',
            '& a': {
                padding: '2px 10px',
                border: '1px solid',
                borderRadius: '2px',
                marginLeft: '12px'
            }
        },
        buttons: {
            float: 'right',
            textAlign: 'right'
        },
        rightPanel: {
            background: '#fff',
            flexBasis: 'calc(100% - 225px)',
            maxWidth: 'calc(100% - 225px)',
            paddingTop: '10px',
            overflowY: 'hidden',
            overflowX: 'hidden'
        },
        iconBtn: {
            display: 'flex',
            opacity: '0',
            transition: 'all 200ms ease-out'
        },
        listRow: {
            margin: '0 -30px !important',
            width: 'auto !important',
            padding: '0 30px',
            cursor: 'pointer',
            '&:hover > div:last-child > div ': {
                opacity: '1'
            }
        },
        listRowDisabled: {
            extend: 'listRow',
            color: '#b8b8b8 !important'
        }
    })
)
const iconStyle = {
    icon: {
        color: '#666',
        width: 22,
        height: 22
    },
    button: {
        width: 30,
        height: 25,
        padding: 0
    }
}
const MINUS_ONE = -1

const CurrencyGridList = enhance((props) => {
    const {
        createDialog,
        updateDialog,
        actionsDialog,
        confirmDialog,
        listData,
        detailData,
        classes,
        detailId,
        courseDialog,
        detailFilter
    } = props

    const actions = (
        <div>
            <IconButton onTouchTap={actionsDialog.handleActionEdit}>
                <ModEditorIcon/>
            </IconButton>

            <IconButton onTouchTap={actionsDialog.handleActionDelete}>
                <Delete/>
            </IconButton>
        </div>
    )
    const currentCurrency = getConfig('PRIMARY_CURRENCY')
    const reversedRate = !toBoolean(getConfig('REVERSED_CURRENCY_RATE'))
    const currency = _.get(_.find(_.get(listData, 'data'), (o) => {
        return o.id === _.toInteger(_.get(detailData, 'id'))
    }), 'name')
    const currencyList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const rate = numberFormat(_.get(item, ['rate', 'rate']))
        const createdDate = dateTimeFormat(_.get(item, ['rate', 'createdDate']))
        if (name !== currentCurrency) {
            return (
                <Row key={id} className={classes.listRow}>
                    <Col xs={1} onClick={() => { listData.handleCurrencyClick(id) }}>{id}</Col>
                    <Col xs={3} className={classes.cursor} onClick={() => { listData.handleCurrencyClick(id) }}>{name}</Col>
                    <Col xs={4} onClick={() => { listData.handleCurrencyClick(id) }}>1 {reversedRate ? name : currentCurrency} = {rate} {reversedRate ? currentCurrency : name}</Col>
                    <Col xs={3} onClick={() => { listData.handleCurrencyClick(id) }}>{createdDate}</Col>
                    <Col xs={1} style={{textAlign: 'right'}}>
                        <div className={classes.iconBtn}>
                            <Tooltip position="bottom" onClick={courseDialog.handleOpenCourseDialog} text="Установить курс">
                                <IconButton
                                    iconStyle={iconStyle.icon}
                                    style={iconStyle.button}
                                    disableTouchRipple={true}
                                    touch={true}
                                    onTouchTap={() => { courseDialog.handleOpenCourseDialog(id) }}>
                                    <Dollar/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip position="bottom" text="Изменить">
                                <IconButton
                                    iconStyle={iconStyle.icon}
                                    style={iconStyle.button}
                                    disableTouchRipple={true}
                                    touch={true}
                                    onTouchTap={() => {
                                        updateDialog.handleOpenUpdateDialog(id)
                                    }}>
                                    <Edit/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip position="bottom" text="Удалить">
                                <IconButton
                                    disableTouchRipple={true}
                                    iconStyle={iconStyle.icon}
                                    style={iconStyle.button}
                                    onTouchTap={() => {
                                        confirmDialog.handleOpenConfirmDialog(id)
                                    }}
                                    touch={true}>
                                    <Delete/>
                                </IconButton>
                            </Tooltip>
                        </div>
                    </Col>
                </Row>
            )
        }

        return (
            <Row key={id} className={classes.listRowDisabled}>
                <Col xs={1}>{id}</Col>
                <Col xs={3}>{name}</Col>
                <Col xs={4}>1 {reversedRate ? name : currentCurrency} = {rate} {reversedRate ? currentCurrency : name}</Col>
                <Col xs={3}>{createdDate}</Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: currencyList,
        loading: _.get(listData, 'listLoading')
    }
    const currentDetail = _.find(_.get(listData, 'data'), {'id': _.toInteger(detailId)})
    const confirmMessage = 'Валюта: ' + _.get(currentDetail, 'name')
    const listLoading = _.get(listData, 'listLoading')
    const detail = <span></span>

    const addButton = (
        <div className={classes.addButtonWrapper}>
            <FlatButton
                backgroundColor="#fff"
                labelStyle={{textTransform: 'none', paddingLeft: '2px', color: '#12aaeb', fontSize: '13px'}}
                className={classes.addButton}
                label="добавить валюту"
                onTouchTap={createDialog.handleOpenCreateDialog}
                icon={<ContentAdd color="#12aaeb"/>}>
            </FlatButton>
        </div>
    )

    return (
        <Container>
            <div className={classes.wrapper}>
                <SettingSideMenu currentUrl={ROUTES.CURRENCY_LIST_URL}/>
                <div className={classes.rightPanel}>
                    <div>
                        <div className={classes.editContent}>
                            <div className={classes.semibold}>Основная валюта: <b>&nbsp;{currentCurrency}</b><i
                                style={{fontWeight: '400', color: '#999'}}>
                                &nbsp;(используется при формировании стоимости продукта / заказа)</i>
                            </div>
                        </div>
                    </div>
                    <div>
                        <GridList
                            filter={detailFilter}
                            list={list}
                            actionsDialog={actions}
                            loading={listLoading}
                            addButton={addButton}
                            detail={detail}
                            listShadow={false}
                        />
                    </div>
                </div>

                <CurrencyCreateDialog
                    initialValues={createDialog.initialValues}
                    open={createDialog.openCreateDialog}
                    loading={createDialog.createLoading}
                    onClose={createDialog.handleCloseCreateDialog}
                    onSubmit={createDialog.handleSubmitCreateDialog}
                />

                <HistoryListDialog
                    open={_.get(detailData, 'open')}
                    filter={detailFilter}
                    currency={currency}
                    data={detailData}
                    onClose={detailData.handleClose}
                    listData={listData}
                    loading={listLoading}/>

                <CurrencyCreateDialog
                    isUpdate={true}
                    initialValues={updateDialog.initialValues}
                    open={updateDialog.openUpdateDialog}
                    loading={updateDialog.updateLoading}
                    onClose={updateDialog.handleCloseUpdateDialog}
                    onSubmit={updateDialog.handleSubmitUpdateDialog}
                />

                <AddCourseDialog
                    initialValues={courseDialog.initialValues}
                    open={courseDialog.openCourseDialog}
                    onClose={courseDialog.handleCloseCourseDialog}
                    onSubmit={courseDialog.handleSubmitCourseDialog}
                />

                {detailId !== MINUS_ONE && <ConfirmDialog
                    type="delete"
                    message={confirmMessage}
                    onClose={confirmDialog.handleCloseConfirmDialog}
                    onSubmit={confirmDialog.handleSendConfirmDialog}
                    open={confirmDialog.openConfirmDialog}
                />}
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
    courseDialog: PropTypes.shape({
        openCourseDialog: PropTypes.bool.isRequired,
        handleOpenCourseDialog: PropTypes.func.isRequired,
        handleCloseCourseDialog: PropTypes.func.isRequired,
        handleSubmitCourseDialog: PropTypes.func.isRequired
    }).isRequired,
    actionsDialog: PropTypes.shape({
        handleActionEdit: PropTypes.func.isRequired,
        handleActionDelete: PropTypes.func.isRequired
    }).isRequired
}

export default CurrencyGridList
