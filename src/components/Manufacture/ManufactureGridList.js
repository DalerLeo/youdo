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
import Glue from '../Images/glue.png'
import Cylindrical from '../Images/cylindrical.png'
import Press from '../Images/press.png'
import Cut from '../Images/cut.png'
import Badge from '../Images/badge.png'
import Person from '../Images/person.png'

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
        addStaff,
        showBom,
        addProductDialog,
        classes
    } = props

    const iconButton = (
        <IconButton style={{padding: '0 12px', height: 'auto'}}>
            <MoreVertIcon />
        </IconButton>
    )

    return (
        <Container>
            <SubMenu url={ROUTES.MANUFACTURE_LIST_URL}/>
            <ManufactureAddStaffDialog
                open={addStaff.open}
                onClose={addStaff.handleClose}
            />
            <ManufactureShowBom
                open={showBom.open}
                onClose={showBom.handleClose}
            />
            <ManufactureAddProductDialog
                open={addProductDialog.open}
                onClose={addProductDialog.handleClose}
            />
            <Row className={classes.productionMainRow}>
                <Col xs={3} className={classes.productionLeftSide}>
                    <h2 className={classes.productionH2}>Этапы производства</h2>
                    <ul className={classes.productionUl}>
                        <li className={classes.productionTypeLi}>
                            <img src={Glue} />
                            Производство клея
                        </li>
                        <li className={classes.productionTypeLi}>
                            <img src={Cylindrical} />
                            Производство втулок
                        </li>
                        <li className={classes.productionTypeLi}>
                            <img src={Press} />
                            Производство рулонов
                        </li>
                        <li className={classes.productionTypeLi}>
                            <img src={Cut} />
                            Резка рулонов
                        </li>
                        <li className={classes.productionTypeLi}>
                            <img src={Badge} />
                            Нанесение логотипа
                        </li>
                    </ul>
                </Col>
                <Col xs={9} className={classes.productionRightSide}>
                    <Row>
                        <Col xs={12}>
                            <h2 className={classes.productionRightH2}><img src={Press}/> Производство рулонов</h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={4} style={{borderRight: '1px solid #efefef', height: 'calc(100vh - 120px)', padding: '20px 30px 20px 10px'}}>
                            <div>
                                <h3 style={{display: 'inline-block', fontSize: '13px', fontWeight: '800', margin: '0'}}>Персонал</h3>
                                <a style={{float: 'right'}} onClick={addStaff.handleOpen}>
                                    <ContentAdd style={{height: '13px', width: '13px', color: 'rgb(18, 170, 235)'}} viewBox="0 0 24 15" />
                                    добавить
                                </a>
                            </div>
                            <div>
                                <div className={classes.productionStaffGroupTitle}>
                                    <div className="dottedList">
                                        <p>Смена А</p>
                                        <span>График: 09:00 - 18:00</span>
                                    </div>
                                </div>
                                <ul className={classes.productionStaffUl}>
                                    <li className="dottedList">
                                        <div>
                                            <img src={Person} />
                                        </div>
                                        <div>
                                            Атамбаев Бекзод<br />
                                            <span>Должность</span>
                                        </div>
                                    </li>
                                    <li className="dottedList">
                                        <div>
                                            <img src={Person} />
                                        </div>
                                        <div>
                                            Атамбаев Бекзод<br />
                                            <span>Должность</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <div className={classes.productionStaffGroupTitle}>
                                    <div className="dottedList">
                                        <p>Смена А</p>
                                        <span>График: 09:00 - 18:00</span>
                                    </div>
                                </div>
                                <ul className={classes.productionStaffUl}>
                                    <li className="dottedList">
                                        <div>
                                            <img src={Person} />
                                        </div>
                                        <div>
                                            Атамбаев Бекзод<br />
                                            <span>Должность</span>
                                        </div>
                                    </li>
                                    <li className="dottedList">
                                        <div>
                                            <img src={Person} />
                                        </div>
                                        <div>
                                            Атамбаев Бекзод<br />
                                            <span>Должность</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </Col>
                        <Col xs={8} style={{padding: '20px 25px'}}>
                            <Row>
                                <Col xs={12}>
                                    <h3 style={{display: 'inline-block', fontSize: '13px', fontWeight: '800', margin: '0'}}>Оборудование</h3>
                                    <Row className={classes.productionEquipment}>
                                        <Col xs={4}>
                                            <div className={classes.productionEquipmentElement}>
                                                Название оборудования
                                            </div>
                                        </Col>
                                        <Col xs={4}>
                                            <div className={classes.productionEquipmentElement}>
                                                Название оборудования
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} style={{padding: '20px 7px 10px'}}>
                                    <h3 style={{display: 'inline-block', fontSize: '13px', fontWeight: '800', margin: '0'}}>Список производимой продукции</h3>
                                    <a style={{float: 'right'}} onClick={addProductDialog.handleOpen}>
                                        <ContentAdd style={{height: '13px', width: '13px', color: 'rgb(18, 170, 235)'}} viewBox="0 0 24 15" />
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
                                        <Col xs={4} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                                            <a onClick={showBom.handleOpen} style={{borderBottom: '1px dashed rgb(18, 170, 235)'}}>BoM </a>
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

        </Container>
    )
})

ManufactureGridList.propTypes = {
    detailData: PropTypes.object,
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
        handleClose: PropTypes.func.isRequired
    }).isRequired
}

export default ManufactureGridList
