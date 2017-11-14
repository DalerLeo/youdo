import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Row, Col} from 'react-flexbox-grid'
import {Field, reduxForm} from 'redux-form'
import Dialog from 'material-ui/Dialog'
import CircularProgress from 'material-ui/CircularProgress'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import Pagination from '../GridList/GridListNavPagination'
import {
    TextField,
    normalizeNumber
} from '../ReduxForm'
import numberFormat from '../../helpers/numberFormat'

const enhance = compose(
    injectSheet({
        loader: {
            position: 'absolute',
            width: '100%',
            height: '300px',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            textAlign: 'center',
            justifyContent: 'center',
            display: 'flex'
        },
        popUp: {
            overflow: 'unset !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            height: '100%',
            maxHeight: 'inherit !important',
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
            color: '#333',
            minHeight: '450px',
            '& header': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '50px',
                padding: '0 30px'
            }
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
        productsList: {
            padding: '0 30px',
            maxHeight: '600px',
            overflowY: 'auto',
            '& .dottedList': {
                margin: '0',
                padding: '15px 0',
                height: '50px',
                '&:first-child': {
                    fontWeight: '600'
                },
                '& > div': {
                    '&:first-child': {
                        paddingLeft: '0'
                    },
                    '&:last-child': {
                        textAlign: 'right',
                        paddingRight: '0'
                    }
                }
            }
        },
        flex: {
            display: 'flex',
            alignItems: 'baseline'
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
        actionButton: {
            fontSize: '13px !important',
            margin: '0 !important'
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
        podlojkaScroll: {
            overflowY: 'auto !important',
            zIndex: '2000 !important',
            '& > div:first-child > div:first-child': {
                transform: 'translate(0px, 0px) !important'
            }
        }
    }),
    reduxForm({
        form: 'OrderAddProductsForm',
        enableReinitialize: true
    })
)

const customContentStyle = {
    width: '1000px',
    maxWidth: 'none'
}
const OrderAddProductsDialog = enhance((props) => {
    const {
        open,
        data,
        filter,
        handleSubmit,
        onClose,
        classes,
        loading
    } = props
    const onSubmit = handleSubmit(() => props.onSubmit())
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
                <span>Добавление продуктов</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} scrolling="auto" className={classes.form}>
                    {loading
                        ? <div className={classes.loader}>
                            <CircularProgress size={40} thickness={4}/>
                        </div>
                        : <div className={classes.inContent}>
                            <header>
                                <div>Список продуктов</div>
                                <Pagination filter={filter}/>
                            </header>
                            <div className={classes.productsList}>
                                <Row className="dottedList">
                                    <Col xs={6}>Наименование</Col>
                                    <Col xs={2}>В наличии</Col>
                                    <Col xs={2}>Цена</Col>
                                    <Col xs={2}>Кол-во</Col>
                                </Row>
                                {_.map(data, (item, index) => {
                                    const id = _.get(item, 'id')
                                    const name = _.get(item, 'name')
                                    const balance = _.get(item, 'balance')
                                    const normalize = value => {
                                        if (!value) {
                                            return value
                                        }

                                        return value > balance ? balance : value
                                    }
                                    const measurement = _.get(item, ['measurement', 'name'])
                                    return (
                                        <Row key={id} className="dottedList">
                                            <Col xs={6}>{name}</Col>
                                            <Col xs={2}>{numberFormat(balance, measurement)}</Col>
                                            <Col xs={2}>
                                                <Field
                                                    name={'product[' + id + '][price]'}
                                                    component={TextField}
                                                    className={classes.inputFieldCustom}
                                                    normalize={normalizeNumber}
                                                    fullWidth={true}/>
                                            </Col>
                                            <Col xs={2} className={classes.flex}>
                                                <Field
                                                    name={'product[' + id + '][amount]'}
                                                    component={TextField}
                                                    className={classes.inputFieldCustom}
                                                    normalize={normalize}
                                                    fullWidth={true}/>
                                                <span>{measurement}</span>
                                            </Col>
                                        </Row>
                                    )
                                })}
                            </div>
                        </div>}
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label={'Сохранить'}
                            labelStyle={{fontSize: '13px'}}
                            className={classes.actionButton}
                            primary={true}
                            type="submit"/>
                    </div>
                </form>
            </div>
        </Dialog>
    )
})
OrderAddProductsDialog.propTyeps = {
    products: PropTypes.array,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}
export default OrderAddProductsDialog
