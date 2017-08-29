import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {connect} from 'react-redux'
import {reduxForm, Field} from 'redux-form'
import {StockSearchField, ProductTypeParentSearchField, ProductTypeChildSearchField} from '../ReduxForm'
import StatRemainderDialog from './StatRemainderDialog'
import StatSideMenu from './StatSideMenu'
import Search from 'material-ui/svg-icons/action/search'
import IconButton from 'material-ui/IconButton'
import List from 'material-ui/svg-icons/action/list'
import CircularProgress from 'material-ui/CircularProgress'
import Excel from 'material-ui/svg-icons/av/equalizer'
import Pagination from '../GridList/GridListNavPagination'
import numberFormat from '../../helpers/numberFormat.js'
import NotFound from '../Images/not-found.png'
import getConfig from '../../helpers/getConfig'

export const STAT_REMAINDER_FILTER_KEY = {
    STOCK: 'stock',
    TYPE: 'type',
    PRODUCT: 'product',
    DIVISION: 'division'
}
const enhance = compose(
    injectSheet({
        mainWrapper: {
            background: '#fff',
            margin: '0 -28px',
            height: 'calc(100% + 28px)',
            boxShadow: 'rgba(0, 0, 0, 0.09) 0px -1px 6px, rgba(0, 0, 0, 0.10) 0px -1px 4px'
        },
        loader: {
            width: '100%',
            height: '100%',
            background: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '999',
            display: 'flex'
        },
        wrapper: {
            minWidth: '946px',
            padding: '20px 30px',
            height: 'calc(100% - 40px)',
            overflowY: 'auto',
            overflowX: 'hidden',
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
            height: 'calc(100% - 118px)',
            '& .row': {
                '&:after': {
                    bottom: '-1px'
                },
                '& > div': {
                    display: 'flex',
                    height: '50px',
                    alignItems: 'center'
                }
            },
            '& .dottedList': {
                padding: '0',
                '&:last-child:after': {
                    content: '""',
                    backgroundImage: 'none'
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
                    margin: '0'
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
            flexBasis: 'calc(100% - 250px)',
            maxWidth: 'calc(100% - 250px)',
            overflow: 'hidden'
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
        form: 'StatRemainderFilterForm',
        enableReinitialize: true
    }),
    connect((state) => {
        const typeParent = _.get(state, ['form', 'StatRemainderFilterForm', 'values', 'typeParent', 'value'])
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
        typeParent
    } = props

    const listLoading = _.get(listData, 'listLoading')

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
            <Col xs={3}>Товар</Col>
            <Col xs={1}>Тип товара</Col>
            <Col xs={2} style={{justifyContent: 'flex-end', textAlign: 'right'}}>Всего товаров</Col>
            <Col xs={1} style={{justifyContent: 'flex-end', textAlign: 'right'}}>Брак</Col>
            <Col xs={2} style={{justifyContent: 'flex-end', textAlign: 'right'}}>Забронировано</Col>
            <Col xs={2} style={{justifyContent: 'flex-end', textAlign: 'right'}}>Цена</Col>
            <Col xs={1} style={{display: 'none'}}>|</Col>

        </Row>
    )

    const list = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const productType = _.get(item, ['type', 'name'])
        const product = _.get(item, 'title')
        const measurement = _.get(item, ['measurement', 'name'])
        const defects = numberFormat(_.get(item, 'defects'), measurement)
        const price = numberFormat(_.get(item, 'price'), getConfig('PRIMARY_CURRENCY'))
        const balance = numberFormat(Number(_.get(item, 'balance')) + Number(_.get(item, 'defects')), measurement)
        const reserved = numberFormat(Number(_.get(item, 'reserved')) + Number(_.get(item, 'reserved')), measurement)
        return (
            <Row key={id} className="dottedList">
                <Col xs={3}>
                    <div>{product}</div>
                </Col>
                <Col xs={1}>{productType}</Col>
                <Col xs={2} style={{justifyContent: 'flex-end', textAlign: 'right', fontWeight: '600', fontSize: '15px'}}>{balance}</Col>
                <Col xs={1} style={{justifyContent: 'flex-end', textAlign: 'right', fontWeight: '600', fontSize: '15px'}}>{defects}</Col>
                <Col xs={2} style={{justifyContent: 'flex-end', textAlign: 'right', fontWeight: '600', fontSize: '15px'}}>{reserved}</Col>
                <Col xs={2} style={{justifyContent: 'flex-end', textAlign: 'right'}}>{price}</Col>
                <Col xs={1} style={{justifyContent: 'flex-end', textAlign: 'right', paddingRight: '0'}}>
                    <IconButton
                        onTouchTap={() => { statRemainderDialog.handleOpenStatRemainderDialog(id) }}>
                        <List color="#12aaeb"/>
                    </IconButton>
                </Col>
            </Row>
        )
    })

    const page = (
        <div className={classes.mainWrapper}>
            <Row style={{margin: '0', height: '100%'}}>
                <div className={classes.leftPanel}>
                    <StatSideMenu currentUrl={ROUTES.STATISTICS_REMAINDER_URL}/>
                </div>
                <div className={classes.rightPanel}>
                    <div className={classes.wrapper}>
                        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                            <div className={classes.filter}>
                                <Field
                                    className={classes.inputFieldCustom}
                                    name="stock"
                                    component={StockSearchField}
                                    label="Склад"
                                    fullWidth={true}/>
                                <Field
                                    className={classes.inputFieldCustom}
                                    name="typeParent"
                                    component={ProductTypeParentSearchField}
                                    label="Тип товара"
                                    fullWidth={true}/>
                                {typeParent && <Field
                                    className={classes.inputFieldCustom}
                                    name="type"
                                    component={ProductTypeChildSearchField}
                                    label="Подкатегория"
                                    fullWidth={true}/>}
                                <IconButton
                                    className={classes.searchButton}
                                    iconStyle={iconStyle.icon}
                                    style={iconStyle.button}
                                    type="submit">
                                    <Search/>
                                </IconButton>
                            </div>
                            <a className={classes.excel}
                               onClick = {getDocument.handleGetDocument}>
                                <Excel color="#fff"/> <span>Excel</span>
                            </a>
                        </form>
                        {listLoading
                        ? <div className={classes.loader}>
                            <CircularProgress size={40} thickness={4} />
                        </div>
                        : (_.isEmpty(list) && !listLoading)
                            ? <div className={classes.emptyQuery}>
                                <div>По вашему запросу ничего не найдено</div>
                            </div>
                            : <div>
                                <Pagination filter={filter}/>

                                <div className={classes.tableWrapper}>
                                {headers}
                                {list}
                                </div>
                              </div>
                        }
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
