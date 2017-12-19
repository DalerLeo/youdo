import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Field, reduxForm} from 'redux-form'
import Dialog from 'material-ui/Dialog'
import Loader from '../Loader'
import {connect} from 'react-redux'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import {TextField, CheckBox} from '../ReduxForm'
import numberFormat from '../../helpers/numberFormat'
import Tooltip from '../ToolTip'

const ZERO = 0
const enhance = compose(
    injectSheet({
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
            display: ({loading}) => loading ? 'flex' : 'none'
        },
        podlojkaScroll: {
            overflowY: 'auto !important'
        },
        listLoader: {
            extend: 'loader',
            display: 'flex'
        },
        popUp: {
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            height: '100%',
            maxHeight: 'inherit !important',
            marginBottom: '64px'
        },
        titleContent: {
            background: '#fff',
            color: '#333',
            fontWeight: 'bold',
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
            color: '#333'
        },
        innerWrap: {
            maxHeight: '100vh',
            overflow: 'auto'
        },
        bodyContent: {
            color: '#333',
            width: '100%'
        },
        form: {
            position: 'relative'
        },
        field: {
            width: '100%'
        },
        half: {
            display: 'flex',
            alignItems: 'baseline',
            width: '50%'
        },
        content: {
            padding: '0 30px',
            width: '100%',
            position: 'relative'
        },
        amount: {
            '& > div': {
                display: 'inline-block',
                marginLeft: '10px',
                '& span': {
                    display: 'block'
                }
            }
        },
        list: {
            marginTop: '10px',
            '& .dottedList': {
                padding: '10px 0',
                height: '50px',
                margin: '0',
                justifyContent: 'space-between',
                '& > div': {
                    display: 'flex',
                    alignItems: 'baseline'
                },
                '&:first-child': {
                    fontWeight: '600',
                    whiteSpace: 'nowrap'
                },
                '&:last-child:after': {
                    display: 'none'
                }
            }
        },
        inputFieldCustom: {
            flexBasis: '200px',
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
                verticalAlign: 'inherit !important'
            }
        },
        actionButton: {
            fontSize: '13px !important',
            margin: '0 !important'
        }
    }),
    reduxForm({
        form: 'StockReceiveCreateForm',
        enableReinitialize: true
    }),
    connect((state) => {
        const values = _.get(state, ['form', 'StockReceiveCreateForm', 'values'])
        const formProducts = _.filter(_.get(values, 'product'), (item) => {
            const accepted = _.toNumber(_.get(item, 'accepted'))
            const defected = _.toNumber(_.get(item, 'defected'))
            return accepted > ZERO || defected || ZERO
        })
        const stock = _.map(_.get(values, 'stocks'), (item) => {
            return _.get(item, 'selected') && true
        })
        return {
            stock,
            formProducts
        }
    })
)

const customContentStyle = {
    width: '1000px',
    maxWidth: 'none'
}

const OrderCreateDialog = enhance((props) => {
    const {
        open,
        handleSubmit,
        onClose,
        classes,
        detailProducts,
        listLoading,
        isUpdate,
        handleCheckedForm,
        handleCheckedDefect,
        handleCheckNoDefect,
        stock,
        formProducts
    } = props
    const onSubmit = handleSubmit(() => props.onSubmit())
    const supplyId = _.get(detailProducts, 'id')
    const products = _.get(detailProducts, 'products')
    return (
        <Dialog
            modal={true}
            className={classes.podlojkaScroll}
            contentStyle={customContentStyle}
            open={open}
            onRequestClose={onClose}
            bodyClassName={classes.popUp}
            autoScrollBodyContent={true}>
            <div className={classes.titleContent}>
                <span>{isUpdate ? 'ИЗМЕНИТЬ ПРИЕМКУ ТОВАРА' : 'ПРИЕМКА ТОВАРА'} (Заказ №${supplyId})</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} scrolling="auto" className={classes.form}>
                    <div className={classes.loader}>
                        <Loader size={0.75}/>
                    </div>
                    <div className={classes.inContent}>
                        <div className={classes.content}>
                            {listLoading && <div className={classes.listLoader}>
                                <Loader size={0.75}/>
                            </div>}

                            <div className={classes.list}>
                                <Row className="dottedList">
                                    <Col xs={3}>Товар</Col>
                                    <Col xs={2}>Тип товара</Col>
                                    <Col xs={2}>Кол-во</Col>
                                    <Col xs={1}>
                                        <Tooltip position="left" text='Отметить все как без браков'>
                                            <div onClick={() => { handleCheckNoDefect(products) }}>
                                                <Field name="noDefects" component={CheckBox}/>
                                            </div>
                                        </Tooltip>
                                    </Col>
                                    <Col xs={2}>Принято</Col>
                                    <Col xs={2}>Брак</Col>
                                </Row>
                                {_.map(products, (item, index) => {
                                    const disable = Boolean(stock[index])
                                    const id = _.get(item, 'id')
                                    const name = _.get(item, ['product', 'name'])
                                    const type = _.get(item, ['product', 'type', 'name'])
                                    const amount = numberFormat(_.get(item, 'amount'))
                                    const measurement = _.get(item, ['product', 'measurement', 'name'])

                                    return (
                                        <Row key={id} className="dottedList">
                                            <Col xs={3}>{name}</Col>
                                            <Col xs={2}>{type}</Col>
                                            <Col xs={2}>{amount} {measurement}</Col>
                                            {isUpdate
                                                ? <Col xs={1} onTouchTap={() => { handleCheckedDefect(index, _.get(item, 'amount')) }}>
                                                    <Tooltip position="left" text='Без браков'>
                                                        <Field
                                                            key={id}
                                                            name={'stocks[' + index + '][selected]'}
                                                            component={CheckBox}/>
                                                    </Tooltip>
                                                </Col>
                                                : <Col xs={1}>
                                                    <Tooltip position="left" text='Без браков'>
                                                        <div onClick={() => { handleCheckedForm(index, _.get(item, 'amount'), disable) }}>
                                                            <Field
                                                                key={id}
                                                                name={'stocks[' + index + '][selected]'}
                                                                component={CheckBox}/>
                                                        </div>
                                                    </Tooltip>
                                                </Col>}
                                            <Col xs={2}>
                                                <Field
                                                    name={'product[' + index + '][accepted]'}
                                                    component={TextField}
                                                    className={classes.inputFieldCustom}
                                                    fullWidth={true}
                                                    disabled={disable}
                                                />
                                                {measurement}
                                            </Col>
                                            <Col xs={2}>
                                                <Field
                                                    name={'product[' + index + '][defected]'}
                                                    component={TextField}
                                                    className={classes.inputFieldCustom}
                                                    fullWidth={true}
                                                    disabled={disable}
                                                />
                                                {measurement}
                                            </Col>
                                        </Row>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label="Принять товар"
                            className={classes.actionButton}
                            labelStyle={_.isEmpty(formProducts) ? {color: '#b3b3b3'} : {color: '#129fdd'}}
                            disabled={_.isEmpty(formProducts)}
                            primary={true}
                            type="submit"/>
                    </div>
                </form>
            </div>
        </Dialog>
    )
})
OrderCreateDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    detailProducts: PropTypes.object,
    listLoading: PropTypes.bool
}
export default OrderCreateDialog
