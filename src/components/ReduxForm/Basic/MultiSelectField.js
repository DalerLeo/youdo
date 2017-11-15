import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose, withPropsOnChange, withReducer, withHandlers} from 'recompose'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
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
            dispatch({dataSource: data, loading: false})
        })
}

const enhance = compose(
    injectSheet({
        wrapper: {
            width: '100%',
            height: '45px',
            '& .is-focused:not(.is-open) > .Select-control': {
                borderBottom: 'solid 2px #5d6474',
                boxShadow: 'unset'
            }
        },
        select: {
            '& .Select-menu': {
                background: '#fff',
                maxHeight: '200px'
            },
            '& .Select-menu-outer': {
                maxHeight: '200px',
                zIndex: '99',
                boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px 3px, rgba(0, 0, 0, 0.12) 0px 1px 4px'
            },
            '& .Select-control': {
                borderRadius: '0px',
                border: '0',
                borderBottom: '1px solid #e8e8e8',
                backgroundColor: 'unset',
                '& .Select-value': {
                    paddingLeft: '0'
                },
                '& .Select-placeholder': {
                    color: 'rgba(0,0,0,0.3)',
                    paddingLeft: '0'
                },
                '& .Select-input': {
                    paddingLeft: '0'
                }
            },
            '& .Select-input > input': {
                width: '100% !important',
                overflow: 'hidden'
            },
            '& .Select-option.is-focused, .Select-option.is-selected': {
                background: 'unset'
            }
        }
    }),

    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {dataSource: [], text: '', loading: false, values: []}),

    withHandlers({
        valueRenderer: props => (option) => {
            const {meta: {error}} = props
            if (error) {
                return <span style={{color: 'red'}}>{option.text}</span>
            }
            return option.text
        },
        handleChange: props => (value) => {
            const arrValues = _.map(_.split(value, ','), (item) => {
                return _.toNumber(item)
            })

            const {dispatch, state, input} = props
            if (value) {
                dispatch({values: _.union(state.values, arrValues)})
            }
            if (!value) {
                dispatch({values: []})
            }
            input.onChange(state.values)
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return _.get(props, ['input', 'value', 'value']) !== _.get(nextProps, ['input', 'value', 'value']) && _.get(nextProps, ['withDetails'])
    }, (props) => {
        _.get(props, ['withDetails']) &&
        _.get(props, ['input', 'value', 'value']) &&
        props.getItem(_.get(props, ['input', 'value', 'value']))
    }),
    withPropsOnChange((props, nextProps) => {
        return _.get(props, ['state', 'text']) !== _.get(nextProps, ['state', 'text'])
    }, (props) => _.debounce(fetchList, DELAY_FOR_TYPE_ATTACK)(props)),
    withPropsOnChange((props, nextProps) => {
        return !_.isEmpty(_.get(nextProps, ['state', 'dataSource'])) && _.get(nextProps, ['input', 'value']) &&
            _.get(props, ['state', 'loading']) !== _.get(nextProps, ['state', 'loading'])
    }, (props) => {
        const {state, input, getItem, dispatch, getText, getValue} = props
        const finder = _.find(state.dataSource, {'value': input.value.value})
        if (_.isEmpty(finder) && input.value.value) {
            getItem(input.value.value).then((data) => {
                return dispatch({
                    dataSource: _.union(props.state.dataSource, [{
                        text: getText(data), value: getValue(data)
                    }])
                })
            })
        }
    }),
)

const MultiSelectField = enhance((props) => {
    const {
        classes,
        label,
        state,
        dispatch,
        valueRenderer,
        handleChange,
        disabled,
        input
    } = props
    input.onChange(state.values)
    return (
        <div className={classes.wrapper}>
            <Select
                className={classes.select}
                options={state.dataSource}
                value={state.values}
                onInputChange={text => dispatch({text: text})}
                onChange={handleChange}
                placeholder={label}
                noResultsText={'Не найдено'}
                isLoading={state.loading}
                valueRenderer={valueRenderer}
                labelKey={'text'}
                multi
                simpleValue
                removeSelected={true}
                disabled={disabled}
                filterOptions={options => options}
            />
        </div>
    )
})

MultiSelectField.defaultGetText = (text) => {
    return (obj) => {
        return _.get(obj, text)
    }
}

MultiSelectField.defaultGetValue = (value) => {
    return (obj) => {
        return _.get(obj, value)
    }
}

MultiSelectField.propTypes = {
    getText: PropTypes.func.isRequired,
    getValue: PropTypes.func.isRequired,
    getOptions: PropTypes.func.isRequired
}

export default MultiSelectField
