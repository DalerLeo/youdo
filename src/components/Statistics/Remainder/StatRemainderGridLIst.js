import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../../constants/routes'
import {Link} from 'react-router'
import Container from '../../Container'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {connect} from 'react-redux'
import {reduxForm, Field} from 'redux-form'
import {StockMultiSearchField, ProductTypeParentSearchField, ProductTypeChildSearchField, TextField} from '../../ReduxForm'
import StatRemainderDialog from './StatRemainderDialog'
import StatSideMenu from '../StatSideMenu'
import Search from 'material-ui/svg-icons/action/search'
import IconButton from 'material-ui/IconButton'
import Loader from '../../Loader'
import Pagination from '../../GridList/GridListNavPagination/index'
import numberFormat from '../../../helpers/numberFormat.js'
import NotFound from '../../Images/not-found.png'
import getConfig from '../../../helpers/getConfig'
import ToolTip from '../../ToolTip'
import {StatisticsFilterExcel} from '../../Statistics'
import t from '../../../helpers/translate'

export const STAT_REMAINDER_FILTER_KEY = {
    STOCK: 'stock',
    TYPE: 'type',
    TYPE_PARENT: 'typeParent',
    SEARCH: 'search'
}
const enhance = compose(
    injectSheet({
        mainWrapper: {
            background: '#fff',
            margin: '0 -28px',
            height: 'calc(100% + 28px)',
            boxShadow: 'rgba(0, 0, 0, 0.09) 0px -1px 6px, rgba(0, 0, 0, 0.10) 0px -1px 4px'
        },
        block: {
            display: 'block'
        },
        loader: {
            width: '100%',
            padding: '100px 0',
            background: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '999',
            display: 'flex'
        },
        wrapper: {
            padding: '20px 30px',
            height: 'calc(100% - 40px)',
            '& .row': {
                margin: '0'
            }
        },
        linkList: {
            color: 'inherit',
            '& .dottedList': {
                padding: '0 30px',
                margin: '0 -30px',
                '&:hover': {
                    backgroundColor: '#f2f5f8'
                }
            },
            '&:last-child .dottedList': {
                '&:after': {
                    display: 'none'
                }
            }
        },
        tableWrapper: {
            height: 'calc(100% - 118px)',
            '& .row': {
                '&:after': {
                    bottom: '-1px'
                },
                '& > div': {
                    display: 'flex',
                    height: '50px',
                    alignItems: 'center',
                    '&:first-child': {
                        paddingLeft: '0'
                    },
                    '&:last-child': {
                        paddingRight: '0'
                    }
                }
            },
            '& .personImage': {
                borderRadius: '50%',
                overflow: 'hidden',
                height: '30px',
                minWidth: '30px',
                width: '30px',
                marginRight: '10px',
                '& img': {
                    display: 'flex',
                    height: '100%',
                    width: '100%'
                }
            }
        },
        balanceInfo: {
            padding: '15px 0'
        },
        balance: {
            paddingRight: '10px',
            fontSize: '24px!important',
            fontWeight: '600'
        },
        balanceButtonWrap: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        summary: {
            display: 'flex',
            position: 'relative',
            justifyContent: 'space-between',
            borderTop: 'solid 1px #efefef',
            borderBottom: 'solid 1px #efefef',
            marginTop: '10px',
            padding: '14px 0',
            color: '#666',
            '& > div': {
                '& > div': {
                    fontSize: '16px',
                    color: '#333',
                    fontWeight: '600',
                    '& span': {
                        fontSize: '13px',
                        fontWeight: '400'
                    }
                },
                '& > span': {
                    display: 'block'
                },
                '&:last-child': {
                    textAlign: 'right'
                }

            }
        },
        summaryLoader: {
            background: '#fff',
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '4'
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
                width: '140px!important',
                position: 'relative',
                marginRight: '40px',
                '&:last-child': {
                    margin: '0',
                    width: '25px !important'
                },
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
                '&:last-child:after': {
                    display: 'none'
                }
            }
        },
        leftPanel: {
            backgroundColor: '#f2f5f8',
            flexBasis: '250px',
            maxWidth: '250px'

        },
        rightPanel: {
            overflowY: 'auto',
            flexBasis: 'calc(100% - 250px)',
            maxWidth: 'calc(100% - 250px)'
        },
        searchButton: {
            marginLeft: '-10px !important',
            '& div': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
        },
        excel: {
            background: '#71ce87',
            borderRadius: '2px',
            color: '#fff',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            padding: '5px 15px',
            '& svg': {
                width: '18px !important'
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
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center center',
            border: 'none !important',
            backgroundSize: '200px',
            padding: '200px 0 0',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666'
        },
        boldFont: {
            justifyContent: 'flex-end',
            textAlign: 'right',
            fontWeight: '600'
        },
        searchForm: {
            display: 'flex',
            alignItems: 'center',
            width: '30%'
        }
    }),
    reduxForm({
        form: 'StatisticsFilterForm',
        enableReinitialize: true
    }),
    connect((state) => {
        const typeParent = _.get(state, ['form', 'StatisticsFilterForm', 'values', 'typeParent', 'value'])
        return {
            typeParent
        }
    })
)

const StatRemainderGridList = enhance((props) => {
    const {
        classes,
        statRemainderDialog,
        listData,
        filter,
        detailData,
        getDocument,
        handleSubmit,
        filterItem,
        onSubmit,
        typeParent,
        initialValues
    } = props

    const listLoading = _.get(listData, 'listLoading')
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const summary = _.get(listData, 'summary')
    const summaryLoading = _.get(listData, 'summaryLoading')

    const sumAll = _.toNumber(_.get(summary, ['total', 'price']))
    const sumReserve = _.toNumber(_.get(summary, ['reserved', 'price']))
    const sumDefect = _.toNumber(_.get(summary, ['defected', 'price']))
    const sumAvailable = _.toNumber(_.get(summary, ['available', 'price']))

    const countAll = _.toNumber(_.get(summary, ['total', 'count']))
    const countReserve = _.toNumber(_.get(summary, ['reserved', 'count']))
    const countDefect = _.toNumber(_.get(summary, ['defected', 'count']))
    const countAvailable = _.toNumber(_.get(summary, ['available', 'count']))

    const headerStyle = {
        backgroundColor: '#fff',
        fontWeight: '600',
        color: '#666',
        padding: '0'
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
            <Col xs={3}>Товар</Col>
            <Col xs={3}>Тип товара</Col>
            <Col xs={2} style={{justifyContent: 'flex-end', textAlign: 'right'}}>{t('Всего товаров')}</Col>
            <Col xs={2} style={{justifyContent: 'flex-end', textAlign: 'right'}}>{t('Доступно')}</Col>
            <Col xs={2} style={{justifyContent: 'flex-end', textAlign: 'right'}}>{t('Цена')}</Col>
        </Row>
    )

    const list = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const productType = _.get(item, ['type', 'name'])
        const product = _.get(item, 'title')
        const measurement = _.get(item, ['measurement', 'name'])
        const defects = numberFormat(_.get(item, 'defects'), measurement)
        const price = numberFormat(_.get(item, 'price'), primaryCurrency)
        const netCost = numberFormat(_.get(item, 'netCost'), primaryCurrency)
        const balance = numberFormat(Number(_.get(item, 'balance')) + Number(_.get(item, 'defects')), measurement)
        const reserved = numberFormat(Number(_.get(item, 'reserved')), measurement)
        const available = numberFormat(Number(_.get(item, 'balance')) - Number(_.get(item, 'reserved')), measurement)

        return (
            <Link target="_blank" to={{
                pathname: ROUTES.STOCK_OUT_HISTORY_LIST_URL,
                query: {product: id, stock: _.get(filter.getParams(), 'stock')}
            }} key={id} className={classes.linkList}>
                <Row className="dottedList">
                    <Col xs={3}>{product}</Col>
                    <Col xs={3}>{productType}</Col>
                    <Col xs={2}
                         style={{justifyContent: 'flex-end', textAlign: 'right', fontWeight: '600', whiteSpace: 'nowrap'}}>
                        <ToolTip position="top" text="Всего / Забронировано / Брак">
                            {balance} / <span style={{color: '#90a4ae', margin: '0 3px'}}> {reserved} </span> / <span
                            style={{color: '#e57373', margin: '0 3px'}}> {defects} </span>
                        </ToolTip>
                    </Col>
                    <Col xs={2} className={classes.boldFont}>{available}</Col>
                    <Col xs={2} className={classes.boldFont}>
                        <ToolTip position="top" text={t('Цена доступных товаров<br/> Себестоимость: ') + netCost}>
                            {price}
                        </ToolTip>
                    </Col>
                </Row>
            </Link>
        )
    })

    const fields = (
        <div>
            <Field
                className={classes.inputFieldCustom}
                name="stock"
                component={StockMultiSearchField}
                label={t('Склад')}
                fullWidth={true}/>
            <Field
                className={classes.inputFieldCustom}
                name="typeParent"
                component={ProductTypeParentSearchField}
                label={t('Тип товара')}
                fullWidth={true}/>
            {typeParent ? <Field
                className={classes.inputFieldCustom}
                name="type"
                parentType={typeParent}
                component={ProductTypeChildSearchField}
                label={t('Подкатегория')}
                fullWidth={true}/> : null}
        </div>
    )

    const page = (
        <div className={classes.mainWrapper}>
            <Row style={{margin: '0', height: '100%'}}>
                <div className={classes.leftPanel}>
                    <StatSideMenu currentUrl={ROUTES.STATISTICS_REMAINDER_URL}/>
                </div>
                <div className={classes.rightPanel}>
                    <div className={classes.wrapper}>
                        <StatisticsFilterExcel
                            filter={filter}
                            fields={fields}
                            filterKeys={STAT_REMAINDER_FILTER_KEY}
                            handleSubmitFilterDialog={onSubmit}
                            handleGetDocument={getDocument.handleGetDocument}
                            withoutDate={true}
                            initialValues={initialValues}
                        />
                        <div className={classes.summary}>
                            {summaryLoading && <div className={classes.summaryLoader}>
                                <Loader size={0.75}/>
                            </div>}
                            <div>
                                <span>{t('Общая сумма')}</span>
                                <div>{numberFormat(sumAll, primaryCurrency)} <span className={classes.block}>({numberFormat(countAll, t('шт'))})</span></div>
                            </div>
                            <div>
                                <span>{t('Сумма забронированных')}</span>
                                <div>{numberFormat(sumReserve, primaryCurrency)} <span className={classes.block}>({numberFormat(countReserve, t('шт'))})</span></div>
                            </div>
                            <div>
                                <span>{t('Сумма забракованных')}</span>
                                <div>{numberFormat(sumDefect, primaryCurrency)} <span className={classes.block}>({numberFormat(countDefect, t('шт'))})</span></div>
                            </div>
                            <div>
                                <span>{t('Сумма доступных')}</span>
                                <div>{numberFormat(sumAvailable, primaryCurrency)} <span className={classes.block}>({numberFormat(countAvailable, t('шт'))})</span></div>
                            </div>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <form onSubmit={handleSubmit(onSubmit)} className={classes.searchForm}>
                                <Field
                                    className={classes.inputFieldCustom}
                                    name="search"
                                    component={TextField}
                                    hintText={t('Поиск')}
                                    fullWidth={true}/>
                                <IconButton
                                    className={classes.searchButton}
                                    iconStyle={iconStyle.icon}
                                    style={iconStyle.button}
                                    type="submit">
                                    <Search/>
                                </IconButton>
                            </form>
                            <Pagination filter={filter}/>
                        </div>
                        {listLoading
                            ? <div className={classes.tableWrapper}>
                                <div className={classes.loader}>
                                    <Loader size={0.75}/>
                                </div>
                            </div>
                            : <div className={classes.tableWrapper}>
                                {_.isEmpty(list) && !listLoading
                                    ? <div className={classes.emptyQuery}>
                                        <div>{t('По вашему запросу ничего не найдено')}</div>
                                    </div>
                                    : <div>
                                        {headers}
                                        {list}
                                    </div>}
                            </div>}
                    </div>
                </div>
            </Row>
        </div>
    )

    return (
        <Container>
            {page}
            <StatRemainderDialog
                loading={_.get(detailData.detailLoading)}
                detailData={detailData}
                open={statRemainderDialog.openStatRemainderDialog}
                onClose={statRemainderDialog.handleCloseStatRemainderDialog}
                filterItem={filterItem}/>
        </Container>
    )
})

StatRemainderGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    statRemainderDialog: PropTypes.shape({
        openStatRemainderDialog: PropTypes.bool.isRequired,
        handleOpenStatRemainderDialog: PropTypes.func.isRequired,
        handleCloseStatRemainderDialog: PropTypes.func.isRequired
    }).isRequired
}

export default StatRemainderGridList
