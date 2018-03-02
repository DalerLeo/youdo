import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import {hashHistory} from 'react-router'
import Product from 'material-ui/svg-icons/device/widgets'
import ProductType from 'material-ui/svg-icons/action/settings-input-component'
import Loader from '../Loader'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import getConfig from '../../helpers/getConfig'
import {TextField, normalizeNumber} from '../ReduxForm'
import ToolTip from '../ToolTip'
import t from '../../helpers/translate'
import {PRODUCT_TYPE, ORGANIZATION} from '../Statistics/Products/StatProductGridList'

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
            display: ({loading}) => (loading) ? 'flex' : 'none'
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
            padding: '0 10px 0 30px',
            height: '60px',
            zIndex: '999'
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
            justifyContent: 'space-between',
            '& > div, & > span': {
                marginRight: '10px',
                '&:last-child': {
                    margin: '0'
                }
            }
        },
        division: {
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            '& > div:first-child': {
                width: '50%',
                fontWeight: '600'
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
        },
        toggleWrapper: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '10px 30px',
            borderTop: '1px #efefef solid',
            '& > div': {
                display: 'flex',
                background: 'transparent !important'
            },
            '& button': {
                height: '32px !important',
                lineHeight: '32px !important',
                minWidth: '66px !important',
                '& > div': {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '& svg': {
                        width: '20px !important',
                        height: '20px !important'
                    }
                }
            }
        },
        shadowButton: {
            boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px'
        }
    }),
    reduxForm({
        form: 'PlanSalesForm',
        enableReinitialize: true
    }),
    withState('currentParent', 'updateCurrentParent', null)
)

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
    const {
        open,
        loading,
        handleSubmit,
        onClose,
        classes,
        divisions,
        productTypeList,
        filter,
        updateCurrentParent
    } = props

    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const onSubmit = handleSubmit(() => props.onSubmit()
        .catch(validate)
    )

    const toggle = filter.getParam('toggle') || ORGANIZATION
    const parent = filter.getParam('parent') && true
    const primaryColor = '#12aaeb'
    const disabledColor = '#dadada'
    const whiteColor = '#fff'
    const isOrganization = toggle === ORGANIZATION
    const isProductType = toggle === PRODUCT_TYPE

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '300px'} : {width: '400px'}}
            bodyStyle={{minHeight: '100px !important'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>{t('План продаж')}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} className={classes.form} style={{minHeight: 'auto'}}>
                    <div className={classes.loader}>
                        <Loader size={0.75}/>
                    </div>
                    <div className={classes.toggleWrapper} style={parent ? {width: 'auto'} : {width: '100%'}}>
                        <ToolTip position="left" text={t('Показать по организации')}>
                            <FlatButton
                                icon={<Product color={whiteColor}/>}
                                className={isOrganization ? classes.shadowButton : ''}
                                onTouchTap={() => {
                                    updateCurrentParent(null)
                                    hashHistory.push(filter.createURL({toggle: ORGANIZATION, parent: null}))
                                }}
                                backgroundColor={isOrganization ? primaryColor : disabledColor}
                                rippleColor={whiteColor}
                                hoverColor={isOrganization ? primaryColor : disabledColor}/>
                        </ToolTip>
                        <ToolTip position="left" text={t('Показать по типам товаров')}>
                            <FlatButton
                                icon={<ProductType color={whiteColor}/>}
                                className={isProductType ? classes.shadowButton : ''}
                                onTouchTap={() => {
                                    updateCurrentParent(null)
                                    hashHistory.push(filter.createURL({toggle: PRODUCT_TYPE, parent: null}))
                                }}
                                backgroundColor={isProductType ? primaryColor : disabledColor}
                                rippleColor={whiteColor}
                                hoverColor={isProductType ? primaryColor : disabledColor}/>
                        </ToolTip>
                    </div>
                    {toggle === ORGANIZATION ? <div className={classes.inContent} style={{minHeight: '120px'}}>
                            {_.map(divisions, (item) => {
                                const id = _.get(item, 'id')
                                const name = _.get(item, 'name')
                                return (
                                    <div key={id} className={classes.division}>
                                        <div>{name}</div>
                                        <Field
                                            name={'divisions[_' + id + '][amount]'}
                                            component={TextField}
                                            className={classes.inputFieldSimple}
                                            style={{width: '100px'}}
                                            normalize={normalizeNumber}
                                            hintText="0.00"
                                            hintStyle={inputStyle.hint}
                                            inputStyle={inputStyle.input}/>
                                        <div>{primaryCurrency}</div>
                                    </div>
                                )
                            })}
                        </div>
                        : <div className={classes.inContent} style={{minHeight: '120px'}}>
                            {_.map(productTypeList, (item) => {
                                const id = _.get(item, 'id')
                                const name = _.get(item, 'name')
                                return (
                                    <div key={id} className={classes.division}>
                                        <div>{name}</div>
                                        <Field
                                            name={'productType[_' + id + '][amount]'}
                                            component={TextField}
                                            className={classes.inputFieldSimple}
                                            style={{width: '100px'}}
                                            normalize={normalizeNumber}
                                            hintText="0.00"
                                            hintStyle={inputStyle.hint}
                                            inputStyle={inputStyle.input}/>
                                        <div>{primaryCurrency}</div>
                                    </div>
                                )
                            })}
                        </div>}
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label={t('Сохранить')}
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
