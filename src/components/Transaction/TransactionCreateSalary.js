import _ from 'lodash'
import React from 'react'
import {compose, withHandlers, withState} from 'recompose'
import injectSheet from 'react-jss'
import SearchIcon from 'material-ui/svg-icons/action/search'
import Loader from '../Loader'
import {Field, SubmissionError} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import t from '../../helpers/translate'
import {TextField, normalizeNumber} from '../ReduxForm'
import NotFound from '../Images/not-found.png'
import {openErrorAction} from '../../actions/error'

const enhance = compose(
    injectSheet({
        usersLoader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%'
        },
        salaryWrapper: {
            borderLeft: '1px #efefef solid',
            maxHeight: '600px',
            overflowY: 'auto'
        },
        inputFieldCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            '& div': {
                fontSize: '13px !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& input': {
                marginTop: '0 !important'
            }
        },
        subTitle: {
            margin: '10px 30px',
            fontWeight: '600'
        },
        user: {
            padding: '10px 30px',
            maxHeight: '45px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            '&:hover': {
                background: '#f2f5f8'
            }
        },
        searchWrapper: {
            padding: '0 30px',
            marginBottom: '10px'
        },
        search: {
            borderBottom: '2px #efefef solid',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            width: '100%'
        },
        searchField: {
            display: 'flex',
            color: '#333',
            fontSize: '13px !important',
            width: '100%',
            '& > input': {
                border: 'none',
                outline: 'none',
                height: '35px !important'
            }
        },
        searchButton: {
            width: '35px',
            height: '35px',
            display: 'flex',
            position: 'absolute !important',
            alignItems: 'center',
            justifyContent: 'center',
            right: '0'
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center 20px',
            backgroundSize: '165px',
            padding: '135px 0 20px',
            textAlign: 'center',
            color: '#999'
        }
    }),
    withState('searchQuery', 'setSearchQuery', ''),
    withHandlers({
        validate: props => (data) => {
            const errors = toCamelCase(data)
            const nonFieldErrors = _.get(errors, 'nonFieldErrors')
            props.dispatch(openErrorAction({
                message: <div>{nonFieldErrors}</div>
            }))
            throw new SubmissionError({
                ...errors,
                _error: nonFieldErrors
            })
        }
    })
)
const iconStyle = {
    color: '#5d6474',
    width: 22,
    height: 22
}
const NOT_FOUND = -1
const TransactionCreateSalary = enhance((props) => {
    const {
        classes,
        usersData,
        searchQuery,
        setSearchQuery
    } = props
    const handleSearch = (event) => {
        setSearchQuery(event.target.value.toLowerCase())
    }
    const filterData = _.orderBy(_.get(usersData, 'data'), ['firstName', 'secondName'], ['asc', 'asc'])
    const filteredList = filterData.filter((el) => {
        const searchValue = el.firstName.toLowerCase()
        const searchValue2 = el.secondName.toLowerCase()
        return searchValue.indexOf(searchQuery) !== NOT_FOUND || searchValue2.indexOf(searchQuery) !== NOT_FOUND
    })
    return (
        <div className={classes.salaryWrapper}>
            <div className={classes.subTitle}>{t('Список сотрудников')}</div>
            <div className={classes.searchWrapper}>
                <div className={classes.search}>
                    <div className={classes.searchField}>
                        <input
                            type="text"
                            placeholder={t('Поиск сотрудников...')}
                            onChange={handleSearch}/>
                        <div className={classes.searchButton}>
                            <SearchIcon style={iconStyle}/>
                        </div>
                    </div>
                </div>
            </div>
            {_.get(usersData, 'loading')
                ? <div className={classes.usersLoader}>
                    <Loader size={0.75}/>
                </div>
                : _.isEmpty(filteredList)
                    ? <div className={classes.emptyQuery}>
                        <div>{t('Сотрудников не найдено')} ...</div>
                    </div>
                    : _.map(filteredList, (item) => {
                        const id = _.get(item, 'id')
                        const userName = _.get(item, 'firstName') + ' ' + _.get(item, 'secondName')
                        return (
                            <div key={id} className={classes.user}>
                                {userName}
                                <Field
                                    hintText={'Сумма'}
                                    name={'users[' + id + '][amount]'}
                                    component={TextField}
                                    normalize={normalizeNumber}
                                    hintStyle={{left: 'auto', right: '0'}}
                                    inputStyle={{textAlign: 'right'}}
                                    className={classes.inputFieldCustom}
                                    style={{width: '150px'}}
                                />
                            </div>
                        )
                    })
            }
        </div>
    )
})

export default TransactionCreateSalary
