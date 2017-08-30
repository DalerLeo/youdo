import _ from 'lodash'
import React from 'react'
import {compose, withState, withReducer, withHandlers} from 'recompose'
import {Row, Col} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import {connect} from 'react-redux'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import MarketSearchFieldCustom from './MarketSearchFieldCustom'
import TargetRadio from './TargetRadio'
import {Field} from 'redux-form'

const enhance = compose(
    injectSheet({
        wrapper: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            position: 'relative'
        },
        error: {
            textAlign: 'center',
            fontSize: '14px',
            color: 'red'
        },
        imagePlaceholder: {
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            '& img': {
                width: '70px',
                marginBottom: '20px',
                marginTop: '25px'
            }
        },
        table: {
            marginTop: '20px',
            display: 'flex',
            alignItems: 'flex-end',
            '& > div:first-child': {
                width: '40px',
                '& > div > div': {
                    height: '40px !important',
                    alignItems: 'center'
                }
            }
        },
        list: {
            width: '100%',
            '& .row': {
                height: '40px',
                alignItems: 'center',
                '&:first-child': {
                    fontWeight: '600'
                }
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
        searchFieldCustom: {
            width: '250px !important',
            extend: 'inputFieldCustom',
            position: 'initial !important',
            '& label': {
                lineHeight: 'auto !important'
            }
        },
        title: {
            fontWeight: '600',
            border: 'none !important'
        },
        headers: {
            display: 'flex',
            alignItems: 'center',
            height: '40px',
            justifyContent: 'space-between',
            '& span': {
                textTransform: 'lowercase !important'
            }
        },
        background: {
            display: 'flex',
            alignItems: 'center',
            padding: '10px 10px 10px 30px',
            margin: '5px -30px 0',
            backgroundColor: '#f1f5f8',
            position: 'relative',
            zIndex: '2',
            '& > div': {
                marginTop: '-2px !important',
                padding: '0'
            },
            '& > button > div > span': {
                padding: '0 !important'
            },
            '& button': {
                alignSelf: 'center'
            },
            '& > div > div > div:first-child': {
                overflow: 'hidden'
            }
        }
    }),
    connect((state) => {
        const address = _.get(state, ['shop', 'extra', 'data', 'address'])
        const client = _.get(state, ['shop', 'extra', 'data', 'client', 'name'])
        return {
            address,
            client
        }
    }),
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false}),
    withState('editItem', 'setEditItem', null),

    withHandlers({
        handleAdd: props => () => {
            const market = _.get(props, ['market', 'input', 'value'])
            const onChange = _.get(props, ['markets', 'input', 'onChange'])
            const markets = _.get(props, ['markets', 'input', 'value'])
            const address = _.get(props, 'address')
            const client = _.get(props, 'client')

            if (_.get(market, 'value')) {
                let has = false
                _.map(markets, (item) => {
                    if (_.get(item, 'market') === market) {
                        has = true
                    }
                })
                const fields = ['market']
                for (let i = 0; i < fields.length; i++) {
                    let newChange = _.get(props, [fields[i], 'input', 'onChange'])
                    props.dispatch(newChange(null))
                }

                if (!has) {
                    let newArray = [{market, address, client}]
                    _.map(markets, (obj) => {
                        newArray.push(obj)
                    })
                    onChange(newArray)
                    has = false
                }
            }
        },

        handleRemove: props => (listIndex) => {
            const onChange = _.get(props, ['markets', 'input', 'onChange'])
            const markets = _(props)
                .get(['markets', 'input', 'value'])
                .filter((item, index) => index !== listIndex)

            onChange(markets)
        }
    })
)

const iconStyle = {
    button: {
        width: 40,
        height: 40,
        padding: 0
    },
    icon: {
        color: '#666',
        width: 22,
        height: 22
    }
}

const flatButton = {
    label: {
        color: '#12aaeb',
        fontWeight: 600,
        fontSize: '13px'
    }
}

const JoinShopListField = ({classes, handleAdd, handleRemove, ...defaultProps}) => {
    const markets = _.get(defaultProps, ['markets', 'input', 'value']) || []
    const error = _.get(defaultProps, ['markets', 'meta', 'error'])
    const target = _.get(defaultProps, ['target', 'input', 'value']) || false
    return (
        <div className={classes.wrapper}>
            <div>
                <Row className={classes.background}>
                    <Col xs={5}>
                        <MarketSearchFieldCustom
                            label="Магазин"
                            className={classes.searchFieldCustom}
                            fullWidth={true}
                            {..._.get(defaultProps, 'market')}
                        />
                    </Col>
                    <Col xs={7} style={{textAlign: 'right'}}>
                        <FlatButton
                            label="Добавить"
                            labelStyle={flatButton.label}
                            onTouchTap={handleAdd}>
                        </FlatButton>
                    </Col>
                </Row>
            </div>
            {error && <div className={classes.error}>{error}</div>}
            {!_.isEmpty(markets) && <div className={classes.table}>
                <Field
                    name="target"
                    data={markets}
                    target={target}
                    component={TargetRadio}
                />
                <div className={classes.list}>
                    <Row>
                        <Col xs={5}>Наименование</Col>
                        <Col xs={3}>Клиент</Col>
                        <Col xs={3}>Адрес</Col>
                    </Row>
                    {_.map(markets, (item, index) => {
                        const name = _.get(item, ['market', 'text'])
                        const client = _.get(item, 'client')
                        const address = _.get(item, 'address')

                        return (
                            <Row key={index} className={classes.tableRow}>
                                <Col xs={5}>{name}</Col>
                                <Col xs={3}>{client}</Col>
                                <Col xs={3}>{address}</Col>
                                <Col xs={1} style={{textAlign: 'right', width: '40px'}}>
                                    <IconButton
                                        onTouchTap={() => handleRemove(index)}
                                        style={iconStyle.button}
                                        iconStyle={iconStyle.icon}>
                                        <DeleteIcon color="#666666"/>
                                    </IconButton>
                                </Col>
                            </Row>
                        )
                    })}
                </div>
            </div>}
        </div>
    )
}

export default enhance(JoinShopListField)
