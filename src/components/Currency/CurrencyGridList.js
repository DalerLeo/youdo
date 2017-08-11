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
import CircularProgress from 'material-ui/CircularProgress'
import CurrencyCreateDialog from './CurrencyCreateDialog'
import AddCourseDialog from './AddCourseDialog'
import ConfirmDialog from '../ConfirmDialog'
import GridList from '../GridList'
import Container from '../Container'
import numberFormat from '../../helpers/numberFormat'
import SettingSideMenu from '../Setting/SettingSideMenu'
import getConfig from '../../helpers/getConfig'

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
            position: 'absolute',
            right: '0'
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
        rightSide: {
            flexBasis: '75%',
            marginLeft: '28px'
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
            color: '#8acb8d !important'
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
            paddingTop: '10px',
            flexBasis: 'calc(100% - 250px)',
            maxWidth: 'calc(100% - 250px)',
            overflowY: 'auto',
            overflowX: 'hidden'
        }
    })
)
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
        const isActive = _.get(detailData, 'id') === id

        if (name !== currentCurrency) {
            return (
                <div key={id} className={classes.list}
                     style={isActive ? {backgroundColor: '#ffffff', display: 'relative'}
                         : {backgroundColor: '#f2f5f8', display: 'relative'}}
                     onClick={() => {
                         listData.handleCurrencyClick(id)
                     }}>
                    <div className={classes.title}>{name}</div>
                    <div className={classes.balance}>
                        <div>Курс: {rate}</div>
                        <div>{createdDate}</div>
                    </div>
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
        list: historyList,
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
                    <Paper zDepth={1}>
                        <div className={classes.editContent}>
                            <div className={classes.semibold}>Основная валюта: <b>&nbsp;{currentCurrency}</b><i
                                style={{fontWeight: '400', color: '#999'}}>
                                &nbsp;(используется при формировании стоимости продукта / заказа)</i>
                                {addButton}
                            </div>
                        </div>
                    </Paper>
                    <div className={classes.wrap}>
                        <div className={classes.leftSide}>
                            <div className={classes.outerTitle} style={{paddingLeft: '30px'}}>
                                <div>Валюты</div>
                            </div>
                            <Paper zDepth={1} style={{height: 'calc(100% - 18px)'}}>
                                {listLoading
                                    ? <div className={classes.loader}>
                                        <CircularProgress size={40} thickness={4}/>
                                    </div>
                                    : <div className={classes.listWrapper}>
                                        {currencyList}
                                    </div>
                                }
                            </Paper>
                        </div>
                        <div className={classes.rightSide}>
                            <div className={classes.rightTitle}>
                                <div className={classes.outerTitle}>История</div>
                                <div className={classes.outerTitle}>
                                    <div className={classes.buttons}>
                                        <a onClick={confirmDialog.handleOpenConfirmDialog}
                                           className={classes.btnRemove}>Удалить валюту</a>
                                        <a onClick={updateDialog.handleOpenUpdateDialog} className={classes.btnSend}>Изменить
                                            валюту</a>
                                        <a onClick={courseDialog.handleOpenCourseDialog} className={classes.btnAdd}>Установить
                                            курс</a>
                                    </div>
                                </div>
                            </div>
                            <GridList
                                filter={detailFilter}
                                list={list}
                                detail={detail}
                                actionsDialog={actions}
                            />

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
                    </div>
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
