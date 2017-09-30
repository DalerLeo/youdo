import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import {connect} from 'react-redux'
import injectSheet from 'react-jss'
import FlatButton from 'material-ui/FlatButton'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import getConfig from '../../helpers/getConfig'
import {TextField, PriceMainRadioButton, CurrencySearchField, CheckBox} from '../ReduxForm'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import {Row, Col} from 'react-flexbox-grid'
import Tooltip from '../ToolTip'

const validate = (data) => {
    const errors = toCamelCase(data)
    const nonFieldErrors = _.get(errors, 'nonFieldErrors')
    const latLng = (_.get(errors, 'lat') || _.get(errors, 'lon')) && 'Location is required.'
    throw new SubmissionError({
        ...errors,
        latLng,
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
            display: ({loading}) => loading ? 'flex' : 'none'
        },
        bodyTitle: {
            display: 'flex',
            fontWeight: '600',
            marginBottom: '25px',
            fontSize: '14px',
            justifyContent: 'space-between',
            height: '25px',
            alignItems: 'center !important'
        },
        rightSide: {
            position: 'relative',
            flexBasis: '100%',
            maxWidth: '100%'
        },
        rightSideTitleDate: {
            fontWeight: '600',
            fontSize: '12px!important',
            color: '#a5a1a0'
        },
        tableContent: {
            '& .row:first-child': {
                fontWeight: '600'
            },
            '& .row': {
                padding: '0 !important',
                '& > div:first-child': {
                    textAlign: 'left'
                },
                '& .dottedList': {
                    padding: '0px!important',
                    '& > div:last-child': {
                        padding: '100px'
                    }
                }
            },
            overflow: 'hidden',
            width: 'calc(100% - 86px)'
        },
        actionButton: {
            display: 'flex',
            alignItems: 'center',
            bottom: '0',
            left: '0',
            right: '0',
            padding: '0',
            zIndex: '999',
            background: '#fff',
            textAlign: 'right',
            '& span': {
                fontSize: '13px !important',
                fontWeight: '600 !important',
                color: '#129fdd',
                verticalAlign: 'inherit !important'
            }
        },
        inputField: {
            fontSize: '13px !important',
            marginTop: '0px!important',
            height: '40px!important'
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
        agentTableContent: {
            width: '100%',
            '& .row': {
                fontWeight: 'normal !important',
                '& > div:last-child': {
                    display: 'flex',
                    alignItems: 'flex-end',
                    '& .Select-control': {
                        paddingBottom: '3px'
                    }
                }
            }
        },
        agentPrices: {
            position: 'relative'
        },
        checkbox: {
            width: '100%',
            left: '0'
        },
        priceRow: {
            display: 'flex',
            alignItems: 'center',
            height: '40px'
        },
        radios: {
            '& > div': {
                '&:first-child': {
                    fontWeight: '600'
                },
                lineHeight: '40px',
                paddingRight: '20px'
            },
            '& .dottedList': {
                padding: '8px 20px 8px 0px !important',
            }
        }
    }),
    reduxForm({
        form: 'PriceCreateForm',
        enableReinitialize: true
    }),
    connect((state) => {
        const agentCan = _.get(state, ['form', 'PriceCreateForm', 'values', 'agentCanChange']) || false
        return {
            agentCan
        }
    })
)
const PriceSetForm = enhance((props) => {
    const {
        handleSubmit,
        classes,
        mergedList,
        onClose,
        priceUpdatedDate,
        agentCan
    } = props

    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))
    const currentCurrency = getConfig('PRIMARY_CURRENCY')
    const iconStyle = {
        icon: {
            color: '#666',
            width: 20,
            height: 20
        },
        button: {
            width: 20,
            height: 20,
            padding: '0',
            top: '2px',
            marginLeft: '10px'
        }
    }
    return (
        <div>
            <form onSubmit={onSubmit} className={classes.form}>
                <div className={classes.bodyTitle}>
                    <div>Цены на товар
                        <span className={classes.rightSideTitleDate}> ({priceUpdatedDate})</span>
                    </div>
                    <div className={classes.actionButton}>
                        <FlatButton
                            label="Сохранить"
                            labelStyle={{fontSize: '13px'}}
                            primary={true}
                            type="submit"
                            onTouchTap={onSubmit}
                        />
                        <Tooltip position="bottom" text="Закрыть">
                            <IconButton
                                className={classes.closeBtn}
                                iconStyle={iconStyle.icon}
                                disableTouchRipple={true}
                                style={iconStyle.button}
                                touch={true}
                                onTouchTap={onClose}>
                                <CloseIcon2 color="#666666"/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
                <div className={classes.agentPrices}>
                    <div className={classes.checkbox}>
                        <Field
                            name="agentCanChange"
                            label="Агент может устанавливать цены"
                            component={CheckBox}
                        />
                    </div>
                    {agentCan && <div className={classes.agentTableContent}>
                        <Row>
                            <Col xs={4}>
                                <Field
                                    name="minPrice"
                                    className={classes.inputFieldCustom}
                                    component={TextField}
                                    label="Мин"
                                    fullWidth={true}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field
                                    name="maxPrice"
                                    className={classes.inputFieldCustom}
                                    component={TextField}
                                    label="Макс"
                                    fullWidth={true}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field
                                    name="priceCurrency"
                                    className={classes.inputFieldCustom}
                                    component={CurrencySearchField}
                                    label="Валюта"
                                    hintText={currentCurrency}
                                    fullWidth={true}/>
                            </Col>
                        </Row>
                    </div>}
                </div>
                <div style={{display: 'flex'}}>
                    <div className={classes.radios}>
                        <div>Основной</div>
                        <div>
                            <Field
                                name='isPrimary'
                                component={PriceMainRadioButton}
                                mergedList={mergedList}
                                fullWidth={true}>
                            </Field>
                        </div>
                    </div>
                    <div className={classes.tableContent}>
                        <Row className={classes.priceRow}>
                            <Col xs={6}>Тип обьекта</Col>
                            <Col style={{textAlign: 'left'}} xs={2}>Нал</Col>
                            <Col style={{textAlign: 'left'}} xs={2}>Безнал</Col>
                            <Col style={{textAlign: 'left'}} xs={2}>Валюта</Col>
                        </Row>
                        {_.map(mergedList, (item, index) => {
                            const marketName = _.get(item, 'marketTypeName')
                            const cashPrice = _.get(item, 'cash_price')
                            const transferPrice = _.get(item, 'transfer_price')
                            return (
                                <Row className='dottedList' key={index}>
                                    <Col xs={6}> {marketName}</Col>
                                    <Col style={{textAlign: 'left'}} xs={2}>
                                        <Field
                                            name={'prices[' + index + '][cash_price]'}
                                            className={classes.inputField}
                                            component={TextField}
                                            placeholder={cashPrice}
                                            fullWidth={true}
                                        />
                                    </Col>
                                    <Col style={{textAlign: 'left'}} xs={2}>
                                        <Field
                                            name={'prices[' + index + '][transfer_price]'}
                                            className={classes.inputField}
                                            component={TextField}
                                            placeholder={transferPrice}
                                            fullWidth={true}
                                        />
                                    </Col>
                                    <Col xs={2}>
                                        <Field
                                            name={'prices[' + index + '][currency]'}
                                            className={classes.inputField}
                                            component={CurrencySearchField}
                                            fullWidth={true}/>
                                    </Col>
                                </Row>
                            )
                        })}
                    </div>
                </div>
            </form>
        </div>
    )
})
PriceSetForm.propTyeps = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    mergedList: PropTypes.object.isRequired,
    priceUpdatedDate: PropTypes.string.isRequired
}
export default PriceSetForm
