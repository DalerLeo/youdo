import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import LinearProgress from 'material-ui/LinearProgress'
import CircularProgress from 'material-ui/CircularProgress'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import StatSideMenu from './StatSideMenu'
import Pagination from '../GridList/GridListNavPagination'
import getConfig from '../../helpers/getConfig'
import numberFormat from '../../helpers/numberFormat.js'
import NotFound from '../Images/not-found.png'
import StatProductFilterForm from './StatProductFilterForm'

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
            height: 'calc(100% - 118px)',
            '& .row': {
                '&:after': {
                    bottom: '-1px'
                },
                '& > div': {
                    display: 'flex',
                    height: '50px',
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
                width: '100% !important',
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
            maxWidth: 'calc(100% - 250px)',
            overflow: 'hidden'
        },
        searchButton: {
            marginLeft: '-10px !important',
            marginRight: '10px !important',
            '& div': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
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
)

const StatProductGridList = enhance((props) => {
    const {
        listData,
        classes,
        filter,
        handleSubmitFilterDialog,
        getDocument
    } = props

    const listLoading = _.get(listData, 'listLoading')

    const headerStyle = {
        backgroundColor: '#fff',
        fontWeight: '600',
        color: '#666'
    }
    const headers = (
        <Row style={headerStyle} className="dottedList">
            <Col xs={3}>Товар</Col>
            <Col xs={3}>Тип товара</Col>
            <Col xs={3}>Продажи</Col>
            <Col xs={1}>Кол-во</Col>
            <Col xs={2}>Сумма</Col>
        </Row>
    )
    const list = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const type = _.get(item, 'type')
        const percent = _.get(item, 'percent')
        const count = _.get(item, 'count')
        const measurement = _.get(item, 'measurement')
        const income = numberFormat(_.get(item, 'income'), getConfig('PRIMARY_CURRENCY'))

        return (
            <Row key={id} className="dottedList">
                <Col xs={3}>{name}</Col>
                <Col xs={3}>{type}</Col>
                <Col xs={3}>
                    <LinearProgress
                        color="#58bed9"
                        mode="determinate"
                        value={percent}
                        style={{backgroundColor: '#fff', height: '10px'}}/>
                </Col>
                <Col xs={1}>{count} {measurement}</Col>
                <Col xs={2}>{income}</Col>
            </Row>
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
                        <StatProductFilterForm onSubmit={handleSubmitFilterDialog} getDocument={getDocument}/>
                        <Pagination filter={filter}/>
                        {listLoading
                        ? <div className={classes.loader}>
                            <CircularProgress size={40} thickness={4} />
                        </div>
                        : _.isEmpty(list) ? <div className={classes.emptyQuery}>
                            <div>По вашему запросу ничего не найдено</div>
                        </div>
                        : <div className={classes.tableWrapper}>
                            {headers}
                            {list}
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
    detailData: PropTypes.object
}

export default StatProductGridList
