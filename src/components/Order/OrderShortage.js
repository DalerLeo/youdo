import _ from 'lodash'
import React from 'react'
import {compose, withReducer} from 'recompose'
import injectSheet from 'react-jss'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import Dialog from 'material-ui/Dialog'
import CircularProgress from 'material-ui/CircularProgress'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import CloseIcon2 from '../CloseIcon2'
import {DateField} from '../ReduxForm'
import toCamelCase from '../../helpers/toCamelCase'
import {Col} from 'react-flexbox-grid'
import {connect} from 'react-redux'

export const ORDER_SHORTAGE_DIALOG_OPEN = 'openShortageDialog'
const validate = (data) => {
    const errors = toCamelCase(data)
    const nonFieldErrors = _.get(errors, 'nonFieldErrors')
    throw new SubmissionError({
        ...errors,
        _error: nonFieldErrors
    })
}
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
        popUp: {
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            height: '100%'
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
            color: '#333',
            padding: '15px 30px 0',
            borderBottom: '1px #efefef solid'
        },
        innerWrap: {
            maxHeight: '50vh',
            overflow: 'auto'
        },
        bodyContent: {
            color: '#333',
            width: '100%'
        },
        form: {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px'
        },
        field: {
            width: '100%'
        },
        title: {
            display: 'flex',
            alignItems: 'center',
            height: '40px',
            fontWeight: '600'
        },
        inputField: {
            fontSize: '13px !important',
            marginLeft: '20px',
            '& div': {
                fontSize: '13px !important'
            }
        },
        bottomButton: {
            bottom: '0'
        },
        actionButton: {
            fontSize: '13px !important',
            margin: '0 !important'
        },
        modalListTable: {
            width: '100%',
            '& li': {
                margin: '0',
                padding: '10px 0',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                '& div:first-child': {
                    paddingLeft: '0'
                },
                '& div:last-child': {
                    paddingRight: '0'
                },
                '& div div:last-child': {
                    display: 'inline-block'
                }
            },
            '& .dottedList:last-child:after': {
                content: '""',
                backgroundImage: 'none'
            },
            '& .dottedList input': {
                fontSize: '13px !important'
            },
            '& .dottedList:last-child': {
                marginBottom: '20px'
            }
        },
        specialModalButton: {
            '& span': {
                color: '#12aaeb !important',
                fontWeight: '600 !important'
            }
        }
    }),
    reduxForm({
        form: 'OrderCreateForm',
        enableReinitialize: true
    }),
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false}),
    connect((state) => {
        const products = _.get(state, ['form', 'OrderCreateForm', 'values', 'products'])
        return {
            products
        }
    })
)
const ZERO = 0
const OrderShortageDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, classes, products} = props
    const productsList = _.map(products, (item, index) => {
        const name = _.get(item, ['product', 'text'])
        const shortage = _.get(item, 'amount') - _.get(item, 'balance')
        const firstname = _.get(item, ['extra', 'supply_manager', 'first_name'])
        const lastname = _.get(item, ['extra', 'supply_manager', 'second_name'])

        if (shortage > ZERO) {
            return (
                <li key={index} className="dottedList">
                    <Col xs={6}>{name}</Col>
                    <Col xs={3}>{shortage}</Col>
                    <Col xs={3}>{firstname} {lastname}</Col>
                </li>
            )
        }
        return (null)
    })
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))
    return (
        <Dialog
            modal={true}
            contentStyle={loading ? {width: '300px'} : {width: '800px'}}
            open={open}
            onRequestClose={onClose}
            bodyClassName={classes.popUp}
            autoScrollBodyContent={true}>
            <div className={classes.titleContent}>
                <span>Добавление заказа / недостающие товары</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <div className={classes.loader}>
                    <CircularProgress size={80} thickness={5}/>
                </div>
                <div className={classes.innerWrap}>
                    <div className={classes.inContent}>
                        <ul className={classes.modalListTable}>
                            <li className="dottedList">
                                <Col xs={6}>
                                    <strong>Наименование</strong>
                                </Col>
                                <Col xs={3}>
                                    <strong>Недостоющее кол-во</strong>
                                </Col>
                                <Col xs={3}>
                                    <strong>Исполнитель</strong>
                                </Col>
                            </li>
                            {productsList}
                        </ul>
                    </div>

                    <form onSubmit={onSubmit} scrolling="auto" className={classes.form}>
                        <Field
                            name="paymentDate"
                            component={DateField}
                            className={classes.inputField}
                            hintText="Срок запроса"
                            fullWidth={true}/>
                        <div className={classes.specialModalButton}>
                            <FlatButton
                                label="Передать запрос на подготовку"
                                className={classes.actionButton}
                                primary={true}
                                type="submit"
                            />
                        </div>
                    </form>

                </div>
            </div>
        </Dialog>
    )
})
export default OrderShortageDialog
