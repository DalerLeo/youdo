import _ from 'lodash'
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
import MainStyles from '../Styles/MainStyles'
import Person from '../Images/person.png'
import ConfirmDialog from '../ConfirmDialog'

import Glue from '../Images/glue.png'
import Cylindrical from '../Images/cylindrical.png'
import Press from '../Images/press.png'
import Cut from '../Images/cut.png'
import Badge from '../Images/badge.png'

const enhance = compose(
    injectSheet(_.merge(MainStyles, {
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
            margin: '0 -26px',
            height: 'calc(100vh - 60px)',
            overflowY: 'auto'
        },
        productionLeftSide: {
            background: '#fcfcfc',
            borderRight: '1px solid #efefef',
            height: 'calc(100vh - 65px)',
            padding: '0'
        },
        productionRightSide: {
            background: '#fff',
            height: 'calc(100vh - 65px)',
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
                '& p': {
                    margin: '0',
                    display: 'inline-block',
                    fontWeight: '600 !important'
                },
                '& span': {
                    color: '#999',
                    position: 'absolute',
                    fontSize: '12px',
                    marginTop: '1px',
                    right: '0'
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

        productionEquipment: {
            padding: '20px 0',
            borderBottom: '1px solid #efefef'
        },
        productionEquipmentElement: {
            background: '#f2f5f8',
            textAlign: 'center',
            padding: '20px 30px'
        }

    }))
)

const ManufactureGridList = enhance((props) => {
    const {
        listData,
        detailData,
        addStaff,
        showBom,
        addProductDialog,
        classes,
        shiftData,
        stafData,
        equipmentData,
        productData,
        confirmDialog
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
                <ul className={classes.productionStaffUl}>
                    <li className="dottedList">
                        <div>
                            <img src={Person}/>
                        </div>
                        <div>
                            Атамбаев Бекзод<br />
                            <span>Должность</span>
                        </div>
                    </li>
                </ul>
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

    return (
        <Container>
            <SubMenu url={ROUTES.MANUFACTURE_CUSTOM_URL}/>
            <ManufactureAddStaffDialog
                open={addStaff.open}
                onClose={addStaff.handleClose}
                shiftData={shiftData}
                stafData={stafData}
                confirmDialog={confirmDialog}
            />
            <ManufactureShowBom
                open={showBom.open}
                onSubmit={productData.handleSubmitAddIngredient}
                onClose={showBom.handleClose}
            />
            <ManufactureAddProductDialog
                open={addProductDialog.open}
                onClose={addProductDialog.handleClose}
                inSubmit={addProductDialog.handleSubmitAddProductDialog}
            />
            <Row className={classes.productionMainRow}>
                <Col xs={3} className={classes.productionLeftSide}>
                    <h2 className={classes.productionH2}>Этапы производства</h2>
                    <ul className={classes.productionUl}>
                        {manufactureList}
                    </ul>
                </Col>
                <Col xs={9} className={classes.productionRightSide}>
                    <Row>
                        <Col xs={12}>
                            <h2 className={classes.productionRightH2}><img src={Press}/> Производство рулонов</h2>
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
                            {shiftList}
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
                                        {equipList}
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
        handleOpen: PropTypes.func.isRequired,
        handleClose: PropTypes.func.isRequired,
        handleSubmitAddProductDialog: PropTypes.func.isRequired
    }).isRequired,
    shiftData: PropTypes.object,
    stafData: PropTypes.object,
    productData: PropTypes.object.isRequired,
    equipmentData: PropTypes.object
}

export default ManufactureGridList
