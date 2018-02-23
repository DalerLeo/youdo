import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import {connect} from 'react-redux'
import injectSheet from 'react-jss'
import FlatButton from 'material-ui/FlatButton'
import {Field, reduxForm} from 'redux-form'
import getConfig from '../../helpers/getConfig'
import {
    TextField,
    PriceMainRadioButton,
    CurrencySearchField,
    CheckBox,
    normalizeNumber
} from '../ReduxForm'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import {Row, Col} from 'react-flexbox-grid'
import ToolTip from '../ToolTip'
import t from '../../helpers/translate'
import formValidate from '../../helpers/formValidate'

const enhance = compose(
    injectSheet({
        wrapper: {
            '& .dottedList': {
                '&:last-child:after': {
                    display: 'none'
                }
            }
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
                height: '45px',
                '& > div:first-child': {
                    textAlign: 'left'
                }
            },
            '& .dottedList': {
                position: 'relative',
                '& > div': {
                    paddingBottom: '5px',
                    '&:first-child': {
                        paddingBottom: '0'
                    }
                }
            },
            width: 'calc(100% - 40px)'
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
            marginTop: '7px !important',
            height: '45px !important'
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
            width: '40px',
            marginRight: '10px',
            '& > div': {
                '&:first-child': {
                    fontWeight: '600',
                    height: '45px'
                }
            },
            '& .dottedList': {
                padding: '10px 0 !important',
                height: '45px !important',
                display: 'block !important'
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
        agentCan,
        dispatch
    } = props

    const formNames = ['prices', 'currency']
    const onSubmit = handleSubmit(() => props.onSubmit()
        .catch((error) => {
            formValidate(formNames, dispatch, error)
        }))
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
        <div className={classes.wrapper}>
            <form onSubmit={onSubmit} className={classes.form}>
                <div className={classes.bodyTitle}>
                    <div>{t('Цены на товар')}
                        <span className={classes.rightSideTitleDate}> ({priceUpdatedDate})</span>
                    </div>
                    <div className={classes.actionButton}>
                        <FlatButton
                            label={t('Сохранить')}
                            labelStyle={{fontSize: '13px'}}
                            primary={true}
                            type="submit"
                            onTouchTap={onSubmit}
                        />
                        <ToolTip position="bottom" text={t('Закрыть')}>
                            <IconButton
                                className={classes.closeBtn}
                                iconStyle={iconStyle.icon}
                                disableTouchRipple={true}
                                style={iconStyle.button}
                                touch={true}
                                onTouchTap={onClose}>
                                <CloseIcon color="#666666"/>
                            </IconButton>
                        </ToolTip>
                    </div>
                </div>
                <div className={classes.agentPrices}>
                    <div className={classes.checkbox}>
                        <Field
                            name="agentCanChange"
                            label={t('Агент может устанавливать цены')}
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
                                    label={t('Мин')}
                                    fullWidth={true}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field
                                    name="maxPrice"
                                    className={classes.inputFieldCustom}
                                    component={TextField}
                                    label={t('Макс')}
                                    fullWidth={true}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field
                                    name="currency"
                                    className={classes.inputFieldCustom}
                                    component={CurrencySearchField}
                                    label={t('Валюта')}
                                    hintText={currentCurrency}
                                    fullWidth={true}/>
                            </Col>
                        </Row>
                    </div>}
                </div>
                <div style={{display: 'flex'}}>
                    <div className={classes.radios}>
                        <div/>
                        <div>
                            <Field
                                name='isPrimary'
                                component={PriceMainRadioButton}
                                mergedList={mergedList}
                                style={{height: '44px'}}
                                fullWidth={true}>
                            </Field>
                        </div>
                    </div>
                    <div className={classes.tableContent}>
                        <Row className={classes.priceRow}>
                            <Col xs={4}>{t('Тип обьекта')}</Col>
                            <Col style={{textAlign: 'left'}} xs={2}>{t('Нал')}</Col>
                            <Col style={{textAlign: 'left'}} xs={2}>{t('Валюта')}</Col>
                            <Col style={{textAlign: 'left'}} xs={2}>{t('Безнал')}</Col>
                            <Col style={{textAlign: 'left'}} xs={2}>{t('Валюта')}</Col>
                        </Row>
                        {_.map(mergedList, (item, index) => {
                            const priceListName = _.get(item, 'priceListName')
                            const cashPrice = _.get(item, 'cash_price')
                            const transferPrice = _.get(item, 'transfer_price')
                            return (
                                <Row className='dottedList' key={index}>
                                    <Col xs={4}> {priceListName}</Col>
                                    <Col style={{textAlign: 'left'}} xs={2}>
                                        <Field
                                            name={'prices[' + index + '][cashPrice]'}
                                            className={classes.inputField}
                                            component={TextField}
                                            placeholder={cashPrice}
                                            normalize={normalizeNumber}
                                            fullWidth={true}
                                        />
                                    </Col>
                                    <Col xs={2}>
                                        <Field
                                            name={'prices[' + index + '][cashCurrency]'}
                                            clearValue={false}
                                            placeholder={t('Выберите')}
                                            component={CurrencySearchField}
                                            withoutErrorText={true}
                                            fullWidth={true}/>
                                    </Col>
                                    <Col style={{textAlign: 'left'}} xs={2}>
                                        <Field
                                            name={'prices[' + index + '][transferPrice]'}
                                            className={classes.inputField}
                                            component={TextField}
                                            normalize={normalizeNumber}
                                            placeholder={transferPrice}
                                            fullWidth={true}
                                        />
                                    </Col>
                                    <Col xs={2}>
                                        <Field
                                            name={'prices[' + index + '][transferCurrency]'}
                                            component={CurrencySearchField}
                                            placeholder={t('Выберите')}
                                            clearValue={false}
                                            withoutErrorText={true}
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
