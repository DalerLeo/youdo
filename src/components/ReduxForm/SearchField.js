import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose, withPropsOnChange, withReducer} from 'recompose'
import MUIAutoComplete from 'material-ui/AutoComplete'
import SearchIcon from 'material-ui/svg-icons/action/search'
import CircularProgress from 'material-ui/CircularProgress'
import excludeObjKey from '../../helpers/excludeObjKey'

const DELAY_FOR_TYPE_ATTACK = 300

const errorStyle = {
    textAlign: 'left'
}

const enhance = compose(
    injectSheet({
        wrapper: {
            position: 'relative'
        },
        icon: {
            position: 'absolute',
            right: '0',
            top: '35px'
        }
    }),

    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {dataSource: [], text: '', loading: false}),

    withPropsOnChange((props, nextProps) => {
        return _.get(props, ['state', 'text']) !== _.get(nextProps, ['state', 'text'])
    }, _.debounce(({state, dispatch, getOptions, getText, getValue}) => {
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
    }, DELAY_FOR_TYPE_ATTACK)),

    withPropsOnChange((props, nextProps) => {
        const value = _.get(props, ['input', 'value', 'value'])
        const nextValue = _.get(nextProps, ['input', 'value', 'value'])
        return nextValue && value !== nextValue
    }, (props) => {
        const {dispatch, getItem, getItemText} = props
        const id = _.get(props, ['input', 'value', 'value'])

        id && getItem(id)
            .then(data => {
                return getItemText(data)
            })
            .then(data => dispatch({text: data}))
    })
)

const SearchField = enhance((props) => {
    const {
        classes,
        input,
        label,
        meta: {error},
        state,
        dispatch,
        ...defaultProps
    } = props

    const autoCompleteProps = excludeObjKey(defaultProps, [
        'sheet', 'getText', 'getValue', 'getOptions', 'getItem', 'getItemText'
    ])
    const inputAutoComplete = excludeObjKey(input, ['value', 'onChange'])

    return (
        <div className={classes.wrapper}>
            <MUIAutoComplete
                errorText={error}
                searchText={state.text}
                errorStyle={errorStyle}
                floatingLabelText={label}
                dataSource={state.dataSource}
                dataSourceConfig={{text: 'text', value: 'value'}}
                onUpdateInput={value => dispatch({text: value})}
                onNewRequest={value => input.onChange(value)}
                openOnFocus={true}
                filter={() => true}
                {...inputAutoComplete}
                {...autoCompleteProps}
            />
            {!state.loading && <div className={classes.icon}>
                <SearchIcon />
            </div>}
            {state.loading && <div className={classes.icon}>
                <CircularProgress size={25} thickness={3} />
            </div>}
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
