import _ from 'lodash'
import React from 'react'
import {compose, withState} from 'recompose'
import {Row, Col} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import getConfig from '../../helpers/getConfig'
import dateTimeFormat from '../../helpers/dateTimeFormat'
import Loader from '../Loader'
import Paper from 'material-ui/Paper'
import toBoolean from '../../helpers/toBoolean'
import {reduxForm, Field} from 'redux-form'
import {TextField} from '../ReduxForm'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import Done from 'material-ui/svg-icons/action/done-all'
import Cancel from 'material-ui/svg-icons/navigation/close'

const enhance = compose(
    injectSheet({
        chartLoader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px'
        },
        list: {
            '& .row': {
                alignItems: 'center',
                padding: '15px 30px',
                maxHeight: '54px',
                margin: '0',
                '&:first-child': {
                    fontWeight: '600',
                    borderBottom: '1px #efefef solid'
                },
                '& > div:first-child': {
                    paddingLeft: '0'
                },
                '& > div:last-child': {
                    textAlign: 'right',
                    paddingRight: '0'
                }
            }
        },
        button: {
            cursor: 'pointer',
            marginLeft: '10px',
            color: '#666 !important',
            width: '20px !important',
            height: '20px !important'
        },
        editRate: {
            display: 'flex',
            alignItems: 'baseline'
        },
        textField: {
            fontSize: '13px !important',
            paddingLeft: '10px',
            marginRight: '10px',
            width: '160px !important'
        },
        chartHeader: {
            padding: '15px 30px',
            fontWeight: '600'
        },
        chartStats: {
            display: 'flex',
            padding: '15px 30px',
            background: '#f2f5f8',
            '& > div': {
                marginRight: '20px',
                '&:last-child': {
                    marginRight: '0'
                }
            }
        }
    }),
    reduxForm({
        form: 'DashboardCurrencyForm',
        enableReinitialize: true
    }),
    withState('currentUpdateCurrency', 'setUpdateCurrency', null)
)

const Currencies = enhance((props) => {
    const {
        classes,
        currencyData,
        currentUpdateCurrency,
        setUpdateCurrency,
        loading
    } = props
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const reversedRate = !toBoolean(getConfig('REVERSED_CURRENCY_RATE'))

    // CURRENCY DATA //
    const currencyListLoading = _.get(currencyData, 'loading')
    const currencyList = _.get(currencyData, 'data')
    const handleUpdateRate = _.get(currencyData, 'handleUpdateRate')
    return (
        <Paper zDepth={1}>
            <div className={classes.chartHeader}>
                <div>Валюты</div>
            </div>
            <div className={classes.chart}>
                <div className={classes.chartStats}>
                    <div>Основная валюта: <strong>{primaryCurrency}</strong></div>
                </div>
                <form className={classes.list}>
                    <Row>
                        <Col xs={3}>Наименование</Col>
                        <Col xs={4}>Курс</Col>
                        <Col xs={4}>Дата обновления</Col>
                        <Col xs={1}>{null}</Col>
                    </Row>
                    {currencyListLoading || loading
                        ? <div className={classes.chartLoader}>
                            <Loader size={0.75}/>
                        </div>
                        : _.map(currencyList, (item) => {
                            const id = _.get(item, 'id')
                            const name = _.get(item, 'name')
                            const createdDate = dateTimeFormat(_.get(item, ['rate', 'createdDate']))
                            const rate = _.get(item, ['rate', 'rate'])
                            if (id === currentUpdateCurrency) {
                                return (
                                    <Row key={id}>
                                        <Col xs={3}>{name}</Col>
                                        <Col xs={7} className={classes.editRate}>1 {reversedRate ? name : primaryCurrency} =
                                            <Field
                                                name="rate"
                                                component={TextField}
                                                className={classes.textField}
                                                hintText={rate}
                                            />
                                            {reversedRate ? primaryCurrency : name}
                                        </Col>
                                        <Col xs={2}>
                                            <Cancel
                                                onClick={() => {
                                                    setUpdateCurrency(null)
                                                }}
                                                className={classes.button}/>
                                            <Done
                                                onClick={() => {
                                                    handleUpdateRate(id)
                                                    setUpdateCurrency(null)
                                                }}
                                                className={classes.button}/>
                                        </Col>
                                    </Row>
                                )
                            }
                            return name === primaryCurrency
                                ? null
                                : (
                                    <Row key={id}>
                                        <Col xs={3}>{name}</Col>
                                        <Col xs={4}>1 {reversedRate ? name : primaryCurrency} = {rate} {reversedRate ? primaryCurrency : name}</Col>
                                        <Col xs={4}>{createdDate}</Col>
                                        <Col xs={1}>
                                            <EditIcon
                                                onClick={() => { setUpdateCurrency(id) }}
                                                className={classes.button}/>
                                        </Col>
                                    </Row>
                                )
                        })}
                </form>
            </div>
        </Paper>
    )
})

export default Currencies
