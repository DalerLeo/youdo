import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose, withPropsOnChange, withReducer, withHandlers} from 'recompose'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
const DELAY_FOR_TYPE_ATTACK = 300

const fetchList = ({state, dispatch, getOptions, getText, getValue, input}) => {
    const newValues = _.map(input.value, (item) => {
        return {
            value: item
        }
    })
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
            const selectedValues = _.intersectionBy(state.dataSource, newValues, 'value')
            dispatch({dataSource: _.unionBy(data, selectedValues), loading: false})
        })
}

const enhance = compose(
    injectSheet({
        wrapper: {
            width: '100%',
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
                boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px 3px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
                '& ::-webkit-scrollbar': {
                    width: '4px'
                }
            },
            '& .Select-control': {
                borderRadius: '0px',
                border: '0',
                borderBottom: '1px solid #e8e8e8',
                backgroundColor: 'unset',
                '& .Select-value': {
                    paddingLeft: '0',
                    backgroundColor: '#f2f5f8',
                    borderColor: '#efefef',
                    color: '#666666',
                    '& .Select-value-icon': {
                        borderColor: '#efefef'
                    }
                },
                '& .Select-placeholder': {
                    color: 'rgba(0,0,0,0.3)',
                    paddingLeft: '0'
                },
                '& .Select-input': {
                    paddingLeft: '0',
                    marginLeft: '0'
                },
                '& .Select--multi .Select-value': {
                    backgroundColor: '#f2f5f8',
                    borderColor: '#efefef',
                    color: '#6666666'
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
    }, {dataSource: [], text: '', loading: false, open: false}),

    withHandlers({
        valueRenderer: props => (option) => {
            const {meta: {error}} = props
            if (error) {
                return <span style={{color: 'red'}}>{option.text}</span>
            }
            return option.text
        },
        filterOptionRender: props => (options) => {
            const {input} = props
            const newValues = _.map(input.value, (item) => {
                return {
                    value: item
                }
            })
            return _.differenceBy(options, newValues, 'value')
        },
        handleChange: props => (value) => {
            const {input} = props
            const arrValues = _.map(_.split(value, ','), (item) => {
                return _.toNumber(item)
            })

            if (value) {
                input.onChange(arrValues)
            }
            if (!value) {
                input.onChange([])
            }
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return (_.get(props, ['state', 'text']) !== _.get(nextProps, ['state', 'text']) ||
            _.get(props, ['state', 'open']) !== _.get(nextProps, ['state', 'open'])) &&
            _.get(nextProps, ['state', 'open'])
    }, (props) => props.state.open && _.debounce(fetchList, DELAY_FOR_TYPE_ATTACK)(props)),

    withPropsOnChange((props, nextProps) => {
        return !_.isEmpty(_.get(nextProps, ['state', 'dataSource'])) && _.get(nextProps, ['input', 'value']) &&
            _.get(props, ['state', 'loading']) !== _.get(nextProps, ['state', 'loading'])
    }, (props) => {
        const {state, input, dispatch, getText, getValue, getIdsOption} = props
        const items = _.join(_.get(input, 'value'), '-')
        let notFound = true

        for (let i = 0; i < _.size(input.value); i++) {
            if (!_.find(state.dataSource, {'value': input.value[i]})) {
                notFound = true
                break
            }
            notFound = false
        }
        if (!_.isEmpty(input.value) && notFound) {
            getIdsOption(items)
                .then((data) => {
                    return dispatch({
                        dataSource: _.unionBy(state.dataSource, _.map(data, (item) => {
                            return {
                                text: getText(item),
                                value: getValue(item)
                            }
                        }), 'value')
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
        input,
        filterOptionRender
    } = props
    const hintText = state.loading ? <div>Загрузка...</div> : <div>Не найдено</div>
    return (
        <div className={classes.wrapper}>
            <Select
                className={classes.select}
                options={state.dataSource}
                value={input.value}
                onInputChange={text => { dispatch({text: text}) }}
                onChange={handleChange}
                removeSelected={true}
                deleteRemoves={false}
                placeholder={label}
                noResultsText={hintText}
                isLoading={state.loading}
                valueRenderer={valueRenderer}
                labelKey={'text'}
                multi
                simpleValue
                disabled={disabled}
                rtl={true}
                filterOptions={filterOptionRender}
                loadingPlaceholder="Загрузка..."
                onOpen={() => dispatch({open: true})}
                clearAllText="Очистить"
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
