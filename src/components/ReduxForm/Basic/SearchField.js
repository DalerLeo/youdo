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

const fetchItem = (props) => {
    const {dispatch, getItem, getItemText} = props
    const id = _.get(props, ['input', 'value', 'value'])

    id && getItem(id)
        .then(data => {
            return getItemText(data)
        })
        .then(data => dispatch({text: data}))
}

const enhance = compose(
    injectSheet({
        wrapper: {
            position: 'relative',
            width: '100%',
            height: '45px',
            '& .Select-menu': {
                maxHeight: '300px',
                boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px 3px, rgba(0, 0, 0, 0.12) 0px 1px 4px'
            },
            '& .is-focused:not(.is-open) > .Select-control': {
                borderBottom: 'solid 2px #5d6474',
                boxShadow: 'unset'
            }
        },
        icon: {
            position: 'absolute',
            right: '0',
            top: '20px'
        },
        select: {
            '& .Select-menu': {
                background: '#fff'
            },
            '& .Select-menu-outer': {
                overflowY: 'unset',
                zIndex: '6',
                border: 'unset'
            },
            '& .Select-control': {
                borderRadius: '0px',
                border: '0',
                borderBottom: '1px solid #e8e8e8'
            }
        }
    }),

    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {dataSource: [], text: '', loading: false, selectedVal: null}),

    withHandlers({
        handleInputValue: props => (value) => {
            const {dispatch, input} = props
            input.onChange(value)
            dispatch({selectedVal: _.get(value, 'value')})
        },
        valueRenderer: props => (option) => {
            const {meta: {error}} = props
            if (error) {
                return <span style={{color: 'red'}}>{option.label}</span>
            }
            return option.text
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return _.get(props, ['state', 'text']) !== _.get(nextProps, ['state', 'text'])
    }, (props) => _.debounce(fetchList, DELAY_FOR_TYPE_ATTACK)(props)),

    withPropsOnChange((props, nextProps) => {
        const value = _.get(props, ['input', 'value', 'value'])
        const nextValue = _.get(nextProps, ['input', 'value', 'value'])
        return nextValue && value !== nextValue
    }, (props) => fetchItem(props))
)

const SearchField = enhance((props) => {
    const {
        classes,
        label,
        state,
        dispatch,
        handleInputValue,
        valueRenderer
    } = props
    return (
        <div className={classes.wrapper}>
            <Select
                className={classes.select}
                options={state.dataSource}
                value={state.selectedVal}
                onInputChange={selectedVal => dispatch({text: selectedVal})}
                onChange={val => handleInputValue(val)}
                placeholder={label}
                noResultsText={'Не найдено'}
                isLoading={state.loading}
                valueRenderer={valueRenderer}
                labelKey={'text'}

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
    getOptions: PropTypes.func.isRequired,
    getItemText: PropTypes.func.isRequired,
    getItem: PropTypes.func.isRequired
}

export default SearchField
