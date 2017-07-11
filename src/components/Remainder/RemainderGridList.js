import _ from 'lodash'
import React from 'react'
import sprintf from 'sprintf'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import * as ROUTES from '../../constants/routes'
import {reduxForm, Field} from 'redux-form'
import Container from '../Container'
import {Link} from 'react-router'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import ArrowDown from 'material-ui/svg-icons/navigation/arrow-drop-down-circle'
import Paper from 'material-ui/Paper'
import RemainderDetails from './RemainderDetails'
import CircularProgress from 'material-ui/CircularProgress'
import ArrowUp from 'material-ui/svg-icons/navigation/arrow-drop-up'
import Tooltip from '../ToolTip'
import numberFormat from '../../helpers/numberFormat'
import RemainderTransferDialog from './RemainderTransferDialog'
import StockSearchField from '../ReduxForm/Stock/StockSearchField'
import ProductTypeSearchField from '../ReduxForm/Product/ProductTypeSearchField'
import ProductSearchField from '../ReduxForm/Product/ProductSearchField'
import Search from 'material-ui/svg-icons/action/search'
import CloseIcon2 from '../CloseIcon2'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import MoreHortIcon from 'material-ui/svg-icons/navigation/more-horiz'

const enhance = compose(
    injectSheet({
        wrapper: {
            position: 'relative',
            padding: '0 30px',
            marginBottom: '5px',
            '& .row': {
                alignItems: 'center',
                '& div': {
                    lineHeight: '55px'
                }
            }
        },
        wrapperBold: {
            extend: 'wrapper',
            '& .row:first-child': {
                fontWeight: '600'
            }
        },
        headers: {
            padding: '20px 30px 10px',
            '& .row': {
                alignItems: 'center'
            }
        },
        productList: {
            padding: '20px 30px',
            display: 'flex',
            justifyContent: 'space-between'
        },
        products: {
            display: 'flex',
            '& > div': {
                marginRight: '60px',
                '&:last-child': {
                    margin: '0'
                }
            }
        },
        itemData: {
            textAlign: 'left',
            fontWeight: '700',
            fontSize: '17px'
        },
        filterWrapper: {
            width: '300px',
            zIndex: '99',
            position: 'absolute',
            right: '0',
            top: '0'
        },
        filterBtnWrapper: {
            position: 'absolute',
            top: '15px',
            right: '0',
            marginBottom: '0px',
            cursor: 'pointer'
        },
        filterBtn: {
            backgroundColor: '#61a8e8 !important',
            color: '#fff',
            fontWeight: '600',
            padding: '10px 10px',
            borderRadius: '3px',
            lineHeight: '12px'
        },
        filterTitle: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 30px',
            borderBottom: '1px #efefef solid',
            lineHeight: '0'
        },
        search: {
            position: 'relative',
            display: 'flex',
            maxWidth: '300px'
        },
        searchField: {
            fontSize: '13px !important'
        },
        dropDown: {
            position: 'absolute !important',
            right: '0',
            top: '5px',
            '& > div': {
                height: '45px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
        },
        loader: {
            display: 'flex',
            justifyContent: 'center'
        },
        filters: {
            backgroundColor: '#f2f5f8 !important',
            margin: '0 -28px'
        },
        filtersWrapper: {
            display: 'flex',
            padding: '20px 30px',
            alignItems: 'center',
            '& .row': {
                margin: '0rem !important'
            },
            '& > div': {
                width: '200px',
                marginRight: '20px'
            }
        },
        inputFieldCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            width: '200px !important',
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
        filterForm: {
            display: 'flex',
            justifyContent: 'space-between'
        },
        clearBtn: {
            padding: '20px 30px',
            display: 'flex',
            alignItems: 'center',
            color: '#909090',
            '& button': {
                '& > div': {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            }

        },
        sendButton: {
            '& button': {
                backgroundColor: '#275482 !important'
            }
        },
        sendButtonWrapper: {
            position: 'absolute',
            top: '10px',
            right: '0',
            marginBottom: '0px'
        }
    }),
    reduxForm({
        form: 'RemainderFilterForm',
        enableReinitialize: true
    })
)

const iconStyle = {
    icon: {
        color: '#61a8e8',
        width: 25,
        height: 25
    },
    button: {
        width: 45,
        height: 45,
        padding: 0
    }
}
const iconSearchStyle = {
    icon: {
        color: '#333',
        width: 25,
        height: 25
    },
    button: {
        width: 40,
        height: 40,
        padding: 0
    }
}
const iconClearStyle = {
    icon: {
        color: '#909090',
        width: 20,
        height: 20
    },
    button: {
        width: 30,
        height: 30,
        padding: 0
    }
}

const RemainderGridList = enhance((props) => {
    const {
        detailData,
        classes,
        filter,
        listData,
        transferDialog
    } = props
    const listLoading = _.get(listData, 'listLoading')
    const detailId = _.get(detailData, 'id')
    const listHeader = (
        <div className={classes.headers}>
            <Row>
                <Col xs={3}>Товар</Col>
                <Col xs={3}>Тип товара</Col>
                <Col xs={4}>Склад</Col>
                <Col xs={2} style={{textAlign: 'left'}}>Всего товаров</Col>
            </Row>
        </div>
    )

    const listLoader = (
                <Paper className={classes.loader}>
                    <CircularProgress size={80} thickness={5}/>
                </Paper>
        )

    const filters = (
        <Paper zDepth={1} className={classes.filters}>
            <form className={classes.filterForm}>
                <div className={classes.filtersWrapper}>
                    <Field
                     className={classes.inputFieldCustom}
                     name="stock"
                     component={StockSearchField}
                     label="Укажите нужный склад"/>
                    <Field
                        className={classes.inputFieldCustom}
                        name="productType"
                        component={ProductTypeSearchField}
                        label="Выберите тип товара"/>
                    <Field
                        className={classes.inputFieldCustom}
                        name="product"
                        component={ProductSearchField}
                        fullWidth={false}
                        label="Товара"/>
                    <Field
                        className={classes.inputFieldCustom}
                        name="product"
                        component={ProductSearchField}
                        fullWidth={false}
                        label="Товара"/>
                    <IconButton
                        iconStyle={iconSearchStyle.icon}
                        style={iconSearchStyle.button}
                        type="submit"
                    >
                        <Search/>
                    </IconButton>
                </div>
                <div className={classes.clearBtn}>
                    <IconButton
                        iconStyle={iconClearStyle.icon}
                        style={iconClearStyle.button}>
                        <CloseIcon2/>
                    </IconButton>
                    <span style={{marginTop: '-4px'}}>очистить</span>
                </div>
            </form>
        </Paper>
    )
    const list = (
            <div>
                {_.map(_.get(listData, 'data'), (item) => {
                    const id = _.get(item, 'id')
                    const product = _.get(item, 'title')
                    const balance = _.get(item, 'balance')
                    const measurement = _.get(item, ['measurement', 'name'])
                    if (id === detailId) {
                        return (
                            <Paper key={id} className={classes.wrapperBold}>
                                <Row key={id} style={{position: 'relative'}}>
                                    <Col xs={3}>{product}</Col>
                                    <Col xs={3}>N/A</Col>
                                    <Col xs={4}>Наименование склада 1</Col>
                                    <Col xs={1} className={classes.itemData}>{numberFormat(balance, measurement)}</Col>
                                    <Col xs={1} style={{textAlign: 'right'}}>
                                        <IconButton
                                            className={classes.dropDown}
                                            iconStyle={iconStyle.icon}
                                            style={iconStyle.button}
                                            onTouchTap={_.get(detailData, 'handleCloseDetail')}>
                                            <ArrowUp/>
                                        </IconButton>
                                    </Col>
                                </Row>
                                <RemainderDetails
                                    filter={filter}
                                    detailData={detailData}
                                />
                            </Paper>
                        )
                    }
                    return (
                        <Paper key={id} className={classes.wrapper}>
                            <Row key={id} style={{position: 'relative'}}>

                                    <Col xs={3}>{product}</Col>

                                <Col xs={3}>N/A</Col>
                                <Col xs={4}>Наименование склада 1</Col>
                                <Col xs={1} className={classes.itemData}>{numberFormat(balance, measurement)}</Col>
                                <Col xs={1} style={{textAlign: 'right'}}>
                                    <Link to={{
                                        pathname: sprintf(ROUTES.REMAINDER_ITEM_PATH, id),
                                        query: filter.getParams()
                                    }}>
                                    <IconButton
                                        className={classes.dropDown}
                                        iconStyle={iconStyle.icon}
                                        style={iconStyle.button}>
                                        <ArrowDown/>
                                    </IconButton>
                                    </Link>
                                </Col>
                            </Row>
                        </Paper>
                    )
                })}

            </div>
    )

    return (
        <Container>
            <SubMenu url={ROUTES.REMAINDER_LIST_URL}/>

            <div className={classes.sendButtonWrapper}>
                <Tooltip position="left" text="Добавить тип магазина">
                    <FloatingActionButton
                        mini={true}
                        className={classes.sendButton}
                        onTouchTap={transferDialog.handleOpenTransferDialog}>
                        <MoreHortIcon />
                    </FloatingActionButton>
                </Tooltip>
            </div>
            {filters}
            {listHeader}
            {listLoading ? listLoader : list }

            <RemainderTransferDialog
                open={transferDialog.openTransferDialog}
                onClose={transferDialog.handleCloseTransferDialog}/>

        </Container>
    )
})

RemainderGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    filterDialog: PropTypes.shape({
        openFilterDialog: PropTypes.bool.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    }).isRequired,
    transferDialog: PropTypes.shape({
        openTransferDialog: PropTypes.bool.isRequired,
        handleOpenTransferDialog: PropTypes.func.isRequired,
        handleCloseTransferDialog: PropTypes.func.isRequired
    }).isRequired
}

export default RemainderGridList
