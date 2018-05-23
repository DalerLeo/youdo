import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose, withPropsOnChange, withReducer} from 'recompose'
import {AutoComplete, Input, Icon} from 'antd'

const DELAY_FOR_TYPE_ATTACK = 300
const fetchList = ({state, dispatch, getOptions, getText, getValue}) => {
    dispatch({loading: true})
    getOptions(state.text)
        .then((data) => {
            return _.map(data, (item) => {
                return {
                    text: getText(item),
                    value: getValue(item)
                }
            })
        })
        .then((data) => {
            dispatch({dataSource: data})
            dispatch({loading: false})
        })
}

const enhance = compose(
    injectSheet({
        wrapper: {
            '& .ant-select-selection': {
                boxShadow: 'none !important'
            },
            '& .ant-select-selection__rendered': {
                lineHeight: '45px !important'
            },
            '& .ant-input': {
                border: '1px #d9d9d9 solid !important',
                boxShadow: 'none !important',
                height: '45px !important'
            },
            '& .ant-input-suffix': {
                background: '#efefef',
                borderRadius: '0 4px 4px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                right: '1px',
                height: 'calc(100% - 2px)',
                width: '45px'
            }
        },
        dropdown: {
            zIndex: '4000',
            '& .ant-select-dropdown-menu-item-active': {
                background: '#efefef'
            }
        },
        suffix: {

        }
    }),

    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {
        dataSource: [],
        text: '',
        loading: false,
        open: false
    }),

    withPropsOnChange((props, nextProps) => {
        const value = _.get(props, ['input', 'value'])
        const valueNext = _.get(nextProps, ['input', 'value'])
        return value !== valueNext
    }, (props) => {
        const value = _.toInteger(_.get(props, ['input', 'value']))
        const withDetails = _.get(props, ['withDetails'])
        withDetails && value && props.getItem(value)
    }),
    withPropsOnChange((props, nextProps) => {
        const text = _.get(props, ['state', 'text'])
        const open = _.get(props, ['state', 'open'])
        const nextText = _.get(nextProps, ['state', 'text'])
        const nextOpen = _.get(nextProps, ['state', 'open'])
        return (text !== nextText || open !== nextOpen) && nextOpen
    }, (props) => {
        if (props.state.open) {
            return _.debounce(fetchList, DELAY_FOR_TYPE_ATTACK)(props)
        }
        return null
    }),

    withPropsOnChange((props, nextProps) => {
        const value = _.get(props, ['input', 'value'])
        const valueNext = _.get(nextProps, ['input', 'value'])
        const dataSource = _.get(nextProps, ['state', 'dataSource'])
        return (!_.isEmpty(dataSource) || value !== valueNext) && valueNext
    }, (props) => {
        const {state, input, getItem, dispatch, getText, getValue} = props
        const value = _.toInteger(input.value)
        const finder = _.find(state.dataSource, {value})
        if (_.isEmpty(finder) && value) {
            getItem(value)
                .then((data) => {
                    if (!_.isEmpty(data)) {
                        return dispatch({
                            dataSource: _.unionBy(props.state.dataSource, [{
                                text: getText(data), value: getValue(data)
                            }], 'value')
                        })
                    }
                    return null
                })
        }
    }),
)

const AntSearchField = enhance(({...props}) => {
    const {
        classes,
        label,
        state,
        dispatch,
        input
    } = props

    return (
        <AutoComplete
            {...input}
            {...props}
            className={classes.wrapper}
            dataSource={state.dataSource}
            showSearch={true}
            onSearch={text => dispatch({text: text})}
            dropdownClassName={classes.dropdown}
            notFoundContent={state.loading ? 'Загрузка...' : 'Не найдено...'}
            placeholder={label}
            onFocus={() => { dispatch({open: true}) }}>
            <Input suffix={(
                <div className={classes.suffix}>
                    <Icon type={'down'}/>
                </div>
            )}/>
        </AutoComplete>
    )
})

AntSearchField.defaultGetText = (text) => {
    return (obj) => {
        return _.get(obj, text)
    }
}

AntSearchField.defaultGetValue = (value) => {
    return (obj) => {
        return _.get(obj, value)
    }
}

AntSearchField.propTypes = {
    getText: PropTypes.func.isRequired,
    getValue: PropTypes.func.isRequired,
    getOptions: PropTypes.func.isRequired
}

export default AntSearchField
