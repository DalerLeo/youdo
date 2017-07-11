import _ from 'lodash'
import React from 'react'
import sprintf from 'sprintf'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import {Link} from 'react-router'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import ArrowDown from 'material-ui/svg-icons/navigation/arrow-drop-down-circle'
import Paper from 'material-ui/Paper'
import RemainderDetails from './RemainderDetails'
import RemainderFilterForm from './RemainderFilterForm'
import CircularProgress from 'material-ui/CircularProgress'
import ArrowUp from 'material-ui/svg-icons/navigation/arrow-drop-up'

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
            padding: '0px 30px 10px 30px',
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
        searchButton: {
            position: 'absolute !important',
            right: '-10px'
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
        }
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

const RemainderGridList = enhance((props) => {
    const {
        detailData,
        classes,
        filter,
        filterDialog,
        listData
    } = props
    const listLoading = _.get(listData, 'listLoading')
    const detailId = _.get(detailData, 'id')
    const isOpenFilter = filterDialog.openFilterDialog

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

    const list = (
            <div>
                {_.map(_.get(listData, 'data'), (item) => {
                    const id = _.get(item, 'id')
                    const name = _.get(item, 'name')
                    if (id === detailId) {
                        return (
                            <Paper key={id} className={classes.wrapperBold}>
                                <Row key={id} style={{position: 'relative'}}>
                                    <Col xs={3}>Миф морозная свежесть</Col>
                                    <Col xs={3}>{name}</Col>
                                    <Col xs={4}>Наименование склада 1</Col>
                                    <Col xs={1} className={classes.itemData}>200 кг</Col>
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

                                    <Col xs={3}>Миф морозная свежесть</Col>

                                <Col xs={3}>{name}</Col>
                                <Col xs={4}>Наименование склада 1</Col>
                                <Col xs={1} className={classes.itemData}>200 кг</Col>
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
                {isOpenFilter ? <RemainderFilterForm
                    onClose={filterDialog.handleCloseFilterDialog}
                    onSubmit={filterDialog.handleSubmitFilterDialog}/>
                : <div
                       className={classes.filterBtnWrapper}>
                        <div onClick={filterDialog.handleOpenFilterDialog} className={classes.filterBtn}>
                            Открыть фильтр
                        </div>
                    </div>
                }
            {listHeader}
            {listLoading ? listLoader : list }

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
    }).isRequired
}

export default RemainderGridList
