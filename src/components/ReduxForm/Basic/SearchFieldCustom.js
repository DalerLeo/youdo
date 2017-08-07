import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose, withPropsOnChange, withReducer} from 'recompose'
import MUIAutoComplete from 'material-ui/AutoComplete'
import CircularProgress from 'material-ui/CircularProgress'
import excludeObjKey from '../../../helpers/excludeObjKey'
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'

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

const ZERO = 0
const fetchItem = (props) => {
    const {dispatch, getItem, getItemText} = props
    const id = _.get(props, ['input', 'value', 'value'])

    id && getItem(id)
        .then(data => {
            return getItemText(data)
        })
        .then(data => dispatch({text: data}))
}

const errorStyle = {
    textAlign: 'left',
    bottom: '5px'
}

const enhance = compose(
    injectSheet({
        wrapper: {
            position: 'relative',
            width: '100%'
        },
        icon: {
            position: 'absolute',
            right: '0',
            top: '20px'
        }
    }),

    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {dataSource: [], text: '', loading: false}),

    withPropsOnChange((props, nextProps) => {
        return (!_.get(props, ['dataSource']) && _.get(nextProps, ['loading']) === false) ||
                (_.get(nextProps, ['type']) && (_.get(props, ['type']) !== _.get(nextProps, ['type']))) ||
            ((_.get(props, ['state', 'text']) !== _.get(nextProps, ['state', 'text'])) && (_.get(nextProps, ['state', 'text']).length === ZERO))
    }, (props) => {
        if (_.get(props, ['type']) && _.toInteger(_.get(props, ['type'])) > ZERO) {
            props.dispatch({text: ''})
        }
        _.debounce(fetchList, DELAY_FOR_TYPE_ATTACK)(props)
    }),

    withPropsOnChange((props, nextProps) => {
        const value = _.get(props, ['input', 'value', 'value'])
        const nextValue = _.get(nextProps, ['input', 'value', 'value'])
        return nextValue && value !== nextValue
    }, (props) => fetchItem(props))
)

const SearchFieldCustom = enhance((props) => {
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
    const MINUS_ONE = -1

    return (
        <div className={classes.wrapper}>
            <MUIAutoComplete
                errorText={error}
                searchText={state.text}
                errorStyle={errorStyle}
                floatingLabelText={label}
                filter={(searchText, key) => (searchText.length > ZERO ? key.toLowerCase().search(searchText.toLowerCase()) !== MINUS_ONE : true)}
                dataSource={state.dataSource}
                dataSourceConfig={{text: 'text', value: 'value'}}
                onUpdateInput={value => dispatch({text: value})}
                onNewRequest={value => input.onChange(value)}
                openOnFocus={true}
                style={{position: 'relative'}}
                menuStyle={{maxHeight: '300px', overflowY: 'auto'}}
                textFieldStyle={{width: '400px'}}
                listStyle={{}}
                className="autocomplete"
                {...inputAutoComplete}
                {...autoCompleteProps}
            />
            {!state.loading && <div className={classes.icon}>
                <KeyboardArrowDown style={{color: '#ccc', height: '20px', width: '20px'}}/>
            </div>}
            {state.loading && <div className={classes.icon}>
                <CircularProgress size={20} thickness={2} />
            </div>}
        </div>
    )
})

SearchFieldCustom.defaultGetText = (text) => {
    return (obj) => {
        return _.get(obj, text)
    }
}

SearchFieldCustom.defaultGetValue = (value) => {
    return (obj) => {
        return _.get(obj, value)
    }
}

SearchFieldCustom.propTypes = {
    getText: PropTypes.func.isRequired,
    getValue: PropTypes.func.isRequired,
    getOptions: PropTypes.func.isRequired,
    getItemText: PropTypes.func.isRequired,
    getItem: PropTypes.func.isRequired
}

export default SearchFieldCustom
