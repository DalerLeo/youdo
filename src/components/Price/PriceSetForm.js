import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import FlatButton from 'material-ui/FlatButton'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import {TextField} from '../ReduxForm'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'
import {Row, Col} from 'react-flexbox-grid'
export const PRICE_SET_FORM_OPEN = 'openSetForm'
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
                '& > div': {
                    textAlign: 'right'
                },
                '& > div:first-child': {
                    textAlign: 'left'
                },
                '& .dottedList': {
                    padding: '0px!important',
                    margin: '100px'
                }
            },
            overflowY: 'hidden',
            overflowX: 'hidden'
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
        inputFieldCustom: {
            fontSize: '13px !important',
            marginTop: '0px!important',
            height: '40px!important'
        },
        priceRow: {
            display: 'flex',
            alignItems: 'center',
            height: '40px'
        },
        dottedList: {
            extend: 'priceRow'
        }
    })),
    reduxForm({
        form: 'PriceCreateForm',
        enableReinitialize: true
    })
)
const PriceSetForm = enhance((props) => {
    const {
        handleSubmit,
        classes,
        mergedList,
        onClose
    } = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))
    const iconStyle = {
        icon: {
            color: '#666',
            width: 20,
            height: 20
        },
        button: {
            width: 48,
            height: 48,
            padding: 0
        }
    }
    return (
        <div>
            <form onSubmit={onSubmit} className={classes.form}>
                <div className={classes.bodyTitle}>
                    <div>Цены на товар
                        <span className={classes.rightSideTitleDate}> (23 апр, 2017)</span>
                    </div>
                    <div className={classes.actionButton}>
                        <FlatButton
                            label="Сохранить"
                            primary={true}
                            type="submit"
                            onTouchTap={onSubmit}
                        />
                        <Tooltip position="bottom" text="Закрыть">
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                touch={true}
                                onTouchTap={onClose}>
                                <CloseIcon2 color="#666666"/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
                <div className={classes.tableContent}>
                    <Row className={classes.priceRow}>
                        <Col xs={6}>Тип обьекта</Col>
                        <Col style={{textAlign: 'left'}} xs={3}>Нал</Col>
                        <Col style={{textAlign: 'left'}} xs={3}>Безнал</Col>
                    </Row>
                    {_.map(mergedList, (item, index) => {
                        const marketName = _.get(item, 'marketTypeName')
                        return (
                            <Row className='dottedList' key={index}>
                                <Col xs={6}> {marketName}</Col>
                                <Col style={{textAlign: 'left'}} xs={3}>
                                    <Field
                                        name={'prices[' + index + '][cash_price]'}
                                        className={classes.inputFieldCustom}
                                        component={TextField}
                                        fullWidth={true}
                                    />
                                </Col>
                                <Col style={{textAlign: 'left'}} xs={3}>
                                    <Field
                                        name={'prices[' + index + '][transfer_price]'}
                                        className={classes.inputFieldCustom}
                                        component={TextField}
                                        fullWidth={true}
                                    />
                                </Col>
                            </Row>
                        )
                    })}
                </div>
            </form>
        </div>
    )
})
PriceSetForm.propTyeps = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}
export default PriceSetForm
