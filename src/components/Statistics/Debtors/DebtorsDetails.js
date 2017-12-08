import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import {compose, withState} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import {DateField} from '../../ReduxForm'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../../Loader'
import ToolTip from '../../ToolTip'
import Paper from 'material-ui/Paper'
import List from 'material-ui/svg-icons/action/list'
import EditButton from 'material-ui/svg-icons/editor/mode-edit'
import CloseButton from 'material-ui/svg-icons/navigation/close'
import numberFormat from '../../../helpers/numberFormat'
import getConfig from '../../../helpers/getConfig'
import dateFormat from '../../../helpers/dateFormat'

const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            padding: '100px 0',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        detailLoader: {
            extend: 'loader',
            padding: '50px 0'
        },
        list: {
            cursor: 'pointer',
            transition: 'all 200ms ease',
            '&:hover': {
                background: '#fafafa',
                '& div:last-child': {
                    opacity: '1 !important'
                }
            },
            '&:last-child:after': {
                display: 'none'
            }
        },
        button: {
            opacity: '0',
            paddingRight: '0',
            transition: 'all 200ms ease'
        },
        expandedList: {
            extend: 'list',
            background: '#fcfcfc !important',
            position: 'relative',
            cursor: 'auto',
            '& > div:first-child': {
                fontWeight: '600',
                cursor: 'pointer'
            }
        },
        editButton: {
            height: '55px',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            '& svg': {
                width: '22px !important',
                height: '22px !important'
            }
        },
        detail: {
            width: '100%',
            fontWeight: '400 !important',
            display: 'block !important',
            borderTop: '1px #efefef solid',
            '& .dottedList': {
                '&:first-child': {
                    color: '#666',
                    fontWeight: '600'
                },
                '& > div': {
                    padding: '0 5px'
                },
                '& > div:nth-child(2)': {
                    textAlign: 'left'
                },
                '& > div:nth-child(3)': {
                    textAlign: 'left'
                },
                '&:last-child:after': {
                    display: 'none'
                }
            }
        },
        editDatesDialog: {
            position: 'fixed',
            background: 'rgba(0,0,0, 0.54)',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '999'
        },
        dialogWrapper: {
            width: '400px',
            position: 'relative'
        },
        closeButton: {
            '& svg': {
                width: '22px !important',
                height: '22px !important'
            }
        },
        dialogHeader: {
            padding: '0 5px 0 30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '50px',
            borderBottom: '1px #efefef solid',
            fontWeight: '600'
        },
        dialogContent: {
            padding: '20px 30px'
        },
        inputDateCustom: {
            height: '45px !important',
            '& input': {
                marginTop: '0 !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& div': {
                fontSize: '13px !important',
                height: '45px !important',
                width: '100% !important'
            }
        },
        dialogFooter: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '8px',
            borderTop: '1px #efefef solid'
        }
    }),
    reduxForm({
        form: 'StatDebtorsForm',
        enableReinitialize: true
    }),
    withState('editDates', 'setEditDates', false)
)

const DebtorsDetails = enhance((props) => {
    const {
        id,
        classes,
        listData,
        detailData,
        statDebtorsDialog,
        handleOpenCloseDetail,
        editDates,
        setEditDates,
        handleSubmitMultiUpdate
    } = props

    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const detail = _.find(_.get(listData, 'data'), (item) => {
        return _.get(item, ['client', 'id']) === id
    })
    const detailList = _.map(_.get(detailData, 'data'), (item) => {
        const detailId = _.get(item, 'id')
        const createdDate = dateFormat(_.get(item, 'createdDate'))
        const totalPrice = numberFormat(_.get(item, 'totalPrice'), primaryCurrency)
        const totalBalance = numberFormat(_.get(item, 'totalBalance'), primaryCurrency)
        const paymentType = _.get(item, 'paymentType')
        const totalExpected = numberFormat(_.toInteger(_.get(item, 'totalPrice')) - _.toInteger(_.get(item, 'totalBalance')), primaryCurrency)
        return (
            <Row key={detailId} className="dottedList">
                <div style={{flexBasis: '9%', maxWidth: '9%'}}>{detailId}</div>
                <div style={{flexBasis: '21%', maxWidth: '21%'}}>{createdDate}</div>
                <div style={{flexBasis: '14%', maxWidth: '14%'}}>{(paymentType === 'cash') ? 'Нал.' : 'Переч.'}</div>
                <div style={{flexBasis: '19%', maxWidth: '19%'}}>{totalPrice}</div>
                <div style={{flexBasis: '15%', maxWidth: '15%'}}>{totalBalance}</div>
                <div style={{flexBasis: '15%', maxWidth: '15%'}}>{totalExpected}</div>
                <div style={{flexBasis: '7%', maxWidth: '7%', paddingRight: '0'}}>
                    <IconButton
                        disableTouchRipple={true}
                        onTouchTap={() => { statDebtorsDialog.handleOpenStatDebtorsDialog(id) }}>
                        <List color="#12aaeb"/>
                    </IconButton>
                </div>
            </Row>
        )
    })
    const ordersArray = _.map(_.get(detailData, 'data'), item => _.get(item, 'id'))
    const client = _.get(detail, ['client', 'name'])
    const deptSum = numberFormat(_.get(detail, 'debtSum'), getConfig('PRIMARY_CURRENCY'))
    const expectSum = numberFormat(_.get(detail, 'expectSum'), getConfig('PRIMARY_CURRENCY'))

    return (
        <div>
            <Paper zDepth={1} className={classes.expandedList}>
                <Row onTouchTap={() => { handleOpenCloseDetail.handleCloseDetail(id) }}>
                    <Col xs={4}>{client}</Col>
                    <Col xs={2}>{deptSum}</Col>
                    <Col xs={2}>{expectSum}</Col>
                    <Col xs={2}>{deptSum}</Col>
                    <Col xs={2}>{expectSum}</Col>
                </Row>
                <div className={classes.detail}>
                    <Row className="dottedList">
                        <div style={{flexBasis: '9%', maxWidth: '9%'}}>№ заказа</div>
                        <div style={{flexBasis: '21%', maxWidth: '21%'}}>Ожидаемая дата оплаты</div>
                        <div style={{flexBasis: '14%', maxWidth: '14%'}}>Тип оплаты</div>
                        <div style={{flexBasis: '19%', maxWidth: '19%'}}>Сумма заказа</div>
                        <div style={{flexBasis: '15%', maxWidth: '15%'}}>Оплачено</div>
                        <div style={{flexBasis: '15%', maxWidth: '15%'}}>Долг</div>
                        <div style={{flexBasis: '7%', maxWidth: '7%', paddingRight: '0'}}>
                            <div className={classes.editButton}>
                                <ToolTip position="left" text={'Изменить дату оплаты'}>
                                    <IconButton
                                        onTouchTap={() => { setEditDates(true) }}
                                        disableTouchRipple={true}>
                                        <EditButton color="#666"/>
                                    </IconButton>
                                </ToolTip>
                            </div>
                        </div>
                    </Row>
                    {_.get(detailData, 'detailLoading')
                        ? <div className={classes.detailLoader}>
                            <Loader size={0.75}/>
                        </div>
                        : detailList}
                </div>
            </Paper>

            {editDates &&
            <div className={classes.editDatesDialog}>
                <Paper zDepth={2} className={classes.dialogWrapper}>
                    <div className={classes.dialogHeader}>
                        <span>Изменение даты оплаты</span>
                        <IconButton
                            onTouchTap={() => { setEditDates(false) }}
                            className={classes.closeButton}>
                            <CloseButton color={'#666'}/>
                        </IconButton>
                    </div>
                    <div className={classes.dialogContent}>
                        <Field
                            name={'paymentDate'}
                            label={'Дата оплаты'}
                            className={classes.inputDateCustom}
                            hintStyle={{fontSize: '13px'}}
                            inputStyle={{fontSize: '13px'}}
                            component={DateField}
                            fullWidth={true}
                        />
                    </div>
                    <div className={classes.dialogFooter}>
                        <FlatButton
                            label={'Сохранить'}
                            onTouchTap={() => {
                                handleSubmitMultiUpdate(ordersArray)
                                setEditDates(false)
                            }}
                            labelStyle={{color: '#12aaeb', fontWeight: '600'}}
                        />
                    </div>
                </Paper>
            </div>}
        </div>
    )
})

DebtorsDetails.propTypes = {
    listData: PropTypes.object,
    detailData: PropTypes.object,
    statDebtorsDialog: PropTypes.shape({
        openStatDebtorsDialog: PropTypes.number.isRequired,
        handleCloseStatDebtorsDialog: PropTypes.func.isRequired,
        handleOpenStatDebtorsDialog: PropTypes.func.isRequired
    }).isRequired
}

export default DebtorsDetails
