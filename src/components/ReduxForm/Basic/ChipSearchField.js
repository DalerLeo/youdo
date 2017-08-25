import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose, withPropsOnChange, withReducer, withHandlers} from 'recompose'
import MUIAutoComplete from 'material-ui/AutoComplete'
import CircularProgress from 'material-ui/CircularProgress'
import excludeObjKey from '../../../helpers/excludeObjKey'
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import Chip from 'material-ui/Chip'

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

const errorStyle = {
    textAlign: 'left',
    bottom: '5px'
}

const enhance = compose(
    injectSheet({
        wrapper: {
            position: 'relative'
        },
        icon: {
            position: 'absolute',
            right: '0',
            top: '20px'
        },
        chipWrapper: {
            display: 'flex',
            flexWrap: 'wrap'
        }
    }),

    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    },
        {dataSource: [], text: '', loading: false, chips: []}
    ),
    withHandlers({
        handleRequestDelete: props => (value) => {
            const {dispatch, state, input} = props
            input.onChange(_.filter(state.chips, (item) => item.value !== value))
            dispatch({chips: _.filter(state.chips, (item) => item.value !== value)})
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return (!_.get(props, ['dataSource']) && _.get(nextProps, ['loading']) === false)
    }, (props) => {
        _.debounce(fetchList, DELAY_FOR_TYPE_ATTACK)(props)
    }),

)

const changed = (val, props) => {
    const {dispatch, state} = props
    props.input.onChange(_.union(state.chips, _.filter(state.dataSource, {'value': val.value})))
    dispatch({text: '', chips: _.union(state.chips, _.filter(state.dataSource, {'value': val.value}))})
}

const ChipSearchField = enhance((props) => {
    const {
        classes,
        input,
        label,
        meta: {error},
        state,
        dispatch,
        handleRequestDelete,
        ...defaultProps
    } = props

    const autoCompleteProps = excludeObjKey(defaultProps, [
        'sheet', 'getText', 'getValue', 'getOptions', 'getItem', 'getItemText'
    ])
    const MINUS_ONE = -1

    return (
        <div>
        <div className={classes.wrapper}>
            <MUIAutoComplete
                errorText={error}
                searchText={input.value ? state.text : ''}
                menuProps={{menuItemStyle: {fontSize: '13px'}}}
                errorStyle={errorStyle}
                floatingLabelText={label}
                filter={(searchText, key) => (searchText.length > ZERO ? key.toLowerCase().search(searchText.toLowerCase()) !== MINUS_ONE : true)}
                dataSource={_.xorWith(state.dataSource, state.chips, _.isEqual)}
                dataSourceConfig={{text: 'text', value: 'value'}}
                onUpdateInput={value => dispatch({text: value})}
                onNewRequest={value => changed(value, props)}
                openOnFocus={true}
                style={{position: 'relative'}}
                menuStyle={{maxHeight: '300px', overflowY: 'auto'}}
                textFieldStyle={{width: '400px'}}
                listStyle={{}}
                className="autocomplete"
                {...autoCompleteProps}
            />
            {!state.loading && <div className={classes.icon}>
                <KeyboardArrowDown style={{color: '#ccc', height: '20px', width: '20px'}}/>
            </div>}
            {state.loading && <div className={classes.icon}>
                <CircularProgress size={20} thickness={2} />
            </div>}
        </div>
            <div className={classes.chipWrapper}>
                {_.map(state.chips, (item) => {
                    return (
                        <Chip
                            key={item.value}
                            style={{margin: 4}}
                            onRequestDelete={() => { handleRequestDelete(item.value) }}
                        >
                            {item.text}
                        </Chip>
                    )
                })}
            </div>
        </div>
    )
})

ChipSearchField.defaultGetText = (text) => {
    return (obj) => {
        return _.get(obj, text)
    }
}

ChipSearchField.defaultGetValue = (value) => {
    return (obj) => {
        return _.get(obj, value)
    }
}

ChipSearchField.propTypes = {
    getText: PropTypes.func.isRequired,
    getValue: PropTypes.func.isRequired,
    getOptions: PropTypes.func.isRequired,
    getItemText: PropTypes.func.isRequired,
    getItem: PropTypes.func.isRequired
}

export default ChipSearchField
