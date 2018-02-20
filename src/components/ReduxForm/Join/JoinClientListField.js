import _ from 'lodash'
import React from 'react'
import {compose, withState, withReducer, withHandlers} from 'recompose'
import {Row, Col} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import {connect} from 'react-redux'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import ClientSearchFieldCustom from './ClientSearchFieldCustom'
import {Field} from 'redux-form'
import TargetRadio from './TargetRadio'
import t from '../../../helpers/translate'

const enhance = compose(
    injectSheet({
        wrapper: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            position: 'relative'
        },
        error: {
            background: '#ffebee',
            borderRadius: '2px',
            color: '#f44336',
            fontSize: '13px',
            textAlign: 'center',
            margin: '10px -30px 0',
            padding: '10px 15px'
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
            overflowY: 'auto',
            '& > div:first-child': {
                width: '40px',
                marginTop: '40px',
                '& > div > div': {
                    height: '40px !important',
                    alignItems: 'center'
                }
            }
        },
        list: {
            width: '100%',
            '& .row': {
                margin: '0',
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
            '& .Select-control': {
                backgroundColor: 'unset'
            },
            '& button': {
                alignSelf: 'center'
            }
        }
    }),
    connect((state) => {
        const address = _.get(state, ['shop', 'extra', 'data', 'address'])
        return {
            address
        }
    }),
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false}),
    withState('editItem', 'setEditItem', null),

    withHandlers({
        handleAdd: props => () => {
            const client = _.get(props, ['client', 'input', 'value'])
            const onChange = _.get(props, ['clients', 'input', 'onChange'])
            const clients = _.get(props, ['clients', 'input', 'value'])

            if (_.get(client, 'value')) {
                let has = false
                _.map(clients, (item) => {
                    if (_.get(item, 'client') === client) {
                        has = true
                    }
                })
                const fields = ['client']
                for (let i = 0; i < fields.length; i++) {
                    let newChange = _.get(props, [fields[i], 'input', 'onChange'])
                    props.dispatch(newChange(null))
                }

                if (!has) {
                    let newArray = [{client}]
                    _.map(clients, (obj) => {
                        newArray.push(obj)
                    })
                    onChange(newArray)
                    has = false
                }
            }
        },

        handleRemove: props => (listIndex) => {
            const onChange = _.get(props, ['clients', 'input', 'onChange'])
            const clients = _(props)
                .get(['clients', 'input', 'value'])
                .filter((item, index) => index !== listIndex)

            onChange(clients)
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

const JoinClientListField = ({classes, handleAdd, handleRemove, ...defaultProps}) => {
    const clients = _.get(defaultProps, ['clients', 'input', 'value']) || []
    const target = _.get(defaultProps, ['target', 'input', 'value']) || false
    const error = _.get(defaultProps, ['target', 'meta', 'error'])
    return (
        <div className={classes.wrapper}>
            <div>
                <Row className={classes.background}>
                    <Col xs={5}>
                        <ClientSearchFieldCustom
                            label={t('Клиент')}
                            className={classes.searchFieldCustom}
                            fullWidth={true}
                            {..._.get(defaultProps, 'client')}
                        />
                    </Col>
                    <Col xs={7} style={{textAlign: 'right'}}>
                        <FlatButton
                            label={t('Добавить')}
                            labelStyle={flatButton.label}
                            onTouchTap={handleAdd}>
                        </FlatButton>
                    </Col>
                </Row>
            </div>
            {error && <div className={classes.error}>{error}</div>}
            {!_.isEmpty(clients) && <div className={classes.table}>
                <Field
                    name="target"
                    data={clients}
                    target={target}
                    component={TargetRadio}
                />
                <div className={classes.list}>
                    <Row>
                        <Col xs={11}>{t('Наименование')}</Col>
                    </Row>
                    {_.map(clients, (item, index) => {
                        const name = _.get(item, ['client', 'text'])

                        return (
                            <Row key={index} className={classes.tableRow}>
                                <Col xs={11}>{name}</Col>
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

export default enhance(JoinClientListField)
