import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row} from 'react-flexbox-grid'
import * as ROUTES from '../../../constants/routes'
import Container from '../../Container/index'
import CircularProgress from 'material-ui/CircularProgress'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import StatSideMenu from '../StatSideMenu'
import Pagination from '../../GridList/GridListNavPagination/index'
import getConfig from '../../../helpers/getConfig'
import numberFormat from '../../../helpers/numberFormat.js'
import NotFound from '../../Images/not-found.png'
import StatProductFilterForm from './StatProductFilterForm'
import ordering from '../../../helpers/ordering'
import {reduxForm, Field} from 'redux-form'
import {TextField} from '../../ReduxForm/index'
import IconButton from 'material-ui/IconButton'
import Search from 'material-ui/svg-icons/action/search'
import ArrowUpIcon from 'material-ui/svg-icons/navigation/arrow-upward'
import ArrowDownIcon from 'material-ui/svg-icons/navigation/arrow-downward'

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
        mainWrapper: {
            background: '#fff',
            margin: '0 -28px',
            height: 'calc(100% + 28px)',
            boxShadow: 'rgba(0, 0, 0, 0.09) 0px -1px 6px, rgba(0, 0, 0, 0.10) 0px -1px 4px'
        },
        wrapper: {
            height: 'calc(100% - 40px)',
            overflowX: 'hidden',
            overflowY: 'auto',
            padding: '20px 30px',
            '& > div:nth-child(2)': {
                marginTop: '10px',
                borderTop: '1px #efefef solid'
            },
            '& .row': {
                margin: '0 !important'
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
        leftPanel: {
            backgroundColor: '#f2f5f8',
            flexBasis: '250px',
            maxWidth: '250px'

        },
        rightPanel: {
            flexBasis: 'calc(100% - 250px)',
            maxWidth: 'calc(100% - 250px)',
            overflow: 'hidden'
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
        form: {
            display: 'flex',
            alignItems: 'center',
            width: '30%'
        },
        tableRow: {
            '& td:nth-child(odd)': {
                borderRight: '1px #efefef solid',
                textAlign: 'right'
            },
            '& td:nth-child(1)': {
                textAlign: 'left'
            },
            '&:nth-child(odd)': {
                backgroundColor: '#f9f9f9'
            }
        },
        leftTable: {
            display: 'table',
            marginLeft: '-30px',
            width: '100%',
            '& > div': {
                '&:nth-child(even)': {
                    backgroundColor: '#f9f9f9'
                },
                display: 'table-row',
                height: '40px',
                '&:nth-child(2)': {
                    height: '39px'
                },
                '&:first-child': {
                    backgroundColor: 'white',
                    height: '81px',
                    verticalAlign: 'bottom',
                    '& span': {
                        verticalAlign: 'bottom',
                        padding: '15px 30px',
                        borderTop: '1px #efefef solid',
                        borderBottom: '1px #efefef solid'
                    }
                },
                '& span': {
                    display: 'table-cell',
                    verticalAlign: 'middle',
                    padding: '0 30px'
                }
            }
        },
        tableWrapper: {
            display: 'flex',
            margin: '0 -30px',
            paddingLeft: '30px',
            '& > div:first-child': {
                zIndex: '20',
                boxShadow: '5px 0 8px -3px #CCC',
                width: '350px'
            },
            '& > div:last-child': {
                width: 'calc(100% - 350px)',
                overflowX: 'auto',
                overflowY: 'hidden'
            }
        },
        tableBody: {
            '& > tr:first-child > td:first-child': {
                minWidth: '220px'
            },
            '& tr:first-child > td:first-child': {
                verticalAlign: 'bottom',
                padding: '0 30px 15px'
            }
        },
        mainTable: {
            width: '100%',
            minWidth: '950px',
            color: '#666',
            borderCollapse: 'collapse',
            '& tr, td': {
                height: '40px'
            },
            '& td': {
                padding: '0 20px',
                minWidth: '140px'
            }
        },
        title: {
            fontWeight: '600',
            '& tr, td': {
                border: '1px #efefef solid'
            }
        },
        subTitle: {
            extend: 'title',
            '& td:nth-child(odd)': {
                borderRight: 'none'
            },
            '& td:nth-child(even)': {
                borderLeft: 'none',
                textAlign: 'right'
            }
        },
        icon: {
            height: '15px !important'
        }
    }),
    reduxForm({
        form: 'StatProductForm',
        enableReinitialize: true
    }),
)
const listHeader = [
    {
        sorting: true,
        name: 'salesCount',
        title: 'Кол-во'
    },
    {
        sorting: true,
        name: 'salesIncome',
        title: 'Стоимость'
    },
    {
        sorting: true,
        name: 'orderReturnsCount',
        title: 'Кол-во'
    },
    {
        sorting: true,
        name: 'orderReturnsSum',
        title: 'Стоимость'
    },
    {
        sorting: true,
        name: 'actualSalesCount',
        title: 'Кол-во'
    },
    {
        sorting: true,
        name: 'actualSalesSum',
        title: 'Стоимость'
    }
]
const StatProductGridList = enhance((props) => {
    const {
        listData,
        classes,
        filter,
        handleSubmitFilterDialog,
        getDocument,
        filterForm,
        handleSubmit,
        searchSubmit
    } = props

    const iconStyle = {
        icon: {
            color: '#5d6474',
            width: 22,
            height: 22
        },
        button: {
            minWidth: 40,
            width: 40,
            height: 40,
            padding: 0
        }
    }
    const listLoading = _.get(listData, 'listLoading')
    const currency = getConfig('PRIMARY_CURRENCY')
    const tableLeft = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name') || 'No'
        return (
            <div key={id}><span>{name}</span></div>
        )
    })
    const tableList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const type = _.get(item, ['type', 'name'])
        const measurement = _.get(item, ['measurement', 'name'])
        const actualSalesPrice = numberFormat(_.get(item, 'actualSalesSum'), currency)
        const actualSalesCount = numberFormat(_.get(item, 'actualSalesCount'), measurement)
        const returnPrice = numberFormat(_.get(item, 'orderReturnsCount'), measurement)
        const returnCount = numberFormat(_.get(item, 'orderReturnsSum'), currency)
        const salesPrice = numberFormat(_.get(item, 'salesIncome'), currency)
        const salesCount = numberFormat(_.get(item, 'salesCount'), measurement)

        return (
            <tr key={id} className={classes.tableRow}>
                <td>{type}</td>
                <td>{salesCount}</td>
                <td>{salesPrice}</td>
                <td>{returnCount}</td>
                <td>{returnPrice}</td>
                <td>{actualSalesCount}</td>
                <td>{actualSalesPrice}</td>

            </tr>
        )
    })
    const page = (
        <div className={classes.mainWrapper}>
            <Row style={{margin: '0', height: '100%'}}>
                <div className={classes.leftPanel}>
                    <StatSideMenu currentUrl={ROUTES.STATISTICS_PRODUCT_URL}/>
                </div>
                <div className={classes.rightPanel}>
                    <div className={classes.wrapper}>
                        <StatProductFilterForm onSubmit={handleSubmitFilterDialog} getDocument={getDocument} initialValues={filterForm.initialValues}/>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <form className={classes.form} onSubmit={handleSubmit(searchSubmit)}>
                                <Field
                                    className={classes.inputFieldCustom}
                                    name="search"
                                    component={TextField}
                                    label="Поиск"
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
                        ? <div className={classes.loader}>
                            <CircularProgress size={40} thickness={4} />
                        </div>
                        : _.isEmpty(tableList) ? <div className={classes.emptyQuery}>
                            <div>По вашему запросу ничего не найдено</div>
                        </div>
                        : <div className={classes.tableWrapper}>
                                    <div className={classes.leftTable}>
                                        <div><span>Товар</span></div>
                                        {tableLeft}
                                    </div>
                                    <div>
                                        <table className={classes.mainTable}>
                                            <tbody className={classes.tableBody}>
                                                <tr className={classes.title}>
                                                    <td rowSpan={2}>Тип</td>
                                                    <td colSpan={2}>Продажа</td>
                                                    <td colSpan={2}>Возврат</td>
                                                    <td colSpan={2}>Фактическая продажа</td>
                                                </tr>
                                                <tr className={classes.subTitle}>
                                                    {_.map(listHeader, (header) => {
                                                        const sortingType = filter.getSortingType(header.name)
                                                        const icon = _.isNil(sortingType) ? null : sortingType ? <ArrowUpIcon className={classes.icon}/> : <ArrowDownIcon className={classes.icon}/>
                                                        if (!header.sorting) {
                                                            return <td>{header.title}</td>
                                                        }
                                                        return <td style={{cursor: 'pointer'}} onClick={ () => ordering(filter, header.name)}>{header.title}{icon}</td>
                                                    })}
                                                </tr>
                                                {tableList}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>}
                    </div>
                </div>
            </Row>
        </div>
    )

    return (
        <Container>
            {page}
        </Container>
    )
})

StatProductGridList.propTypes = {
    listData: PropTypes.object,
    detailData: PropTypes.object,
    filter: PropTypes.object.isRequired,
    getDocument: PropTypes.object.isRequired

}

export default StatProductGridList
