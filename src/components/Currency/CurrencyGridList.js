import _ from 'lodash'
import moment from 'moment'
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
import FlatButton from 'material-ui/FlatButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import Edit from 'material-ui/svg-icons/image/edit'
import CircularProgress from 'material-ui/CircularProgress'
import CurrencyCreateDialog from './CurrencyCreateDialog'
import AddCourseDialog from './AddCourseDialog'
import ConfirmDialog from '../ConfirmDialog'
import GridList from '../GridList'
import Container from '../Container'
import Tooltip from '../ToolTip'
import getConfig from '../../helpers/getConfig'
import numberFormat from '../../helpers/numberFormat'
import SettingSideMenu from '../Setting/SettingSideMenu'

const listHeader = [
    {
        sorting: true,
        name: 'name',
        xs: 2,
        title: '№'
    },
    {
        sorting: true,
        name: 'name',
        xs: 4,
        title: 'Курс'
    },
    {
        sorting: true,
        xs: 4,
        name: 'created_date',
        title: 'Дата обновления'
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
            opacity: '0'
        },
        listRow: {
            margin: '0 -30px !important',
            width: 'auto !important',
            padding: '0 30px',
            '&:hover > div:last-child > div ': {
                opacity: '1'
            }
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

    const currencyList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const rate = numberFormat(_.get(item, 'rate'))
        const currentCurrency = getConfig('PRIMARY_CURRENCY')
        const createdDate = moment(_.get(_.find(_.get(detailData, ['data', 'results']), {'currency': id}), 'createdDate')).format('DD.MM.YYYY')

        if (name !== currentCurrency) {
            return (
                <div className={classes.cursor} onClick={() => { listData.handleCurrencyClick(id) }}>
                    <Row key={id} className={classes.listRow}>
                        <Col xs={1}>{id}</Col>
                        <Col xs={3}>{name}</Col>
                        <Col xs={3}>Курс: {rate}</Col>
                        <Col xs={4}>{createdDate}</Col>
                        <Col xs={1} style={{textAlign: 'right'}}>
                            <div className={classes.iconBtn}>
                                <Tooltip position="bottom" text="Изменить">
                                    <IconButton
                                        iconStyle={iconStyle.icon}
                                        style={iconStyle.button}
                                        disableTouchRipple={true}
                                        touch={true}
                                        onTouchTap={() => { updateDialog.handleOpenUpdateDialog(id) }}>
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip position="bottom" text="Удалить">
                                    <IconButton
                                        disableTouchRipple={true}
                                        iconStyle={iconStyle.icon}
                                        style={iconStyle.button}
                                        onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(id) }}
                                        touch={true}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </Col>
                    </Row>
                </div>
            )
        }
        return false
    })
    const currency = _.get(_.find(_.get(listData, 'data'), (o) => {
        return o.id === _.toInteger(_.get(detailData, 'id'))
    }), 'name')

    const currentCurrency = getConfig('PRIMARY_CURRENCY')
    const reversedRate = getConfig('REVERSED_CURRENCY_RATE')
    const historyList = _.map(_.get(detailData, ['data', 'results']), (item) => {
        const id = _.get(item, 'id')
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')
        const rate = numberFormat(_.get(item, 'rate')) || 'N/A'
        return (
            <Row key={id}>
                <Col xs={2}>{id}</Col>
                <Col xs={4}>1 {reversedRate ? currency : currentCurrency} = {rate} {reversedRate ? currentCurrency : currency}</Col>
                <Col xs={4}>{createdDate}</Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: currencyList,
        loading: _.get(detailData, 'detailLoading')
    }
    const currentDetail = _.find(_.get(listData, 'data'), {'id': _.toInteger(detailId)})
    const confirmMessage = 'Валюта: ' + _.get(currentDetail, 'name')
    const listLoading = _.get(listData, 'listLoading')
    const detail = <div>a</div>

    const addButton = (
        <div className={classes.addButtonWrapper}>
            <FlatButton
                backgroundColor="#fff"
                labelStyle={{textTransform: 'none', paddingLeft: '2px', color: '#12aaeb'}}
                className={classes.addButton}
                label="добавить пользователя"
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
                    <Paper zDepth={1}>
                        <div className={classes.editContent}>
                            <div className={classes.semibold}>Основная валюта: <b>&nbsp;{currentCurrency}</b><i
                                style={{fontWeight: '400', color: '#999'}}>
                                &nbsp;(используется при формировании стоимости продукта / заказа)</i>
                                <a onClick={courseDialog.handleOpenCourseDialog} className={classes.btnAdd}>Установить курс</a>
                            </div>
                        </div>
                    </Paper>
                    <div>
                        <GridList
                            filter={detailFilter}
                            list={list}
                            actionsDialog={actions}
                            loading={listLoading}
                            addButton={addButton}
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
