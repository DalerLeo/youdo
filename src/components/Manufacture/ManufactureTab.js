import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {Col} from 'react-flexbox-grid'
import Paper from 'material-ui/Paper'
import * as TAB from '../../constants/manufactureTab'
import {Tabs, Tab} from 'material-ui/Tabs'
import ManufactureProduct from './Tab/ManufactureProduct'
import ManufacturePerson from './Tab/ManufacturePerson'
import ManufactureEquipment from './Tab/ManufactureEquipment'
import ManufactureShipment from './Tab/ManufactureShipment'
const enhance = compose(
    injectSheet({
        ManufactRightSide: {
            padding: '0px 25px',
            zIndex: '2'
        },
        colorCat: {
            marginBottom: '0',
            width: '100%',
            '& > div': {
                paddingRight: 'calc(100% - 450px)',
                background: '#fff !important'
            },
            '& > div:first-child': {
                borderBottom: '1px #transparent solid'
            },
            '& > div:last-child': {
                width: '100% !important',
                padding: '0'
            },
            '& > div:nth-child(2) > div': {
                marginTop: '0px !important',
                marginBottom: '-1px',
                backgroundColor: '#12aaeb !important',
                height: '1px !important'
            },
            '& button': {
                color: '#333 !important',
                backgroundColor: '#fefefe !important',
                '& > div > div': {
                    height: '57px !important'
                }
            },
            '& button > span:first-line': {
                color: '#a6dff7'
            },
            '& button div div': {
                textTransform: 'initial'
            }
        }
    })
)

const ManufactureTab = enhance((props) => {
    const {classes,
        tabData,
        productFilterDialog,
        productData,
        personData,
        equipmentData,
        editMaterials,
        createMaterials,
        deleteMaterials,
        shipmentData,
        handleCloseDetail
    } = props
    const tab = _.get(tabData, 'tab')
    return (
        <Col className={classes.ManufactRightSide} xs={9} md={9}>
            <div>
                <Paper zDepth={1}>
                    <Tabs
                        className={classes.colorCat}
                        value={tab}
                        onChange={(value) => tabData.handleTabChange(value)}>
                        <Tab label="Продукция" value={TAB.MANUFACTURE_TAB_PRODUCT}/>
                        <Tab label="Персонал" value={TAB.MANUFACTURE_TAB_PERSON} />
                        <Tab label="Оборудование" value={TAB.MANUFACTURE_TAB_EQUIPMENT} />
                        <Tab label="Партия товара" value={TAB.MANUFACTURE_TAB_SHIPMENT} />
                    </Tabs>
                </Paper>
                {TAB.MANUFACTURE_TAB_PRODUCT === tab && <ManufactureProduct
                    productData={productData}
                    editMaterials={editMaterials}
                    filter={tabData.filter}
                    filterDialog={productFilterDialog}
                    createMaterials={createMaterials}
                    deleteMaterials={deleteMaterials}
                    handleCloseDetail={handleCloseDetail}/>}
                {TAB.MANUFACTURE_TAB_PERSON === tab && <ManufacturePerson
                    personData={personData}
                    />}
                {TAB.MANUFACTURE_TAB_EQUIPMENT === tab && <ManufactureEquipment
                    equipmentData={equipmentData}/>}
                {TAB.MANUFACTURE_TAB_SHIPMENT === tab && <ManufactureShipment
                    shipmentData={shipmentData}/>}
            </div>
        </Col>
    )
})
ManufactureTab.propTypes = {
    tabData: PropTypes.shape({
        tab: PropTypes.string.isRequired,
        handleTabChange: PropTypes.func.isRequired
    }),
    productData: PropTypes.object.isRequired,
    personData: PropTypes.object.isRequired,
    equipmentData: PropTypes.object.isRequired,
    shipmentData: PropTypes.object.isRequired
}

export default ManufactureTab
