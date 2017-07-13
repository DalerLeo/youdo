import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import Paper from 'material-ui/Paper'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import UsersSearchField from '../ReduxForm/Users/UsersSearchField'
import DateToDateField from '../ReduxForm/Basic/DateToDateField'
import StatAgentDialog from './StatAgentDialog'
import StatSideMenu from './StatSideMenu'
import SubMenu from '../SubMenu'
import Person from '../Images/person.png'
import Search from 'material-ui/svg-icons/action/search'
import IconButton from 'material-ui/IconButton'
import List from 'material-ui/svg-icons/action/list'
import Excel from 'material-ui/svg-icons/av/equalizer'
import LinearProgress from 'material-ui/LinearProgress'
import Pagination from '../GridList/GridListNavPagination'
import numberFormat from '../../helpers/numberFormat.js'
import getConfig from '../../helpers/getConfig'

export const STAT_AGENT_FILTER_KEY = {
    FROM_DATE: 'fromDate',
    TO_DATE: 'toDate',
    USER: 'user'
}

const enhance = compose(
    injectSheet({
        mainWrapper: {
            margin: '0 -28px',
            height: 'calc(100% - 32px)',
            boxShadow: 'rgba(0, 0, 0, 0.09) 0px -1px 6px, rgba(0, 0, 0, 0.10) 0px -1px 4px !important'
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
                flexBasis: '35px',
                height: '35px',
                padding: '0!important',
                width: '35px',
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
                width: '170px!important',
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
        }
    }),
    reduxForm({
        form: 'StatAgentFilterForm',
        enableReinitialize: true
    }),
)

const StatAgentGridList = enhance((props) => {
    const {
        classes,
        statAgentDialog,
        listData,
        filter,
        handleSubmitFilterDialog,
        detailData
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
                    <Col xs={3}>Агенты</Col>
                    <Col xs={6}>Продажи</Col>
                    <Col xs={2}>Сумма</Col>
                </Row>
            </div>
        </div>

    )

    const list = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const income = numberFormat(_.get(item, 'income'), getConfig('PRIMARY_CURRENCY'))

        return (
            <div key={id}>
                <div className={classes.tableWrapper}>
                    <Row className="dottedList">
                        <Col xs={3}>
                            <div className="personImage"><img src={Person}/></div>
                            <div>{name}</div>
                        </Col>
                        <Col xs={6}>
                            <LinearProgress
                                color="#58bed9"
                                mode="determinate"
                                value={50}
                                style={{backgroundColor: '#fff', height: '10px'}}/>
                        </Col>
                        <Col xs={2}>{income}</Col>
                        <Col xs={1} style={{justifyContent: 'flex-end', paddingRight: '0'}}>
                            <IconButton
                                onTouchTap={() => { statAgentDialog.handleOpenStatAgentDialog(id) }}>
                                <List color="#12aaeb"/>
                            </IconButton>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    })

    const page = (
            <Paper zDepth={1} className={classes.mainWrapper}>
                <Row style={{margin: '0', height: '100%'}}>
                    <div className={classes.leftPanel}>
                        <StatSideMenu currentUrl={ROUTES.STATISTICS_AGENT_URL}/>
                    </div>
                    <div className={classes.rightPanel}>
                        <div className={classes.wrapper}>
                            <form className={classes.form} onSubmit={handleSubmitFilterDialog}>
                                <div className={classes.filter}>
                                    <Field
                                        className={classes.inputFieldCustom}
                                        name="date"
                                        component={DateToDateField}
                                        label="Диапазон дат"
                                        fullWidth={true}/>
                                    <Field
                                        className={classes.inputFieldCustom}
                                        name="user"
                                        component={UsersSearchField}
                                        label="Агенты"
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
            <StatAgentDialog
                detailData={detailData}
                open={statAgentDialog.openStatAgentDialog}
                onClose={statAgentDialog.handleCloseStatAgentDialog}
                filter={filter}/>
        </Container>
    )
})

StatAgentGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    statAgentDialog: PropTypes.shape({
        openStatAgentDialog: PropTypes.bool.isRequired,
        handleOpenStatAgentDialog: PropTypes.func.isRequired,
        handleCloseStatAgentDialog: PropTypes.func.isRequired
    }).isRequired
}

export default StatAgentGridList
