import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import Dialog from 'material-ui/Dialog'
import CircularProgress from 'material-ui/CircularProgress'
import {Row} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import CloseIcon2 from '../CloseIcon2'
import Delete from 'material-ui/svg-icons/action/delete-forever'
import {
    StockReceiveProductSearchField,
    TextField,
    DateField,
    CheckBox,
    ImageUploadField
} from '../ReduxForm'
import StockReceiveMeasurementField from '../ReduxForm/StockReceive/StockReceiveMeasurementField'
import toCamelCase from '../../helpers/toCamelCase'

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
            height: '100%',
            maxHeight: 'inherit !important'
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
        leftSide: {
            borderRight: '1px #efefef solid',
            flexBasis: '35%',
            maxWidth: '35%',
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
            '& > div:first-child': {
                height: '100%',
                padding: '20px 30px'
            }
        },
        half: {
            display: 'flex',
            alignItems: 'baseline',
            width: '50%'
        },
        link: {
            color: '#12aaeb !important',
            borderBottom: '1px dashed',
            fontWeight: '400 !important'
        },
        isDefect: {
            marginTop: '-15px',
            '& .imageDropZone': {
                margin: '0',
                width: '100%',
                height: '200px'
            },
            '& > div:last-child': {
                marginTop: '10px'
            }
        },
        rightSide: {
            padding: '0 30px',
            flexBasis: '65%',
            maxWidth: '65%'
        },
        rightTitle: {
            display: 'flex',
            height: '50px',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px #efefef solid',
            '& > div:first-child': {
                fontWeight: 'bold'
            },
            '& strong': {
                fontWeight: 'bold'
            }
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
                margin: '0',
                justifyContent: 'space-between',
                '&:first-child': {
                    fontWeight: '600',
                    whiteSpace: 'nowrap'
                },
                '&:last-child:after': {
                    display: 'none'
                },
                '& > div': {
                    flexBasis: '16.66%',
                    marginRight: '0.5rem',
                    boxSizing: 'border-box',
                    '&:last-child': {
                        textAlign: 'right',
                        flexBasis: '30px',
                        margin: '0'
                    }
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
        inputDateCustom: {
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
            },
            '& div:first-child': {
                height: '45px !important'
            },
            '& div:first-child div:first-child': {
                transform: 'translate(0px, 0px) !important'
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
        actionButton: {
            fontSize: '13px !important',
            margin: '0 !important'
        }
    }),
    reduxForm({
        form: 'StockReceiveCreateForm',
        enableReinitialize: true
    })
)

const customContentStyle = {
    width: '1000px',
    maxWidth: 'none'
}

const iconStyle = {
    icon: {
        color: '#666',
        width: 20,
        height: 20
    },
    button: {
        width: 20,
        height: 20,
        padding: 0
    }
}

const OrderCreateDialog = enhance((props) => {
    const {
        open,
        handleSubmit,
        onClose,
        classes,
        isDefect
    } = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))

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
                <span>Оформление заказа</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} scrolling="auto" className={classes.form}>
                    <div className={classes.loader}>
                        <CircularProgress size={80} thickness={5}/>
                    </div>
                    <div className={classes.inContent}>
                        <div className={classes.leftSide}>
                            <div>
                                <Field
                                    name="product"
                                    component={StockReceiveProductSearchField}
                                    className={classes.inputFieldCustom}
                                    label="Наименование товара"
                                    fullWidth={true}
                                />
                                <div className={classes.half}>
                                    <Field
                                        name="amount"
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        label="Кол-во товара"
                                        fullWidth={true}
                                    />
                                    <StockReceiveMeasurementField/>
                                </div>
                                <div className={classes.half}>
                                    <Field
                                        name="expDate"
                                        component={DateField}
                                        className={classes.inputDateCustom}
                                        label="Срок годности"
                                        fullWidth={true}
                                    />
                                </div>
                                <Field
                                    name="isDefect"
                                    component={CheckBox}
                                    label="Отметить как бракованный"
                                    fullWidth={true}
                                />
                                {isDefect && <div className={classes.isDefect}>
                                    <Field
                                        name="comment"
                                        component={TextField}
                                        label="Комментарий"
                                        fullWidth={true}
                                        multiLine={true}
                                        rows={1}
                                        rowsMax={3}
                                    />
                                    <Field
                                        name="image"
                                        component={ImageUploadField}
                                        fullWidth={true}
                                    />
                                </div>}
                                <div style={{marginTop: '20px'}}><strong>Введите / <a className={classes.link}>отсканируйте</a> штрихкод</strong></div>
                                <Field
                                    name="barcode"
                                    component={TextField}
                                    className={classes.inputFieldCustom}
                                    hintText="XXXX - XXXX - XXXX - XXXX"
                                    fullWidth={true}
                                />
                            </div>
                            <div className={classes.bottomButton}>
                                <FlatButton
                                    label="Принять товар"
                                    className={classes.actionButton}
                                    primary={true}
                                    type="submit"/>
                            </div>
                        </div>
                        <div className={classes.rightSide}>
                            <div className={classes.rightTitle}>
                                <div>Миф морозная свежесть 450g (жесткая упаковка)</div>
                                <div className={classes.amount}>
                                    <div>
                                        <span>Всего товара:</span>
                                        <span>Принято:</span>
                                    </div>
                                    <div>
                                        <span>300 <strong>шт</strong></span>
                                        <span>283 <strong>шт</strong></span>
                                    </div>
                                </div>
                            </div>

                            <div className={classes.list}>
                                <Row className="dottedList">
                                    <div>Код</div>
                                    <div>Дата приемки</div>
                                    <div>Срок годности</div>
                                    <div>Кол-во</div>
                                    <div>Статус</div>
                                    <div></div>
                                </Row>

                                <Row className="dottedList">
                                    <div>Z857OA45</div>
                                    <div>25 Сен, 2016</div>
                                    <div>25 Сен, 2017</div>
                                    <div>100 шт</div>
                                    <div>ОК</div>
                                    <div>
                                        <IconButton
                                            disableTouchRipple={true}
                                            iconStyle={iconStyle.icon}
                                            style={iconStyle.button}
                                            touch={true}>
                                            <Delete/>
                                        </IconButton>
                                    </div>
                                </Row>
                                <Row className="dottedList">
                                    <div>Z857OA45</div>
                                    <div>25 Сен, 2016</div>
                                    <div>25 Сен, 2017</div>
                                    <div>100 шт</div>
                                    <div>Брак</div>
                                    <div>
                                        <IconButton
                                            disableTouchRipple={true}
                                            iconStyle={iconStyle.icon}
                                            style={iconStyle.button}
                                            touch={true}>
                                            <Delete/>
                                        </IconButton>
                                    </div>
                                </Row>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Dialog>
    )
})
OrderCreateDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    isDefect: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}
export default OrderCreateDialog
