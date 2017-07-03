import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import RemainderCreateDialog from './RemainderCreateDialog'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import Arrow from 'material-ui/svg-icons/navigation/arrow-drop-down-circle'
import Paper from 'material-ui/Paper'
import RemainderDetails from './RemainderDetails'
import RemainderFilterForm from './RemainderFilterForm'

const enhance = compose(
    injectSheet({
        wrapper: {
            padding: '15px 30px',
            '& .row': {
                alignItems: 'center',
                '& div': {
                    lineHeight: '0px'
                }
            }
        },
        headers: {
            padding: '0px 30px 10px 30px',
            '& .row': {
                alignItems: 'center'
            }
        },
        addButton: {
            '& button': {
                backgroundColor: '#275482 !important'
            }
        },
        addButtonWrapper: {
            position: 'absolute',
            top: '10px',
            right: '0',
            marginBottom: '0px'
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
            marginBottom: '0px'
        },
        filterBtn: {
            backgroundColor: '#12aaeb !important',
            color: '#fff',
            fontWeight: '600',
            padding: '7px 7px',
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
        }
    })
)

const iconStyle = {
    icon: {
        color: '#129fdd',
        width: 25,
        height: 25
    },
    button: {
        width: 25,
        height: 25,
        padding: 0
    }
}

const RemainderGridList = enhance((props) => {
    const {
        createDialog,
        updateDialog,
        confirmDialog,
        detailData,
        classes
    } = props
    const filterBtn = (
        <div className={classes.filterBtnWrapper}>
            <div className={classes.filterBtn}
            > Открыть фильтр</div>
        </div>
    )

    const remainderFilterDialog = (
        <RemainderFilterForm/>
    )

    const list = (
        <div>
            <div className={classes.headers}>
                <Row>
                    <Col xs={3}>Товар</Col>
                    <Col xs={3}>Тип товара</Col>
                    <Col xs={4}>Склад</Col>
                    <Col xs={1} style={{textAlign: 'left'}}>Всего товаров</Col>
                </Row>
            </div>
            <Paper zDepth={1} >
                <div className={classes.wrapper}>
                    <Row>
                        <Col xs={3}>Миф морозная свежесть</Col>
                        <Col xs={3}>Стиралный порошок</Col>
                        <Col xs={4}>Наименование склада 1</Col>
                        <Col xs={1} className={classes.itemData}>200 кг</Col>
                        <Col xs={1} style={{textAlign: 'right'}}>
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}>
                                <Arrow/>
                            </IconButton>
                        </Col>
                    </Row>
                </div>
                <RemainderDetails/>
            </Paper>
        </div>
    )

    return (
        <Container>
            <SubMenu url={ROUTES.REMAINDER_LIST_URL}/>
            {filterBtn}
            {remainderFilterDialog}
            {list}

            <RemainderCreateDialog
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
            />

            <RemainderCreateDialog
                isUpdate={true}
                initialValues={updateDialog.initialValues}
                open={updateDialog.openUpdateDialog}
                loading={updateDialog.updateLoading}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
            />

            {detailData.data && <ConfirmDialog
                type="delete"
                message={_.get(detailData, ['data', 'name'])}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSendConfirmDialog}
                open={confirmDialog.openConfirmDialog}
            />}
        </Container>
    )
})

RemainderGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    createDialog: PropTypes.shape({
        createLoading: PropTypes.bool.isRequired,
        openCreateDialog: PropTypes.bool.isRequired,
        handleOpenCreateDialog: PropTypes.func.isRequired,
        handleCloseCreateDialog: PropTypes.func.isRequired,
        handleSubmitCreateDialog: PropTypes.func.isRequired
    }).isRequired,
    confirmDialog: PropTypes.shape({
        openConfirmDialog: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSendConfirmDialog: PropTypes.func.isRequired
    }).isRequired,
    updateDialog: PropTypes.shape({
        updateLoading: PropTypes.bool.isRequired,
        openUpdateDialog: PropTypes.bool.isRequired,
        handleOpenUpdateDialog: PropTypes.func.isRequired,
        handleCloseUpdateDialog: PropTypes.func.isRequired,
        handleSubmitUpdateDialog: PropTypes.func.isRequired
    }).isRequired,
    actionsDialog: PropTypes.shape({
        handleActionEdit: PropTypes.func.isRequired,
        handleActionDelete: PropTypes.func.isRequired
    }).isRequired
}

export default RemainderGridList
