import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose, withPropsOnChange, withReducer, withHandlers} from 'recompose'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
const DELAY_FOR_TYPE_ATTACK = 300

const fetchList = ({state, dispatch, getOptions, getText, getValue, input}, parent) => {
    if (parent) {
        input.onChange(null)
    }
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
    }, {dataSource: [], text: '', loading: false}),

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
        return _.get(props, ['parent']) !== _.get(nextProps, ['parent'])
    }, (props) => {
        !_.isEmpty(_.get(props, ['state', 'dataSource'])) && _.debounce(fetchList, DELAY_FOR_TYPE_ATTACK)(props, true)
    }),
    withPropsOnChange((props, nextProps) => {
        return _.get(props, ['state', 'text']) !== _.get(nextProps, ['state', 'text'])
    }, (props) => _.debounce(fetchList, DELAY_FOR_TYPE_ATTACK)(props)),
)

const SearchField = enhance((props) => {
    const {
        classes,
        label,
        state,
        dispatch,
        valueRenderer,
        input
    } = props
    return (
        <div className={classes.wrapper}>
            <Select
                className={classes.select}
                options={state.dataSource}
                value={input.value.value || null}
                onInputChange={text => dispatch({text: text})}
                onChange={value => input.onChange(value)}
                placeholder={label}
                noResultsText={'Не найдено'}
                isLoading={state.loading}
                valueRenderer={valueRenderer}
                labelKey={'text'}
                filterOptions={options => options}
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