import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import ClientSearchField from '../ReduxForm/Client/ClientSearchField'
import StatSideMenu from './StatSideMenu'
import SubMenu from '../SubMenu'
import Search from 'material-ui/svg-icons/action/search'
import IconButton from 'material-ui/IconButton'
import List from 'material-ui/svg-icons/action/list'
import ArrowDown from 'material-ui/svg-icons/navigation/arrow-drop-down-circle'
import Excel from 'material-ui/svg-icons/av/equalizer'
import Pagination from '../GridList/GridListNavPagination'
import StatDebtorsDialog from './StatDebtorsDialog'
import numberFormat from '../../helpers/numberFormat'
import getConfig from '../../helpers/getConfig'

export const STAT_DEBTORS_FILTER_KEY = {
    FROM_DATE: 'fromDate',
    TO_DATE: 'toDate',
    USER: 'user'
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
            '& .row': {
                marginLeft: '0',
                marginRight: '0'
            }
        },
        debtors: {
            display: 'flex',
            margin: '15px 0',
            '& > div': {
                marginRight: '60px',
                '& span': {
                    color: '#666',
                    marginBottom: '5px'
                },
                '& div': {
                    fontSize: '24px',
                    fontWeight: '600'
                }
            }
        },
        pagination: {
            display: 'flex',
            alignItems: 'center',
            marginTop: '10px',
            justifyContent: 'space-between',
            borderTop: '1px #efefef solid',
            borderBottom: '1px #efefef solid'
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
                    justifyContent: 'flex-end',
                    '&:first-child': {
                        justifyContent: 'flex-start'
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
        headers: {
            backgroundColor: '#fff',
            fontWeight: '600',
            color: '#666',
            '& > div': {
                height: '40px !important'
            }
        },
        list: {
            padding: '0 30px',
            margin: '0 -30px !important',
            '&:nth-child(even)': {
                background: '#f9f9f9'
            },
            '&:last-child:after': {
                content: '""',
                backgroundImage: 'none'
            }
        },
        expandedList: {
            extend: 'list',
            borderTop: '1px #efefef solid',
            borderBottom: '1px #efefef solid',
            '& > div': {
                fontWeight: 'bold'
            }
        },
        detail: {
            width: '100%',
            fontWeight: '400 !important',
            display: 'block !important',
            borderTop: '1px #efefef solid',
            '& .dottedList': {
                padding: '0',
                '& > div:nth-child(2)': {
                    justifyContent: 'flex-start'
                },
                '&:last-child:after': {
                    display: 'none'
                }
            }
        },
        balance: {
            paddingRight: '10px',
            fontSize: '24px!important',
            fontWeight: '600'
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
            justifyContent: 'space-between'
        },
        filter: {
            display: 'flex',
            alignItems: 'center',
            '& > div': {
                width: '300px !important',
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
        diagram: {
            marginTop: '30px'
        },
        salesSummary: {
            '& > div:first-child': {
                color: '#666'
            },
            '& > div:last-child': {
                fontSize: '24px',
                fontWeight: '600'
            }
        }
    }),
    reduxForm({
        form: 'StatDebtorsFilterForm',
        enableReinitialize: true
    }),
)

const StatDebtorsGridList = enhance((props) => {
    const {
        classes,
        filter,
        listData,
        handleSubmitFilterDialog,
        statDebtorsDialog
    } = props

    const iconStyle = {
        icon: {
            color: '#5d6474',
            width: 24,
            height: 24
        },
        button: {
            width: 40,
            height: 40,
            padding: 0
        }
    }

    const headers = (
        <Row className={classes.headers}>
            <Col xs={5}>Клиент</Col>
            <Col xs={3}>Просроченные (UZS)</Col>
            <Col xs={3}>Ожидаемые (UZS)</Col>
        </Row>
    )

    const list = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const client = _.get(item, ['client', 'name'])
        const deptSum = numberFormat(_.get(item, 'deptSum'), getConfig('PRIMARY_CURRENCY'))
        const expectSum = numberFormat(_.get(item, 'expectSum'), getConfig('PRIMARY_CURRENCY'))

        return (
            <Row key={id} className={classes.list}>
                <Col xs={5}>{client}</Col>
                <Col xs={3}>{deptSum}</Col>
                <Col xs={3}>{expectSum}</Col>
                <Col xs={1} style={{paddingRight: '0'}}>
                    <IconButton
                        disableTouchRipple={true}>
                        <ArrowDown color="#12aaeb"/>
                    </IconButton>
                </Col>
            </Row>
        )
    })

    const expanded = (
        <div className={classes.expandedList}>
            <Row>
                <Col xs={5}>Наименование клиента</Col>
                <Col xs={3}>2 000 000</Col>
                <Col xs={3}>1 000 000</Col>
                <Col xs={1} style={{paddingRight: '0'}}>
                    <IconButton
                        style={{transform: 'rotate(180deg)'}}
                        disableTouchRipple={true}>
                        <ArrowDown color="#12aaeb"/>
                    </IconButton>
                </Col>
            </Row>
            <div className={classes.detail}>
                <Row className="dottedList">
                    <Col xs={2}>№ заказа</Col>
                    <Col xs={3}>Ожидаемая дата платежа</Col>
                    <Col xs={2}>Сумма заказа (UZS)</Col>
                    <Col xs={2}>Оплачено (UZS)</Col>
                    <Col xs={2}>Долг (UZS)</Col>
                </Row>
                <Row className="dottedList">
                    <Col xs={2}>312</Col>
                    <Col xs={3}>22.06.2017</Col>
                    <Col xs={2}>30 000 000</Col>
                    <Col xs={2}>17 000 000</Col>
                    <Col xs={2}>13 000 000</Col>
                    <Col xs={1} style={{paddingRight: '0'}}>
                        <IconButton
                            onTouchTap={statDebtorsDialog.handleOpenStatDebtorsDialog}>
                            <List color="#12aaeb"/>
                        </IconButton>
                    </Col>
                </Row>
                <Row className="dottedList">
                    <Col xs={2}>312</Col>
                    <Col xs={3}>22.06.2017</Col>
                    <Col xs={2}>30 000 000</Col>
                    <Col xs={2}>17 000 000</Col>
                    <Col xs={2}>13 000 000</Col>
                    <Col xs={1} style={{paddingRight: '0'}}>
                        <IconButton
                            onTouchTap={statDebtorsDialog.handleOpenStatDebtorsDialog}>
                            <List color="#12aaeb"/>
                        </IconButton>
                    </Col>
                </Row>
            </div>
        </div>
    )

    console.log(_.get(listData, 'statData'))
    const countDebtors = _.get(listData, ['statData', 'debtors'])
    const deptSum = numberFormat(_.get(listData, ['statData', 'debSum']), getConfig('PRIMARY_CURRENCY'))
    const expectSum = numberFormat(_.get(listData, ['statData', 'expectSum']), getConfig('PRIMARY_CURRENCY'))

    const page = (
        <div className={classes.mainWrapper}>
            <Row style={{margin: '0', height: '100%'}}>
                <div className={classes.leftPanel}>
                    <StatSideMenu currentUrl={ROUTES.STATISTICS_DEBTORS_URL}/>
                </div>
                <div className={classes.rightPanel}>
                    <div className={classes.wrapper}>
                        <form className={classes.form} onSubmit={handleSubmitFilterDialog}>
                            <div className={classes.filter}>
                                <Field
                                    className={classes.inputFieldCustom}
                                    name="debtors"
                                    component={ClientSearchField}
                                    label="Задолжники"
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
                        <div className={classes.debtors}>
                            <div>
                                <span>Всего должников</span>
                                <div>{countDebtors} клиентов</div>
                            </div>
                            <div>
                                <span>Просроченные платежи</span>
                                <div>{deptSum}</div>
                            </div>
                            <div>
                                <span>Ожидаемые поступления</span>
                                <div>{expectSum}</div>
                            </div>
                        </div>
                        <div className={classes.pagination}>
                            <div><b>Отчет по задолжностям</b></div>
                            <Pagination filter={filter}/>
                        </div>
                        <div className={classes.tableWrapper}>
                            {headers}
                            {list} {list}
                            {expanded}
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
            <StatDebtorsDialog
                open={statDebtorsDialog.openStatDebtorsDialog}
                onClose={statDebtorsDialog.handleCloseStatDebtorsDialog}
            />
        </Container>
    )
})

StatDebtorsGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    statDebtorsDialog: PropTypes.shape({
        openStatDebtorsDialog: PropTypes.bool.isRequired,
        handleCloseStatDebtorsDialog: PropTypes.func.isRequired,
        handleOpenStatDebtorsDialog: PropTypes.func.isRequired
    }).isRequired
}

export default StatDebtorsGridList
