import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose, withPropsOnChange, withReducer, withHandlers} from 'recompose'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
const DELAY_FOR_TYPE_ATTACK = 300
import t from '../../../helpers/translate'

const fetchList = ({state, dispatch, getOptions, getText, getValue, input}) => {
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
            dispatch({dataSource: _.unionBy(data, state.dataSource, 'value'), loading: false})
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
                    margin: '0 5px 5px 0',
                    backgroundColor: '#f2f5f8',
                    borderColor: '#efefef',
                    color: '#666666',
                    '& .Select-value-icon': {
                        padding: '2px 5px',
                        borderColor: '#efefef',
                        '&:hover': {
                            backgroundColor: 'rgba(45, 48, 55, 0.08)',
                            color: '#5d6474'
                        }
                    }
                },
                '& .Select-placeholder': {
                    color: 'rgba(0,0,0,0.3)',
                    paddingLeft: '0',
                    top: '12px'
                },
                '& .Select-input': {
                    paddingLeft: '0',
                    paddingTop: '12px',
                    marginLeft: '0',
                    height: '44px'
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
                background: '#f6f6f6'
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
        filterOptionRender: props => (options) => {
            const {input} = props
            const newValues = _.map(input.value, (item) => {
                return {
                    value: item
                }
            })
            return _.differenceBy(options, newValues, 'value')
        },
        handleChange: props => (options) => {
            const {input} = props
            const arrValues = _.map(options, (item) => {
                return item.value
            })
            if (!_.isEmpty(options)) {
                input.onChange(arrValues)
            }
            if (_.isEmpty(options)) {
                input.onChange([])
            }
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return (_.get(props, ['state', 'text']) !== _.get(nextProps, ['state', 'text']) ||
            _.get(props, ['state', 'open']) !== _.get(nextProps, ['state', 'open'])) &&
            _.get(nextProps, ['state', 'open'])
    }, (props) => props.state.open && _.debounce(fetchList, DELAY_FOR_TYPE_ATTACK)(props))

)

const MultiSelectField = enhance((props) => {
    const {
        classes,
        label,
        state,
        dispatch,
        handleChange,
        disabled,
        input,
        filterOptionRender
    } = props
    const hintText = state.loading ? <div>{t('Загрузка')}...</div> : <div>{t('Не найдено')}</div>
    return (
        <div className={classes.wrapper}>
            <Select.Creatable
                className={classes.select}
                options={state.dataSource}
                value={input.value}
                onInputChange={text => { dispatch({text: text}) }}
                onChange={handleChange}
                placeholder={label}
                noResultsText={hintText}
                isLoading={state.loading}
                labelKey={'text'}
                disabled={disabled}
                promptTextCreator={value => (t('Добавить') + ': ' + value)}
                filterOptions={filterOptionRender}
                loadingPlaceholder={t('Загрузка') + '...'}
                onOpen={() => dispatch({open: true})}
                clearAllText={t('Очистить')}
                multi={true}
                removeSelected={true}
                deleteRemoves={false}
                rtl={true}
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
