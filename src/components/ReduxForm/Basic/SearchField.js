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
                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px 3px 10px',
                border: 'none',
                '& ::-webkit-scrollbar': {
                    width: '4px'
                }
            },
            '& .Select-control': {
                borderRadius: '0px',
                border: '0',
                borderBottom: '1px solid #e8e8e8',
                backgroundColor: 'unset',
                height: '44px',
                marginBottom: '8px',
                '& .Select-value': {
                    paddingLeft: '0',
                    marginTop: '12px'
                },
                '& .Select-placeholder': {
                    color: 'rgba(0,0,0,0.3)',
                    paddingLeft: '0',
                    top: '12px'
                },
                '& .Select-input': {
                    paddingLeft: '0',
                    paddingTop: '12px'
                }
            },
            '& .Select-input > input': {
                width: '100% !important',
                overflow: 'hidden'
            },
            '& .Select-option.is-focused, .Select-option.is-selected': {
                background: 'unset'
            },
            '& .Select-arrow-zone': {
                paddingTop: '12px'
            },
            '& .Select-clear-zone': {
                paddingTop: '12px'
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
        return (_.get(props, ['state', 'text']) !== _.get(nextProps, ['state', 'text']) ||
            _.get(props, ['state', 'open']) !== _.get(nextProps, ['state', 'open'])) &&
            _.get(nextProps, ['state', 'open'])
    }, (props) => {
        props.state.open && _.debounce(fetchList, DELAY_FOR_TYPE_ATTACK)(props)
    }),

    withPropsOnChange((props, nextProps) => {
        return (!_.isEmpty(_.get(nextProps, ['state', 'dataSource'])) || _.get(props, ['input', 'value']) !== _.get(nextProps, ['input', 'value'])) &&
        _.get(nextProps, ['input', 'value'])
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

const SearchField = enhance((props) => {
    const {
        classes,
        label,
        state,
        dispatch,
        valueRenderer,
        input,
        disabled,
        clearValue
    } = props
    const hintText = state.loading ? <div>Загрузка...</div> : <div>Не найдено</div>
    return (
        <div className={classes.wrapper}>
            <Select
                className={classes.select}
                options={state.dataSource}
                value={input.value.value || null}
                onInputChange={text => dispatch({text: text})}
                onChange={value => input.onChange(value)}
                placeholder={label}
                noResultsText={hintText}
                isLoading={state.loading}
                valueRenderer={valueRenderer}
                labelKey={'text'}
                disabled={disabled}
                onOpen={() => { dispatch({open: true}) }}
                closeOnSelect={true}
                filterOptions={options => options}
                clearable={clearValue}
                loadingPlaceholder="Загрузка..."
            />
        </div>
    )
})

SearchField.defaultGetText = (text) => {
    return (obj) => {
        return _.get(obj, text)
    }
}

SearchField.defaultGetValue = (value) => {
    return (obj) => {
        return _.get(obj, value)
    }
}

SearchField.propTypes = {
    getText: PropTypes.func.isRequired,
    getValue: PropTypes.func.isRequired,
    getOptions: PropTypes.func.isRequired
}

export default SearchField
