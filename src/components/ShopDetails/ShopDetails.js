import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import IconButton from 'material-ui/IconButton'
import Delete from 'material-ui/svg-icons/action/delete'
import AddAPhoto from 'material-ui/svg-icons/image/add-a-photo'
import Edit from 'material-ui/svg-icons/image/edit'
import CircularProgress from 'material-ui/CircularProgress'
import {Tabs, Tab} from 'material-ui/Tabs'
import {Col} from 'react-flexbox-grid'
import * as SHOP from '../../constants/shop'
import ShopDetailsImg from '../ShopDetailsImg'
import ShopDetailsMap from '../ShopDetailsMap'
import ShopDetailsActivity from '../ShopDetailsActivity'
import ShopDetailsStatistics from '../ShopDetailsStatistics'

const iconStyle = {
    icon: {
        width: 30,
        height: 30
    },
    button: {
        width: 66,
        height: 66,
        padding: 0
    }
}

const tooltipPosition = 'bottom-center'

const enhance = compose(
    injectSheet({
        wrapper: {
            width: '100%',
            display: 'flex'
        },
        leftSide: {
            boxSizing: 'border-box',
            background: '#fbfbfc',
            padding: '20px 35px'
        },
        rightSide: {
            boxShadow: '-5px 0px 5px #E0E0E0;',
            padding: '0 25px'
        },
        title: {
            paddingBottom: '20px',
            padding: '20px 0',
            display: 'flex',
            position: 'relative',
            borderBottom: 'dashed 1px',
            marginTop: '-25px'
        },
        titleLabel: {
            color: '#333333',
            fontWeight: 'bold',
            fontSize: '18px'
        },
        titleButtons: {
            position: 'absolute',
            right: '0',
            marginTop: '-20px',
            marginRight: '-25px'
        },
        top: {
            borderBottom: 'dashed 1px',
            paddingTop: '20px'
        },
        miniTitle: {
            fontWeight: 'bold',
            marginBottom: '20px',
            color: '#333333'
        },
        item: {
            display: 'flex',
            marginBottom: '20px'
        },
        typeLabel: {
            width: '40%',
            color: '#5d6474'
        },
        typeValue: {
            width: '80%',
            color: '#1d1d1d'
        },
        bottom: {
            paddingTop: '20px'
        },
        category: {
            display: 'flex',
            listStyle: 'none',
            borderBottom: '1px solid #e8e8e8',
            paddingLeft: 0,
            '& li': {
                padding: '5px 15px',
                '&:visited': {
                    color: 'blue',
                    borderBottom: '2px solid #a6dff7'
                }
            }
        },
        colorCat: {
            borderBottom: '2px solid #e8e8e8',
            marginBottom: '20px',
            '& > div': {
                width: '60% !important'
            },
            '& > div:nth-child(2) > div': {
                marginTop: '0px !important',
                marginBottom: '-2px',
                backgroundColor: '#a6dff7 !important'
            },
            '& button': {
                color: 'black !important',
                backgroundColor: 'white !important'
            },
            '& button > span:first-line': {
                color: '#a6dff7'
            }
        },
        loader: {
            width: '100%',
            background: '#fff',
            height: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }
    })
)
const ShopDetails = enhance((props) => {
    const {classes, loading, data, tabData} = props
    const tab = _.get(tabData, 'tab')
    const name = _.get(data, 'name') || 'N/A'
    const type = _.get(data, 'categoryName') || 'N/A'
    const address = _.get(data, 'address') || 'N/A'
    const guide = _.get(data, 'guide') || 'N/A'
    const phone = _.get(data, 'phone') || 'N/A'
    const contactName = _.get(data, 'contactName') || 'N/A'
    const agentName = _.get(data, 'agentName') || 'N/A'
    const agentPhone = _.get(data, 'agentPhone') || 'N/A'
    const agentEmail = _.get(data, 'agentEmail') || 'N/A'
    const lat = _.get(data, 'lat')
    const lng = _.get(data, 'lon')

    if (loading) {
        return (
            <div className={classes.loader}>
                <div>
                    <CircularProgress size={100} thickness={6} />
                </div>
            </div>
        )
    }

    return (
        <div className={classes.wrapper}>
            <Col className={classes.leftSide} xs={6} md={4}>
                <div className={classes.title}>
                    <div className={classes.titleLabel}>
                        {name}
                    </div>
                    <div className={classes.titleButtons}>
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            tooltipPosition={tooltipPosition}
                            tooltip="Edit">
                            <Edit />
                        </IconButton>
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            tooltipPosition={tooltipPosition}
                            tooltip="Add a photo">
                            <AddAPhoto />
                        </IconButton>
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            tooltipPosition={tooltipPosition}
                            tooltip="Delete">
                            <Delete />
                        </IconButton>
                    </div>
                </div>
                <div className={classes.top}>
                    <div className={classes.miniTitle}>Детали</div>
                    <div>
                        <div className={classes.item}>
                            <div className={classes.typeLabel}>
                                Тип заведения
                            </div>
                            <div className={classes.typeValue}>
                                {type}
                            </div>
                        </div>
                        <div className={classes.item}>
                            <div className={classes.typeLabel}>
                                Адрес
                            </div>
                            <div className={classes.typeValue}>
                                {address}
                            </div>
                        </div>
                        <div className={classes.item}>
                            <div className={classes.typeLabel}>
                                Ориентир
                            </div>
                            <div className={classes.typeValue}>
                                {guide}
                            </div>
                        </div>
                        <div className={classes.item}>
                            <div className={classes.typeLabel}>
                                Телефон
                            </div>
                            <div className={classes.typeValue}>
                                {phone}
                            </div>
                        </div>
                        <div className={classes.item}>
                            <div className={classes.typeLabel}>
                                Контактное лицо
                            </div>
                            <div className={classes.typeValue}>
                                {contactName}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classes.bottom}>
                    <div className={classes.miniTitle}>Агент</div>
                    <div>
                        <div className={classes.item}>
                            <div className={classes.typeLabel}>
                                Фамилия и имя
                            </div>
                            <div className={classes.typeValue}>
                                {agentName}
                            </div>
                        </div>
                        <div className={classes.item}>
                            <div className={classes.typeLabel}>
                                Телефон
                            </div>
                            <div className={classes.typeValue}>
                                {agentPhone}
                            </div>
                        </div>
                        <div className={classes.item}>
                            <div className={classes.typeLabel}>
                                Email
                            </div>
                            <div className={classes.typeValue}>
                                {agentEmail}
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
            <Col className={classes.rightSide} xs={6} md={8}>
                <div>
                    <Tabs
                        className={classes.colorCat}
                        value={tab}
                        onChange={(value) => tabData.handleTabChange(value)}>
                        <Tab label="Map" value={SHOP.SHOP_TAB_MAP}/>
                        <Tab label="Statistics" value={SHOP.SHOP_TAB_STATISTICS} />
                        <Tab label="Activity" value={SHOP.SHOP_TAB_ACTIVITY} />
                        <Tab label="Images" value={SHOP.SHOP_TAB_IMAGE} />
                    </Tabs>
                        {SHOP.SHOP_TAB_MAP === tab &&
                        <div style={{width: '100%', height: '400px'}}>
                            <ShopDetailsMap
                            // loading={loading}
                            lat={lat}
                            lng={lng}/>
                        </div>}
                        {SHOP.SHOP_TAB_STATISTICS === tab && <ShopDetailsStatistics />}
                        {SHOP.SHOP_TAB_ACTIVITY === tab && <ShopDetailsActivity />}
                        {SHOP.SHOP_TAB_IMAGE === tab && <ShopDetailsImg />}
                </div>
            </Col>
        </div>
    )
})


ShopDetails.propTypes = {
    data: React.PropTypes.object.isRequired,
    loading: React.PropTypes.bool.isRequired,
    tabData: React.PropTypes.shape({
        tab: React.PropTypes.string.isRequired,
        handleTabChange: React.PropTypes.func.isRequired
    })

}

export default ShopDetails

