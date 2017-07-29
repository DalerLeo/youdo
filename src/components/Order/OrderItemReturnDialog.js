import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withReducer} from 'recompose'
import injectSheet from 'react-jss'
import {reduxForm} from 'redux-form'
import moment from 'moment'
import Dialog from 'material-ui/Dialog'
import CircularProgress from 'material-ui/CircularProgress'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import CloseIcon2 from '../CloseIcon2'
import MainStyles from '../Styles/MainStyles'
import numberFormat from '../../helpers/numberFormat'
import getConfig from '../../helpers/getConfig'

export const ORDER_ITEM_RETURN_DIALOG_OPEN = 'openOrderItemReturnDialog'
const enhance = compose(
    injectSheet(_.merge(MainStyles, {
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
                },

            }
        }
    })),
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
    const date = moment(_.get(returnListData, 'createdDate')).format('DD.MM.YYYY')
    const firstName = _.get(returnListData, ['createdBy', 'firstName'])
    const secondName = _.get(returnListData, ['createdBy', 'secondName'])
    const comment = _.get(returnListData, 'comment')
    const totalPrice = numberFormat(_.get(returnListData, 'totalPrice'))
    const productList = _.map(_.get(returnListData, 'returnedProducts'), (item) => {
        const product = _.get(item, 'product')
        const amount = _.get(item, 'amount')
        const returnId = _.get(item, 'id')
        return (
            <Row key={returnId} className="dottedList">
                <Col xs={3}>{product}</Col>
                <Col xs={3}>{amount}</Col>
                <Col xs={3}>Цена</Col>
                <Col xs={3}>{totalPrice}</Col>
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
                                <div>Экспедитор: <span style={{fontWeight: '600'}}>{firstName} {secondName}</span></div>
                            </div>
                            <div style={{marginTop: '20px'}}>
                                <span>Дата возврата</span>
                                <span>{date}</span>
                            </div>
                        </div>
                        <div className={classes.returnedItems}>
                            <Row className="dottedList">
                                <Col xs={3}>Товар</Col>
                                <Col xs={3}>Количество</Col>
                                <Col xs={3}>Цена ({getConfig('PRIMARY_CURRENCY')})</Col>
                                <Col xs={3}>Сумма ({getConfig('PRIMARY_CURRENCY')})</Col>
                            </Row>
                            {productList}
                        </div>
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
