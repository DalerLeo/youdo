import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import LinearProgress from 'material-ui/LinearProgress'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {reduxForm, Field} from 'redux-form'
import TextField from '../ReduxForm/Basic/TextField'
import DateToDateField from '../ReduxForm/Basic/DateToDateField'
import StatSideMenu from './StatSideMenu'
import SubMenu from '../SubMenu'
import Search from 'material-ui/svg-icons/action/search'
import IconButton from 'material-ui/IconButton'
import List from 'material-ui/svg-icons/action/list'
import Excel from 'material-ui/svg-icons/av/equalizer'
import Pagination from '../GridList/GridListNavPagination'
import StatMarketDialog from './StatMarketDialog'
import numberFormat from '../../helpers/numberFormat'
import getConfig from '../../helpers/getConfig'

export const STAT_MARKET_FILTER_KEY = {
    SEARCH: 'search',
    TO_DATE: 'toDate',
    FROM_DATE: 'fromDate'
}
const enhance = compose(
    injectSheet({
        mainWrapper: {
            background: '#fff',
            margin: '0 -28px',
            height: 'calc(100% - 32px)',
            boxShadow: 'rgba(0, 0, 0, 0.09) 0px -1px 6px, rgba(0, 0, 0, 0.10) 0px -1px 4px'
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
                    height: '50px',
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
        form: 'StatMarketFilterForm',
        enableReinitialize: true
    }),
)

const StatMarketGridList = enhance((props) => {
    const {
        listData,
        detailData,
        classes,
        filter,
        filterItem,
        statMarketDialog,
        handleSubmitFilterDialog
    } = props

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
            <Col xs={3}>Магазины</Col>
            <Col xs={6}>Продажи</Col>
            <Col xs={2} style={{justifyContent: 'flex-end'}}>Сумма</Col>
        </Row>
    )

    const list = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const percent = _.get(item, 'percent')
        const income = numberFormat(_.get(item, 'income'), getConfig('PRIMARY_CURRENCY'))

        return (
            <Row key={id} className="dottedList">
                <Col xs={3}>
                    <img src="http://www.shop-script.su/images/internet-biznes/market-store-icon.jpg" alt=""/>
                    <span>{name}</span>
                </Col>
                <Col xs={6}>
                    <LinearProgress
                        color="#58bed9"
                        mode="determinate"
                        value={percent}
                        style={{backgroundColor: '#fff', height: '10px'}}/>
                </Col>
                <Col xs={2} style={{justifyContent: 'flex-end'}}>{income}</Col>
                <Col xs={1} style={{justifyContent: 'flex-end', paddingRight: '0'}}>
                    <IconButton
                        onTouchTap={() => { statMarketDialog.handleOpenStatMarketDialog(id) }}>
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
                <StatSideMenu currentUrl={ROUTES.STATISTICS_MARKET_URL} />
            </div>
            <div className={classes.rightPanel}>
                <div className={classes.wrapper}>
                    <form className={classes.form} onSubmit={ handleSubmitFilterDialog }>
                        <div className={classes.filter}>
                            <Field
                                className={classes.inputFieldCustom}
                                name="date"
                                component={DateToDateField}
                                label="Диапазон дат"
                                fullWidth={true}/>
                            <Field
                                className={classes.inputFieldCustom}
                                name="search"
                                component={TextField}
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
                    <div className={classes.tableWrapper}>
                        {headers}
                        {list}
                    </div>
                </div>
            </div>
        </Row>
    </div>
    )

    return (
        <Container>
            <SubMenu url={ROUTES.STATISTICS_LIST_URL}/>
            {page}
            <StatMarketDialog
                detailData={detailData}
                open={statMarketDialog.openStatMarketDialog}
                onClose={statMarketDialog.handleCloseStatMarketDialog}
                filter={filterItem}
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
