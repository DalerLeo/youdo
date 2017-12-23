import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import {compose, withState} from 'recompose'
import {reduxForm, Field, reset} from 'redux-form'
import {DateField} from '../../ReduxForm'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../../Loader'
import ToolTip from '../../ToolTip'
import Paper from 'material-ui/Paper'
import EditButton from 'material-ui/svg-icons/editor/mode-edit'
import CloseButton from 'material-ui/svg-icons/navigation/close'
import numberFormat from '../../../helpers/numberFormat'
import getConfig from '../../../helpers/getConfig'
import dateFormat from '../../../helpers/dateFormat'

const enhance = compose(
    injectSheet({
        wrapper: {
            margin: 'auto',
            width: '1000px'
        },
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
            cursor: 'auto'
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            padding: '0 10px 0 30px',
            height: '60px'
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
                height: '50px',
                padding: '0 30px',
                margin: '0',
                '&:first-child': {
                    color: '#666',
                    fontWeight: '600',
                    '& > div:last-child': {
                        opacity: '1'
                    }
                },
                '& > div': {
                    padding: '0 5px',

                    '&:first-child': {
                        paddingLeft: '0'
                    },
                    '&:last-child': {
                        paddingRight: '0',
                        textAlign: 'right',
                        opacity: '0'
                    }
                },
                '& > div:nth-child(2)': {
                    textAlign: 'left'
                },
                '& > div:nth-child(3)': {
                    textAlign: 'left'
                },
                '&:last-child:after': {
                    display: 'none'
                },
                '&:first-child:hover': {
                    background: 'unset'
                },
                '&:hover': {
                    background: '#f2f5f8',
                    '& > div:last-child': {
                        opacity: '1'
                    }
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
        },
        openDetails: {
            position: 'absolute',
            top: '0',
            bottom: '0',
            right: '0',
            left: '0',
            cursor: 'pointer'
        }
    }),
    reduxForm({
        form: 'StatDebtorsForm',
        enableReinitialize: true
    }),
    withState('editDates', 'setEditDates', false),
    withState('editId', 'setEditId', null)
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
        handleSubmitMultiUpdate,
        editId,
        setEditId
    } = props
    const resetDateField = () => {
        return props.dispatch(reset('StatDebtorsForm'))
    }
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const detail = _.find(_.get(listData, 'data'), (item) => {
        return _.get(item, ['client', 'id']) === id
    })
    const ordersArray = editId ? [editId] : _.map(_.get(detailData, 'data'), item => _.get(item, 'id'))

    const detailList = _.map(_.get(detailData, 'data'), (item) => {
        const detailId = _.get(item, 'id')
        const paymentDate = dateFormat(_.get(item, 'paymentDate'))
        const totalPrice = numberFormat(_.get(item, 'totalPrice'), primaryCurrency)
        const totalBalance = numberFormat(_.get(item, 'totalBalance'), primaryCurrency)
        const paymentType = _.get(item, 'paymentType')
        const totalExpected = numberFormat(_.toInteger(_.get(item, 'totalPrice')) - _.toInteger(_.get(item, 'totalBalance')), primaryCurrency)
        return (
            <Row key={detailId} className="dottedList">
                <a onClick={() => statDebtorsDialog.handleOpenStatDebtorsDialog(detailId)} className={classes.openDetails}></a>
                <div style={{flexBasis: '9%', maxWidth: '9%'}}>{detailId}</div>
                <div style={{flexBasis: '21%', maxWidth: '21%'}}>{paymentDate}</div>
                <div style={{flexBasis: '14%', maxWidth: '14%'}}>{(paymentType === 'cash') ? 'Нал.' : 'Переч.'}</div>
                <div style={{flexBasis: '19%', maxWidth: '19%', textAlign: 'right'}}>{totalPrice}</div>
                <div style={{flexBasis: '15%', maxWidth: '15%', textAlign: 'right'}}>{totalBalance}</div>
                <div style={{flexBasis: '15%', maxWidth: '15%', textAlign: 'right'}}>{totalExpected}</div>
                <div style={{flexBasis: '7%', maxWidth: '7%', paddingRight: '0'}}>
                    <ToolTip position="left" text={'Изменить дату оплаты'}>
                        <IconButton
                            onTouchTap={() => {
                                setEditDates(true)
                                setEditId(detailId)
                                resetDateField()
                            }}
                            disableTouchRipple={true}>
                            <EditButton color="#666"/>
                        </IconButton>
                    </ToolTip>
                </div>
            </Row>
        )
    })
    const client = _.get(detail, ['client', 'name'])
    return (
        <div className={classes.wrapper}>
            <Paper zDepth={2} className={classes.expandedList}>
                <div className={classes.header}>
                    <span>{client}</span>
                    <IconButton
                        onTouchTap={handleOpenCloseDetail.handleCloseDetail}
                        disableTouchRipple={true}>
                        <CloseButton color="#666"/>
                    </IconButton>
                </div>
                <div className={classes.detail}>
                    <Row className="dottedList">
                        <div style={{flexBasis: '9%', maxWidth: '9%'}}>№ заказа</div>
                        <div style={{flexBasis: '21%', maxWidth: '21%'}}>Ожидаемая дата оплаты</div>
                        <div style={{flexBasis: '14%', maxWidth: '14%'}}>Тип оплаты</div>
                        <div style={{flexBasis: '19%', maxWidth: '19%', textAlign: 'right'}}>Сумма заказа</div>
                        <div style={{flexBasis: '15%', maxWidth: '15%', textAlign: 'right'}}>Оплачено</div>
                        <div style={{flexBasis: '15%', maxWidth: '15%', textAlign: 'right'}}>Долг</div>
                        <div style={{flexBasis: '7%', maxWidth: '7%', paddingRight: '0'}}>
                            <div className={classes.editButton}>
                                <ToolTip position="left" text={'Изменить дату оплаты'}>
                                    <IconButton
                                        onTouchTap={() => {
                                            setEditDates(true)
                                            setEditId(null)
                                            resetDateField()
                                        }}
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
                        <span>Изменение даты оплаты {editId ? 'заказа: № ' + editId : 'всех заказов'}</span>
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
