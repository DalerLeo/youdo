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
import MainStyles from '../Styles/MainStyles'

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
            display: ({loading}) => loading ? 'flex' : 'none'
        },
        popUp: {
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            height: '100%',
            minHeight: '300px !important'
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
            position: 'relative'
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
            marginTop: '15px',
            '& span': {
                color: '#12aaeb !important',
                fontWeight: '800'
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

const OrderShortageDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, classes} = props
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
                            <li className="dottedList">
                                <Col xs={6}>
                                    Прозрачный скотч со льдом
                                </Col>
                                <Col xs={3}>
                                    100
                                </Col>
                                <Col xs={3}>
                                    sfdf
                                </Col>
                            </li>
                            <li className="dottedList">
                                <Col xs={6}>
                                    Прозрачный скотч со льдом
                                </Col>
                                <Col xs={3}>
                                    100
                                </Col>
                                <Col xs={3}>
                                    sfdf
                                </Col>
                            </li>
                            <li className="dottedList">
                                <Col xs={6}>
                                    Прозрачный скотч со льдом
                                </Col>
                                <Col xs={3}>
                                    100
                                </Col>
                                <Col xs={3}>
                                    sfdf
                                </Col>
                            </li>
                            <li className="dottedList">
                                <Col xs={6}>
                                    Прозрачный скотч со льдом
                                </Col>
                                <Col xs={3}>
                                    100
                                </Col>
                                <Col xs={3}>
                                    sfdf
                                </Col>
                            </li>
                        </ul>
                    </div>

                    <form onSubmit={onSubmit} scrolling="auto" className={classes.form} style={{display: 'flex', padding: '0 30px 20px'}}>
                        <Col xs={3}>
                            <Field
                                name="paymentDate"
                                component={DateField}
                                className={classes.inputField}
                                hintText="Срок запроса"
                                fullWidth={true}/>
                        </Col>
                        <Col xs={9} style={{textAlign: 'right'}}>
                            <div className={classes.specialModalButton}>
                                <FlatButton
                                    label="Передать запрос на подготовку"
                                    className={classes.actionButton}
                                    primary={true}
                                    type="submit"
                                />
                            </div>
                        </Col>
                    </form>

                </div>
            </div>
        </Dialog>
    )
})
export default OrderShortageDialog
