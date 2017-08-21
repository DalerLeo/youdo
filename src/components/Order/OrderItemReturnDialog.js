import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withReducer} from 'recompose'
import injectSheet from 'react-jss'
import {reduxForm} from 'redux-form'
import Dialog from 'material-ui/Dialog'
import CircularProgress from 'material-ui/CircularProgress'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import CloseIcon2 from '../CloseIcon2'
import numberFormat from '../../helpers/numberFormat'
import getConfig from '../../helpers/getConfig'
import dateFormat from '../../helpers/dateFormat'

export const ORDER_ITEM_RETURN_DIALOG_OPEN = 'openOrderItemReturnDialog'
const enhance = compose(
    injectSheet({
        popUp: {
            color: '#333 !important',
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            height: '100%',
            marginBottom: '64px'
        },
        titleContent: {
            background: '#fff',
            color: '#333',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #efefef',
            padding: '20px 30px',
            zIndex: '999',
            '& button': {
                right: '13px',
                padding: '0 !important',
                position: 'absolute !important'
            }
        },
        inContent: {
            display: 'flex',
            maxHeight: '50vh',
            minHeight: '184px',
            overflow: 'auto',
            padding: '0 30px',
            color: '#333'
        },
        bodyContent: {
            width: '100%'
        },
        form: {
            position: 'relative'
        },
        field: {
            width: '100%'
        },
        inputField: {
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            '& div': {
                fontSize: '13px !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& input': {
                marginTop: '0 !important'
            }
        },
        bottomButton: {
            bottom: '0',
            left: '0',
            right: '0',
            padding: '10px',
            zIndex: '999',
            borderTop: '1px solid #efefef',
            background: '#fff',
            textAlign: 'right',
            '& span': {
                fontSize: '13px !important',
                fontWeight: '600 !important',
                color: '#129fdd',
                verticalAlign: 'inherit !important'
            }
        },
        inputFieldCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            '& div': {
                fontSize: '13px !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& input': {
                marginTop: '0 !important'
            }
        },
        actionButton: {
            fontSize: '13px !important',
            margin: '0 !important'
        },
        loader: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: '#fff',
            top: '0',
            left: '0',
            alignItems: 'center',
            zIndex: '999',
            textAlign: 'center',
            justifyContent: 'center',
            display: 'flex'
        },
        returnInfo: {
            padding: '25px 0',
            borderBottom: '1px #efefef solid',
            '& span': {
                display: 'block',
                '&:first-child': {
                    fontWeight: '600'
                }
            }
        },
        flex: {
            display: 'flex',
            alignItems: 'initial',
            '& > div:first-child': {
                maxWidth: '60%'
            }
        },
        returnedItems: {
            '& .dottedList': {
                padding: '20px 0 !important'
            },
            padding: '10px 0 0',
            '& .row': {
                '& > div': {
                    textAlign: 'left !important'
                },
                '&:after': {
                    left: '0.5rem',
                    right: '0.5rem'
                },
                '&:first-child': {
                    fontWeight: '600'
                },
                '&:last-child:after': {
                    position: 'static'
                },
                '& > div:nth-child(3)': {
                    textAlign: 'right !important'
                },
                '& > div:nth-child(4)': {
                    textAlign: 'right !important'
                }
            }
        },
        returnSummary: {
            borderTop: '1px #efefef solid',
            fontSize: '16px',
            fontWeight: '600',
            textAlign: 'right',
            margin: '0 -30px',
            padding: '15px 30px'
        }
    }),
    reduxForm({
        form: 'OrderCreateForm',
        enableReinitialize: true
    }),
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false}),
)

const OrderItemReturnDialog = enhance((props) => {
    const {open, loading, onClose, classes, returnListData} = props
    const id = _.get(returnListData, 'id')
    const date = dateFormat(_.get(returnListData, 'createdDate'))
    const firstName = _.get(returnListData, ['createdBy', 'firstName'])
    const secondName = _.get(returnListData, ['createdBy', 'secondName'])
    const comment = _.get(returnListData, 'comment')
    const totalPrice = numberFormat(_.get(returnListData, 'totalPrice'), getConfig('PRIMARY_CURRENCY'))
    const productList = _.map(_.get(returnListData, 'returnedProducts'), (item) => {
        const product = _.get(item, ['product', 'name'])
        const measurement = _.get(item, ['product', 'measurement', 'name'])
        const amount = _.toNumber(_.get(item, 'amount'))
        const returnId = _.get(item, 'id')
        const cost = _.toNumber(_.get(item, 'price'))
        const summmary = amount * cost
        return (
            <Row key={returnId} className="dottedList">
                <Col xs={4}>{product}</Col>
                <Col xs={2}>{numberFormat(amount, measurement)}</Col>
                <Col xs={3}>{numberFormat(cost)}</Col>
                <Col xs={3}>{numberFormat(summmary)}</Col>
            </Row>
        )
    })
    return (
        <Dialog
            modal={true}
            contentStyle={loading ? {width: '300px'} : {width: '700px'}}
            open={open}
            onRequestClose={onClose}
            bodyClassName={classes.popUp}
            autoScrollBodyContent={true}>
            <div className={classes.titleContent}>
                <span>Возврат №{id}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                {loading && <div className={classes.loader}>
                    <CircularProgress size={40} thickness={4}/>
                </div>}
                <div className={classes.inContent} style={{minHeight: 'initial'}}>
                    <div className={classes.field}>
                        <div className={classes.returnInfo}>
                            <div className={classes.flex} style={{justifyContent: 'space-between'}}>
                                <div>
                                    <span>Причина возврата</span>
                                    <span>{comment}</span>
                                </div>
                                <div style={{textAlign: 'right'}}>Добавил: <span style={{fontWeight: '600'}}>{firstName} {secondName}</span></div>
                            </div>
                            <div style={{marginTop: '20px'}}>
                                <span>Дата возврата</span>
                                <span>{date}</span>
                            </div>
                        </div>
                        <div className={classes.returnedItems}>
                            <Row className="dottedList">
                                <Col xs={4}>Товар</Col>
                                <Col xs={2}>Количество</Col>
                                <Col xs={3}>Цена ({getConfig('PRIMARY_CURRENCY')})</Col>
                                <Col xs={3}>Сумма ({getConfig('PRIMARY_CURRENCY')})</Col>
                            </Row>
                            {productList}
                        </div>
                        <div className={classes.returnSummary}>Общая сумма возврата: {totalPrice}</div>
                    </div>
                </div>
            </div>
        </Dialog>
    )
})
OrderItemReturnDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    returnListData: PropTypes.object
}
export default OrderItemReturnDialog
