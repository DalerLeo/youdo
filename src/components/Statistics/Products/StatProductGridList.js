import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../../constants/routes'
import Container from '../../Container/index'
import LinearProgress from 'material-ui/LinearProgress'
import CircularProgress from 'material-ui/CircularProgress'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import StatSideMenu from '../StatSideMenu'
import Pagination from '../../GridList/GridListNavPagination/index'
import getConfig from '../../../helpers/getConfig'
import numberFormat from '../../../helpers/numberFormat.js'
import NotFound from '../../Images/not-found.png'
import StatProductFilterForm from './StatProductFilterForm'
import GridListHeader from '../../GridList/GridListHeader/index'
import Tooltip from '../../ToolTip'
import {reduxForm, Field} from 'redux-form'
import {TextField} from '../../ReduxForm/index'
import IconButton from 'material-ui/IconButton'
import Search from 'material-ui/svg-icons/action/search'

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
            margin: '0 -30px',
            '& .dottedList': {
                padding: '0 30px',
                '&:last-child:after': {
                    display: 'none'
                },
                '&:after': {
                    bottom: '-1px'
                },
                '& > div': {
                    display: 'flex',
                    height: '50px',
                    alignItems: 'center',
                    '& > div': {
                        width: '100%'
                    },
                    '&:first-child': {paddingLeft: 0},
                    '&:last-child': {paddingRight: 0}
                }
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
        }
    }),
    reduxForm({
        form: 'StatProductForm',
        enableReinitialize: true
    }),
)
const listHeader = [
    {
        sorting: false,
        name: 'name',
        title: 'Товар',
        xs: 3
    },
    {
        sorting: false,
        name: 'type',
        title: 'Тип товара',
        xs: 3
    },
    {
        sorting: true,
        name: 'percent',
        title: 'Продажи',
        xs: 2
    },
    {
        sorting: false,
        alignRight: true,
        name: 'count',
        title: 'Кол-во',
        xs: 2
    },
    {
        sorting: false,
        alignRight: true,
        name: 'income',
        title: 'Сумма',
        xs: 2
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

    const list = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const type = _.get(item, 'type')
        const percent = _.get(item, 'percent')
        const measurement = _.get(item, 'measurement')
        const count = numberFormat(_.get(item, 'count'), measurement)
        const income = numberFormat(_.get(item, 'income'), getConfig('PRIMARY_CURRENCY'))

        return (
            <Row key={id} className="dottedList">
                <Col xs={3}>{name}</Col>
                <Col xs={3}>{type}</Col>
                <Col xs={2}>
                    <Tooltip position="bottom" text={percent + '%'}>
                        <LinearProgress
                            color="#58bed9"
                            mode="determinate"
                            value={percent}
                            style={{backgroundColor: '#efefef', height: '10px'}}/>
                    </Tooltip>
                </Col>
                <Col xs={2} style={{justifyContent: 'flex-end', textAlign: 'right'}}>{count}</Col>
                <Col xs={2} style={{justifyContent: 'flex-end', textAlign: 'right'}}>{income}</Col>
            </Row>
        )
    })
    const listIds = _.map(list, item => _.toInteger(_.get(item, 'key')))
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
                        : _.isEmpty(list) ? <div className={classes.emptyQuery}>
                            <div>По вашему запросу ничего не найдено</div>
                        </div>
                        : <div className={classes.tableWrapper}>
                                <GridListHeader
                                    filter={filter}
                                    listIds={listIds}
                                    withoutCheckboxes={false}
                                    withoutRow={false}
                                    column={listHeader}
                                    listShadow={true}
                                    style={{position: 'relative'}}
                                    className={classes.header}
                                    statistics={true}
                                />
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
    detailData: PropTypes.object,
    filter: PropTypes.object.isRequired,
    getDocument: PropTypes.object.isRequired

}

export default StatProductGridList
