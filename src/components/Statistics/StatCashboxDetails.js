import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import CircularProgress from 'material-ui/CircularProgress'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {reduxForm, Field} from 'redux-form'
import DateToDateField from '../ReduxForm/Basic/DateToDateField'
import Search from 'material-ui/svg-icons/action/search'
import IconButton from 'material-ui/IconButton'
import Excel from 'material-ui/svg-icons/av/equalizer'
import Back from 'material-ui/svg-icons/content/reply'
import Pagination from '../GridList/GridListNavPagination'
import NotFound from '../Images/not-found.png'
import Person from '../Images/person.png'
import numberFormat from '../../helpers/numberFormat'

export const STAT_CASHBOX_FILTER_KEY = {
    CASHBOX: 'cashbox',
    TO_DATE: 'toDate',
    FROM_DATE: 'fromDate'
}
const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            height: '100%',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        detailWrapper: {
            background: '#fff',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '20'
        },
        wrapper: {
            height: 'calc(100% - 40px)',
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '20px 30px',
            '& > div:nth-child(2)': {
                marginTop: '10px',
                borderTop: '1px #efefef solid',
                borderBottom: '1px #efefef solid'
            },
            '& .row': {
                margin: '0 !important'
            }
        },
        tableWrapper: {
            '& .row': {
                '&:after': {
                    bottom: '-1px'
                },
                '& > div': {
                    display: 'flex',
                    height: '40px',
                    alignItems: 'center',
                    '&:last-child': {
                        justifyContent: 'flex-end'
                    }
                }
            },
            '& .dottedList': {
                padding: '0',
                '&:last-child:after': {
                    content: '""',
                    backgroundImage: 'none'
                }
            }
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
        button: {
            background: '#71ce87',
            borderRadius: '2px',
            color: '#fff',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            padding: '5px 15px',
            '& svg': {
                width: '18px !important'
            }
        },
        closeDetail: {
            extend: 'button',
            background: '#12aaeb',
            marginRight: '10px'
        },
        form: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        filter: {
            display: 'flex',
            alignItems: 'center',
            '& > div': {
                width: '170px !important',
                position: 'relative',
                marginRight: '40px',
                '&:after': {
                    content: '""',
                    position: 'absolute',
                    right: '-20px',
                    height: '30px',
                    width: '1px',
                    top: '50%',
                    marginTop: '-15px',
                    background: '#efefef'
                },
                '&:last-child': {
                    '&:after': {
                        display: 'none'
                    }
                }
            }
        },
        balances: {
            display: 'flex',
            padding: '20px 0',
            borderTop: '1px #efefef solid',
            borderBottom: '1px #efefef solid'
        },
        balanceItem: {
            marginRight: '50px',
            '& span': {
                color: '#666',
                marginBottom: '5px'
            },
            '& div': {
                fontSize: '24px',
                fontWeight: '600'
            },
            '&:last-child': {
                marginRight: '0'
            }
        },
        searchButton: {
            marginLeft: '-10px !important',
            '& div': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
        },
        navigation: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px #efefef solid'
        },
        cashier: {
            display: 'flex',
            alignItems: 'center',
            fontWeight: '600',
            '& img': {
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                marginRight: '10px'
            },
            '& span': {
                lineHeight: '13px'
            }
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '200px',
            padding: '200px 0 0',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666',
            '& svg': {
                width: '50px !important',
                height: '50px !important',
                color: '#999 !important'
            }
        }
    }),
    reduxForm({
        form: 'StatCashboxFilterForm',
        enableReinitialize: true
    }),
)

const StatCashboxDetails = enhance((props) => {
    const {
        listData,
        detailData,
        classes,
        filter,
        handleSubmitFilterDialog,
        getDocument
    } = props

    const listLoading = _.get(detailData, 'detailLoading')
    const handleCloseDetail = _.get(detailData, 'handleCloseDetail')
    const currency = _.get(_.find(_.get(listData, 'data'), {'id': _.get(detailData, 'id')}), ['currency', 'name'])

    const headerStyle = {
        backgroundColor: '#fff',
        fontWeight: '600',
        color: '#666'
    }
    const iconStyle = {
        icon: {
            color: '#5d6474',
            width: 22,
            height: 22
        },
        button: {
            width: 40,
            height: 40,
            padding: 0
        }
    }

    const headers = (
        <Row style={headerStyle} className="dottedList">
            <Col xs={2}>№</Col>
            <Col xs={3}>Категория</Col>
            <Col xs={4}>Описание</Col>
            <Col xs={3}>Сумма</Col>
        </Row>
    )
    const list = _.map(_.get(detailData, 'transactionData'), (item) => {
        const id = _.get(item, 'id')
        const comment = _.get(item, 'comment') || '-'
        const expanseCategory = _.get(item, ['expanseCategory', 'name'])
        const amount = numberFormat(_.get(item, 'amount'), currency)

        return (
            <Row key={id} className="dottedList">
                <Col xs={2}>{id}</Col>
                <Col xs={3}>{expanseCategory}</Col>
                <Col xs={4}>{comment}</Col>
                <Col xs={3}>{amount}</Col>
            </Row>
        )
    })

    return (
        <div className={classes.detailWrapper}>
            {listLoading
                ? <div className={classes.loader}>
                    <CircularProgress size={40} thickness={4}/>
                </div>
                : <div className={classes.wrapper}>
                    <form className={classes.form} onSubmit={handleSubmitFilterDialog}>
                        <div className={classes.filter}>
                            <Field
                                className={classes.inputFieldCustom}
                                name="date"
                                component={DateToDateField}
                                label="Диапазон дат"
                                fullWidth={true}/>
                            <IconButton
                                className={classes.searchButton}
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                type="submit">
                                <Search/>
                            </IconButton>
                        </div>
                        <div>
                            <a className={classes.closeDetail}
                               onClick={handleCloseDetail}>
                                <Back color="#fff"/> <span>Вернуться</span>
                            </a>
                            <a className={classes.button}
                               onClick={getDocument.handleGetDocument}>
                                <Excel color="#fff"/> <span>Excel</span>
                            </a>
                        </div>
                    </form>
                    <div className={classes.balances}>
                        <div className={classes.balanceItem}>
                            <span>Баланс на начало периода</span>
                            <div>10 000 000 UZS</div>
                        </div>
                        <div className={classes.balanceItem}>
                            <span>Расход за период</span>
                            <div>-5 000 000 UZS</div>
                        </div>
                        <div className={classes.balanceItem}>
                            <span>Доход за период</span>
                            <div>25 000 000 UZS</div>
                        </div>
                        <div className={classes.balanceItem}>
                            <span>Баланс на конец периода</span>
                            <div>30 000 000 UZS</div>
                        </div>
                    </div>
                    <div className={classes.navigation}>
                        <div className={classes.cashier}>
                            <img src={Person} alt=""/>
                            <span>Бамбамбиев <br/> Куркуда</span>
                        </div>
                        <Pagination filter={filter}/>
                    </div>
                    {(_.isEmpty(list) && !listLoading) ? <div className={classes.emptyQuery}>
                        <div>По вашему запросу ничего не найдено</div>
                    </div>
                        : <div className={classes.tableWrapper}>
                            {headers}
                            {list}
                        </div>}
                </div>}

        </div>
    )
})

StatCashboxDetails.propTypes = {
    filter: PropTypes.object,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    handleSubmitFilterDialog: PropTypes.func,
    getDocument: PropTypes.object
}

export default StatCashboxDetails
