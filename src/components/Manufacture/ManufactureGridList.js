import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import ManufactureAddStaffDialog from './ManufactureAddStaffDialog'
import ManufactureShowBom from './ManufactureShowBom'
import ManufactureAddProductDialog from './ManufactureAddProductDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Edit from 'material-ui/svg-icons/image/edit'
import CircularProgress from 'material-ui/CircularProgress'
import ManufactureTab from './ManufactureTab'
import Person from '../Images/person.png'
import ConfirmDialog from '../ConfirmDialog'
import Glue from '../Images/glue.png'
import Cylindrical from '../Images/cylindrical.png'
import Press from '../Images/press.png'
import Cut from '../Images/cut.png'
import Badge from '../Images/badge.png'

const enhance = compose(
    injectSheet({
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
        productionMainRow: {
            margin: '0 -28px',
            height: 'calc(100vh - 60px)',
            overflowY: 'auto'
        },
        productionLeftSide: {
            background: '#fcfcfc',
            borderRight: '1px solid #efefef',
            padding: '0'
        },
        productionRightSide: {
            background: '#fff',
            padding: '0 30px',
            '& .row:first-child img': {
                width: '18px',
                height: '18px',
                marginRight: '10px'
            }
        },
        productionUl: {
            listStyle: 'none',
            margin: '0',
            padding: '0',
            '& li:last-child': {
                border: 'none'
            }
        },
        productionStaffUl: {
            extend: 'productionUl',
            '& .dottedList': {
                margin: '0',
                padding: '10px 0 10px 0',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                '& div:first-child': {
                    width: '30px',
                    height: '30px',
                    display: 'inline-block',
                    borderRadius: '50%',
                    marginRight: '10px',
                    overflow: 'hidden'
                },
                '& div:first-child img': {
                    width: '30px'
                },
                '& div:last-child': {
                    display: 'inline-block',
                    verticalAlign: 'top'
                },
                '& div:last-child span': {
                    color: '#666'
                }
            },
            '& .dottedList:last-child:after': {
                content: '""',
                backgroundImage: 'none'
            }
        },
        productionTypeLi: {
            margin: '0',
            padding: '20px 30px',
            borderBottom: '1px solid #efefef',
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            cursor: 'pointer',
            '& img': {
                width: '24px',
                height: '24px',
                marginRight: '10px'
            }
        },
        productionH2: {
            fontSize: '13px',
            fontWeight: '800',
            margin: '0',
            borderBottom: '1px solid #efefef',
            padding: '20px 30px'
        },
        productionRightH2: {
            fontSize: '13px',
            fontWeight: '800',
            margin: '0',
            borderBottom: '1px solid #efefef',
            padding: '20px 0',
            display: 'flex',
            alignItems: 'center'
        },

        productionStaffGroupTitle: {
            margin: '0',
            '& .dottedList': {
                padding: '20px 0 10px',
                display: 'flex',
                justifyContent: 'space-between',
                '& p': {
                    margin: '0',
                    fontWeight: '600 !important'
                },
                '& span': {
                    color: '#999',
                    fontSize: '12px !important'
                }
            }
        },
        productList: {
            width: '100%',
            '& li': {
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '10px 0'
            },
            '& .dottedList:last-child:after': {
                content: '""',
                backgroundImage: 'none'
            },
            '& .dottedList:after': {
                left: '0.7em',
                right: '0.7em'
            }
        },
        deleteHideIco: {
            display: 'none',
            position: 'absolute',
            right: '0'
        },
        productionEquipment: {
            padding: '20px 0',
            borderBottom: '1px solid #efefef'
        },
        productionEquipmentElement: {
            background: '#f2f5f8',
            textAlign: 'center',
            padding: '20px 30px'
        },
        workerWrap: {
            display: 'flex',
            alignItems: 'center',
            padding: '10px 0',
            position: 'relative',
            '&:hover > div:last-child': {
                display: 'flex'
            }
        },
        workerAvatar: {
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            marginRight: '10px',
            overflow: 'hidden',
            '& img': {
                width: '100%',
                height: '100%'
            }
        },
        workerPosition: {
            '& span': {
                display: 'block',
                color: '#666',
                fontSize: '11px !important'
            }
        },
        tabNav: {
            padding: '15px 0',
            borderBottom: '1px #f2f5f8 solid',
            '& a': {
                margin: '-15px 0',
                padding: '15px 0',
                marginRight: '40px',
                color: '#9b9b9b',
                '&.active': {
                    color: '#12aaeb',
                    borderBottom: '1px solid'
                }
            }
        },
        tabContent: {
            '& .row:first-child': {
                fontWeight: '600'
            },
            '& .row': {
                '& > div:first-child': {
                    textAlign: 'left'
                }
            }
        },
        tabWrapper: {
            overflowY: 'auto',
            overflowX: 'hidden',
            height: 'calc(100vh - 120px)'
        },
        tableHeaderPN: {
            width: '100%',
            display: 'flex',
            borderBottom: '1px solid #efefef',
            height: '60px',
            alignItems: 'center'
        }
    })
)
const iconStyle = {
    icon: {
        color: '#999',
        width: 16,
        height: 16
    },
    button: {
        width: 24,
        height: 24,
        padding: 0
    }
}

const ManufactureGridList = enhance((props) => {
    const {
        listData,
        detailData,
        addStaff,
        showBom,
        addProductDialog,
        classes,
        shiftData,
        staffData,
        userShift,
        equipmentData,
        productData,
        confirmDialog,
        tabData,
        productFilterDialog,
        updateProductDialog
    } = props

    const detailId = _.get(detailData, 'id')
    const glue = 3
    const cylindrical = 4
    const press = 6
    const cut = 7
    const badge = 8
    const manufactureList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        return (
            <li key={id} className={classes.productionTypeLi}
                onTouchTap={() => {
                    listData.handleClickItem(id)
                }}
                style={ detailId === id ? {backgroundColor: 'white'} : {}}>
                { id === glue ? <img src={Glue}/> : (
                    id === cylindrical ? <img src={Cylindrical}/> : (
                        id === press ? <img src={Press}/> : (
                            id === cut ? <img src={Cut}/> : (
                                id === badge ? <img src={Badge}/> : '')
                        )
                    )
                )}

                {name}
            </li>
        )
    })
    const shiftList = _.map(_.get(shiftData, 'shiftList'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const beginTime = _.get(item, 'beginTime')
        const endTime = _.get(item, 'endTime')

        return (
            <div key={id}>
                <div className={classes.productionStaffGroupTitle}>
                    <div className="dottedList">
                        <p>{name}</p>
                        <span>График: {beginTime} - {endTime}</span>
                    </div>
                </div>
                {
                    _.map(_.get(userShift, 'userShiftList'), (item2) => {
                        const itemId = _.get(item2, 'id')
                        const shift = _.get(item2, 'shift')
                        const user = _.get(item2, ['user', 'firstName']) + _.get(item2, ['user', 'secondName'])
                        const position = _.get(item2, ['user', 'position'])
                        if (id === shift) {
                            return (
                                <div key={itemId} className={classes.workerWrap}>
                                    <div className={classes.workerAvatar}>
                                        <img src={Person}/>
                                    </div>
                                    <div className={classes.workerPosition}>
                                        {user}<span>worker {position}</span>
                                    </div>
                                    <div className={classes.deleteHideIco}>
                                        <IconButton
                                            iconStyle={iconStyle.icon}
                                            disableTouchRipple={true}
                                            style={iconStyle.button}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </div>
                                </div>
                            )
                        }
                        return ''
                    })
                }
            </div>
        )
    })

    const equipList = _.map(_.get(equipmentData, 'equipmentList'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')

        return (
            <Col xs={4} key={id}>
                <div className={classes.productionEquipmentElement}>
                    {name}
                </div>
            </Col>
        )
    })

    const iconButton = (
        <IconButton style={{padding: '0 12px', height: 'auto'}}>
            <MoreVertIcon />
        </IconButton>
    )
    const shiftListExp = _.get(shiftData, 'shiftList')
    const shiftId = _.get(shiftData, 'shiftId')
    const shift = _.find(shiftListExp, (o) => {
        return _.toInteger(o.id) === _.toInteger(shiftId)
    })

    const currentUserShift = _.get(_.find(_.get(userShift, 'userShiftList'), {'id': _.get(userShift, 'userShiftId')}), ['user', 'firstName']) + ' ' +
        _.get(_.find(_.get(userShift, 'userShiftList'), {'id': _.get(userShift, 'userShiftId')}), ['user', 'secondName'])
    const MINUS_ONE = -1

    const productList = _.map(_.get(productData, 'productList'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const type = _.get(item, ['type', 'name']) || 'N/A'
        const brand = _.get(item, ['brand', 'name']) || 'N/A'
        const measurement = _.get(item, ['measurement', 'name']) || ''
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')
        return (
            <Row key={id}>
                <Col xs={3}>{name}</Col>
                <Col xs={3}>{type}</Col>
                <Col xs={2}>{brand}</Col>
                <Col xs={2}>{measurement}</Col>
                <Col xs={2}>{createdDate}</Col>
            </Row>
        )
    })
    return (
        <Container>
            <SubMenu url={ROUTES.MANUFACTURE_CUSTOM_URL}/>
            <ManufactureAddStaffDialog
                open={addStaff.open}
                onClose={addStaff.handleClose}
                shiftData={shiftData}
                staffData={staffData}
                userShift={userShift}
                confirmDialog={confirmDialog}
                userShiftConfirmClick={userShift.handleOpenUserShiftConfirmDialog}
            />
            <ManufactureShowBom
                open={showBom.open}
                onSubmit={productData.handleSubmitAddIngredient}
                onClose={showBom.handleClose}

            />
            <ManufactureAddProductDialog
                open={addProductDialog.open}
                onClose={addProductDialog.handleClose}
                onSubmit={addProductDialog.handleSubmitAddProductDialog}
            />
            <ManufactureAddProductDialog
                invitialValue={updateProductDialog.initionValue}
                open={updateProductDialog.open}
                onClose={updateProductDialog.handleClose}
                onSubmit={updateProductDialog.handleSubmitDialog}
            />
            <Row className={classes.productionMainRow}>
                <Col xs={3} className={classes.productionLeftSide}>
                    <h2 className={classes.productionH2}>Этапы производства</h2>
                    <ul className={classes.productionUl}>
                        {
                            _.get(listData, 'listLoading')
                            ? <div style={{textAlign: 'center'}}>
                                <CircularProgress size={100} thickness={6}/>
                            </div>
                            : manufactureList
                        }
                    </ul>
                </Col>
                <ManufactureTab
                    tabData={tabData}
                    productList={productList}
                    onClick={addProductDialog.handleOpen}
                    productData={productData}
                    productFilterDialog={productFilterDialog} />
                <Col xs={9} className={classes.productionRightSide}>
                    <Row>
                        <Col xs={12}>
                            <div className={classes.tab}>
                                <div className={classes.tabNav}>
                                    <a className="active">Продукция</a>
                                    <a>Персонал</a>
                                    <a>Оборудование</a>
                                </div>
                                <div className={classes.tabContent}>
                                    <div className={classes.tabWrapper}>
                                        <div className={classes.tableHeaderPN}>
                                            <a style={{float: 'right'}} onClick={addProductDialog.handleOpen}>
                                                <ContentAdd style={{height: '13px', width: '13px', color: 'rgb(18, 170, 235)'}}
                                                            viewBox="0 0 24 15"/>
                                                добавить продукцию
                                            </a>
                                        </div>
                                        <Row className="dottedList">
                                            <Col xs={4}><strong>Наименование</strong></Col>
                                            <Col xs={4}><strong>Описание</strong></Col>
                                            <Col xs={2} style={{textAlign: 'right'}}><strong>BoM</strong></Col>
                                            <Col xs={2} style={{textAlign: 'right'}}>&nbsp;</Col>
                                        </Row>
                                        {productList}
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={4} style={{
                            borderRight: '1px solid #efefef',
                            height: 'calc(100vh - 120px)',
                            padding: '20px 30px 20px 10px'
                        }}>
                            <div>
                                <h3 style={{display: 'inline-block', fontSize: '13px', fontWeight: '800', margin: '0'}}>
                                    Персонал</h3>
                                <a style={{float: 'right'}} onClick={addStaff.handleOpen}>
                                    <ContentAdd style={{height: '13px', width: '13px', color: 'rgb(18, 170, 235)'}}
                                                viewBox="0 0 24 15"/>
                                    добавить
                                </a>
                            </div>
                            {
                                _.get(userShift, 'userShiftLoading')
                                ? <div style={{textAlign: 'center'}}>
                                    <CircularProgress size={100} thickness={6}/>
                                </div>
                                : shiftList
                            }
                        </Col>
                        <Col xs={8} style={{padding: '20px 25px'}}>
                            <Row>
                                <Col xs={12}>
                                    <h3 style={{
                                        display: 'inline-block',
                                        fontSize: '13px',
                                        fontWeight: '800',
                                        margin: '0'
                                    }}>Оборудование</h3>
                                    <Row className={classes.productionEquipment}>
                                        {
                                            _.get(equipmentData, 'equipmentListLoading')
                                                ? <div style={{textAlign: 'center'}}>
                                                <CircularProgress size={100} thickness={6}/>
                                            </div>
                                                : equipList
                                        }
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} style={{padding: '20px 7px 10px'}}>
                                    <h3 style={{
                                        display: 'inline-block',
                                        fontSize: '13px',
                                        fontWeight: '800',
                                        margin: '0'
                                    }}>Список производимой продукции</h3>
                                    <a style={{float: 'right'}} onClick={addProductDialog.handleOpen}>
                                        <ContentAdd style={{height: '13px', width: '13px', color: 'rgb(18, 170, 235)'}}
                                                    viewBox="0 0 24 15"/>
                                        добавить
                                    </a>
                                    <ul>
                                        {productList}
                                    </ul>
                                </Col>
                            </Row>
                            <Row>
                                <ul className={classes.productList}>
                                    <li className="dottedList">
                                        <Col xs={7}>
                                            <strong>Название продукта</strong><br />
                                            <span>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</span>
                                        </Col>
                                        <Col xs={4} style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end'
                                        }}>
                                            <a onClick={showBom.handleOpen}
                                               style={{borderBottom: '1px dashed rgb(18, 170, 235)'}}>BoM </a>
                                        </Col>
                                        <Col xs={1}>
                                            <IconMenu
                                                iconButtonElement={iconButton}
                                                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                                targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                                                <MenuItem
                                                    primaryText="Изменить"
                                                    leftIcon={<Edit />}
                                                />
                                                <MenuItem
                                                    primaryText="Удалить "
                                                    leftIcon={<DeleteIcon />}
                                                />
                                            </IconMenu>
                                        </Col>
                                    </li>
                                </ul>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {_.get(shiftData, 'shiftId') && <ConfirmDialog
                type="delete"
                message={_.get(shift, 'name')}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSendConfirmDialog}
                open={confirmDialog.openConfirmDialog}
            />}
            {_.get(userShift, 'userShiftId') !== MINUS_ONE && <ConfirmDialog
                type="delete"
                message={currentUserShift}
                onClose={userShift.handleCloseUserShiftConfirmDialog}
                onSubmit={userShift.handleSendUserShiftConfirmDialog}
                open={userShift.openUserShiftConfirmDialog}
            />}
            {_.get(productData, 'productId') !== MINUS_ONE && <ConfirmDialog
                type="delete"
                message={currentUserShift}
                onClose={productData.handleCloseIngredientConfirmDialog}
                onSubmit={productData.handleSendIngredientConfirmDialog}
                open={productData.openIngredientConfirmDialog}
            />}
        </Container>
    )
})

ManufactureGridList.propTypes = {
    listData: PropTypes.object,
    detailData: PropTypes.object,
    confirmDialog: PropTypes.shape({
        openConfirmDialog: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSendConfirmDialog: PropTypes.func.isRequired
    }).isRequired,
    addStaff: PropTypes.shape({
        open: PropTypes.bool.isRequired,
        handleOpen: PropTypes.func.isRequired,
        handleClose: PropTypes.func.isRequired
    }).isRequired,
    showBom: PropTypes.shape({
        open: PropTypes.bool.isRequired,
        handleOpen: PropTypes.func.isRequired,
        handleClose: PropTypes.func.isRequired
    }).isRequired,
    addProductDialog: PropTypes.shape({
        open: PropTypes.bool.isRequired,
        productListLoading: PropTypes.bool,
        handleOpen: PropTypes.func.isRequired,
        handleClose: PropTypes.func.isRequired,
        handleSubmitAddProductDialog: PropTypes.func.isRequired
    }).isRequired,
    shiftData: PropTypes.object,
    staffData: PropTypes.object,
    userShift: PropTypes.shape({
        userShiftId: PropTypes.number,
        openUserShiftConfirmDialog: PropTypes.bool,
        handleOpenUserShiftConfirmDialog: PropTypes.func.isRequired,
        handleCloseUserShiftConfirmDialog: PropTypes.func.isRequired,
        handleSendUserShiftConfirmDialog: PropTypes.func.isRequired
    }),
    productData: PropTypes.object.isRequired,
    equipmentData: PropTypes.object,
    tabData: PropTypes.object.isRequired,
    productFilterDialog: PropTypes.shape({
        initialValues: PropTypes.object,
        filterLoading: PropTypes.bool,
        openFilterDialog: PropTypes.bool.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    }).isRequired,
    updateProductDialog: PropTypes.object
}

export default ManufactureGridList
