import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import {Row, Col} from 'react-flexbox-grid'
import toCamelCase from '../../helpers/toCamelCase'
import getConfig from '../../helpers/getConfig'
import {TextField, normalizeNumber} from '../ReduxForm'
import CloseIcon2 from '../CloseIcon2'
import Tooltip from '../ToolTip'
import IconButton from 'material-ui/IconButton'
import List from 'material-ui/svg-icons/action/list'
import Info from 'material-ui/svg-icons/action/info-outline'

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
            justifyContent: 'center',
            display: ({loading}) => loading ? 'flex' : 'none'
        },
        popUp: {
            color: '#333 !important',
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            height: '100%',
            maxHeight: 'none !important',
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
        flex: {
            display: 'flex',
            height: '50px',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px #efefef solid',
            width: '100%',
            '& > div': {
                display: 'flex',
                alignItems: 'center',
                width: 'auto',
                '& span': {
                    fontWeight: '600',
                    marginRight: '10px'
                }
            }
        },
        info: {
            '& svg': {
                marginLeft: '5px'
            },
            '& div': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
        },
        flexInline: {
            extend: 'flex',
            borderBottom: 'none',
            justifyContent: 'flex-start',
            '& > div, & > span': {
                marginRight: '10px'
            }
        },
        list: {
            '& .row': {
                padding: '10px 0',
                '&:after': {
                    left: '0.5rem',
                    right: '0.5rem'
                },
                '&:first-child': {
                    fontWeight: '600'
                },
                '& > div:last-child': {
                    textAlign: 'right'
                }
            }
        },
        rotateBtn: {
            transform: 'rotate(180deg)'
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
        inputFieldSimple: {
            extend: 'inputFieldCustom',
            marginTop: '0'
        },
        actionButton: {
            fontSize: '13px !important',
            margin: '0 !important'
        }
    }),
    reduxForm({
        form: 'PlanSalesForm',
        enableReinitialize: true
    }),
    withState('openMarkets', 'setOpenMarkets', false)
)

const actionBtnStyle = {
    icon: {
        color: '#12aaeb',
        width: 22,
        height: 22
    },
    button: {
        width: 22,
        height: 22,
        padding: 0
    }
}

const inputStyle = {
    hint: {
        bottom: 10,
        right: 0
    },
    input: {
        textAlign: 'right'
    }
}

const PlanSalesDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, classes, openMarkets, setOpenMarkets} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))
    const infoText = 'Рекомендованая сумма расчитана <br/> исходя из результатов продаж за <br/> последние 3 месяца'
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '300px'} : {width: '500px'}}
            bodyStyle={{minHeight: '100px !important'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>План продаж</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} className={classes.form} style={{minHeight: 'auto'}}>
                    <div className={classes.loader}>
                        <CircularProgress size={40} thickness={4}/>
                    </div>
                    <div className={classes.inContent} style={{minHeight: '120px'}}>
                        <div className={classes.flex}>
                            <div className={classes.info}>
                                <div>Рекомендуемая сумма</div>
                                {!openMarkets &&
                                <Tooltip text={infoText} position="right">
                                    <Info style={actionBtnStyle.icon} color="#999"/>
                                </Tooltip>}
                            </div>
                            <div>
                                <span>5 000 000 - 6 000 000 {primaryCurrency}</span>
                                <IconButton
                                    onTouchTap={() => { setOpenMarkets(!openMarkets) }}
                                    disableTouchRipple={true}
                                    iconStyle={actionBtnStyle.icon}
                                    style={actionBtnStyle.button}
                                    className={openMarkets && classes.rotateBtn}>
                                    <List/>
                                </IconButton>
                            </div>
                        </div>
                        {openMarkets &&
                        <div className={classes.list}>
                            <Row className="dottedList">
                                <Col xs={7}>Магазин</Col>
                                <Col xs={5}>Сумма ({primaryCurrency})</Col>
                            </Row>
                            <Row className="dottedList">
                                <Col xs={7}>Наименование магазина</Col>
                                <Col xs={5}>2 000 000 - 3 200 150</Col>
                            </Row>
                            <Row className="dottedList">
                                <Col xs={7}>Наименование магазина</Col>
                                <Col xs={5}>2 000 000 - 3 200 150</Col>
                            </Row>
                            <Row className="dottedList">
                                <Col xs={7}>Наименование магазина</Col>
                                <Col xs={5}>2 000 000 - 3 200 150</Col>
                            </Row>
                        </div>}
                        <div className={classes.flexInline}>
                            <span>Сумма плана продаж</span>
                            <Field
                                name="amount"
                                component={TextField}
                                className={classes.inputFieldSimple}
                                style={{width: '100px'}}
                                normalize={normalizeNumber}
                                hintText="0.00"
                                hintStyle={inputStyle.hint}
                                inputStyle={inputStyle.input}
                            />
                            <span>UZS</span>
                        </div>

                    </div>
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label="Сохранить"
                            labelStyle={{fontSize: '13px'}}
                            className={classes.actionButton}
                            primary={true}
                            type="submit"
                        />
                    </div>
                </form>
            </div>
        </Dialog>
    )
})
PlanSalesDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}
export default PlanSalesDialog
