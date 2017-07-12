import PropTypes from 'prop-types'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import Paper from 'material-ui/Paper'
import LinearProgress from 'material-ui/LinearProgress'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {reduxForm, Field} from 'redux-form'
import MarketSearchField from '../ReduxForm/Shop/MarketSearchField'
import DateToDateField from '../ReduxForm/Basic/DateToDateField'
import StatSideMenu from './StatSideMenu'
import SubMenu from '../SubMenu'
import Search from 'material-ui/svg-icons/action/search'
import IconButton from 'material-ui/IconButton'
import List from 'material-ui/svg-icons/action/list'
import Excel from 'material-ui/svg-icons/av/equalizer'
import Pagination from '../GridList/GridListNavPagination'
import StatMarketDialog from './StatMarketDialog'

export const STAT_MARKET_FILTER_KEY = {
    PRODUCT: 'product',
    PRODUCT_TYPE: 'productType',
    TO_DATE: 'toDate',
    FROM_DATE: 'fromDate'
}
const enhance = compose(
    injectSheet({
        mainWrapper: {
            margin: '0 -28px',
            height: 'calc(100% - 32px)'
        },
        wrapper: {
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
                    lineHeight: '50px',
                    alignItems: 'center',
                    '& img': {
                        width: '35px',
                        height: '35px',
                        borderRadius: '4px',
                        marginRight: '10px'
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
        form: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        filter: {
            display: 'flex',
            alignItems: 'center',
            '& > div': {
                width: '170px!important',
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
                        content: '""',
                        background: 'none'
                    }
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
            maxWidth: 'calc(100% - 250px)'
        },
        searchButton: {
            marginLeft: '-10px !important',
            '& div': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
        }
    }),
    reduxForm({
        form: 'StatProductFilterForm',
        enableReinitialize: true
    }),
)

const StatMarketGridList = enhance((props) => {
    const {
        classes,
        filter,
        statMarketDialog
    } = props

    const headerStyle = {
        backgroundColor: '#fff',
        fontWeight: '600'
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
        <div style={headerStyle}>
            <div className={classes.tableWrapper}>
                <Row>
                    <Col xs={3}>Магазины</Col>
                    <Col xs={6}>Продажи</Col>
                    <Col xs={2} style={{textAlign: 'right'}}>Сумма</Col>
                </Row>
            </div>
        </div>

    )
    const list = (
        <div className={classes.tableWrapper}>
            <Row className="dottedList">
                <Col xs={3}>
                    <img src="http://www.shop-script.su/images/internet-biznes/market-store-icon.jpg" alt=""/>
                    <span>Наименование магазина</span>
                </Col>
                <Col xs={6}>
                    <LinearProgress
                        color="#58bed9"
                        mode="determinate"
                        value={87}
                        style={{backgroundColor: '#fff', height: '10px'}}/>
                </Col>
                <Col xs={2} style={{textAlign: 'right'}}>100 000 000 USZ</Col>
                <Col xs={1} style={{justifyContent: 'flex-end', paddingRight: '0'}}>
                    <IconButton
                        onTouchTap={statMarketDialog.handleOpenStatMarketDialog}>
                        <List color="#12aaeb"/>
                    </IconButton>
                </Col>
            </Row>
        </div>
    )

    const page = (
    <Paper zDepth={1} className={classes.mainWrapper}>
        <Row style={{margin: '0', height: '100%'}}>
            <div className={classes.leftPanel}>
                <StatSideMenu currentUrl={ROUTES.STATISTICS_MARKET_URL} />
            </div>
            <div className={classes.rightPanel}>
                <div className={classes.wrapper}>
                    <form className={classes.form}>
                        <div className={classes.filter}>
                            <Field
                                className={classes.inputFieldCustom}
                                name="date"
                                component={DateToDateField}
                                label="Диапазон дат"
                                fullWidth={true}/>
                            <Field
                                className={classes.inputFieldCustom}
                                name="productType"
                                component={MarketSearchField}
                                label="Магазин"
                                fullWidth={true}/>

                            <IconButton
                                className={classes.searchButton}
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                type="submit">
                                <Search/>
                            </IconButton>
                        </div>
                        <a className={classes.excel}>
                            <Excel color="#fff"/> <span>Excel</span>
                        </a>
                    </form>
                    <Pagination filter={filter}/>
                    {headers}
                    {list}
                </div>
            </div>
        </Row>
    </Paper>
    )

    return (
        <Container>
            <SubMenu url={ROUTES.STATISTICS_LIST_URL}/>
            {page}
            <StatMarketDialog
                open={statMarketDialog.openStatMarketDialog}
                onClose={statMarketDialog.handleCloseStatMarketDialog}
                filter={filter}
            />
        </Container>
    )
})

StatMarketGridList.propTypes = {
    listData: PropTypes.object,
    detailData: PropTypes.object,
    statMarketDialog: PropTypes.shape({
        openStatMarketDialog: PropTypes.bool.isRequired,
        handleOpenStatMarketDialog: PropTypes.func.isRequired,
        handleCloseStatMarketDialog: PropTypes.func.isRequired
    }).isRequired
}

export default StatMarketGridList
