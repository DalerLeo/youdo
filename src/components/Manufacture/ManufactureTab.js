import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {Col} from 'react-flexbox-grid'
import * as TAB from '../../constants/manufactureTab'
import {Tabs, Tab} from 'material-ui/Tabs'
import ManufactureProduct from './Tab/ManufactureProduct'
import ManufacturePerson from './Tab/ManufacturePerson'
import ManufactureEquipment from './Tab/ManufactureEquipment'
const enhance = compose(
    injectSheet({
        ManufactRightSide: {
            padding: '0px 25px',
            zIndex: '2'
        },
        colorCat: {
            borderBottom: '2px solid #e8e8e8',
            marginBottom: '0',
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
                backgroundColor: '#fefefe !important',
                height: '30px'
            },
            '& button > span:first-line': {
                color: '#a6dff7'
            },
            '& button div div': {
                height: '30px !important',
                justifyContent: 'flex-start !important'
            }
        }
    })
)

const ManufactureTab = enhance((props) => {
    const {classes, tabData, productFilterDialog, productData, personData, equipmentData, editMaterials, createMaterials, deleteMaterials} = props
    const tab = _.get(tabData, 'tab')
    return (
        <Col className={classes.ManufactRightSide} xs={9} md={9}>
            <div>
                <Tabs
                    className={classes.colorCat}
                    value={tab}
                    onChange={(value) => tabData.handleTabChange(value)}>
                    <Tab label="Продукция" value={TAB.MANUFACTURE_TAB_PRODUCT}/>
                    <Tab label="Персонал" value={TAB.MANUFACTURE_TAB_PERSON} />
                    <Tab label="Оборудование" value={TAB.MANUFACTURE_TAB_EQUIPMENT} />
                </Tabs>
                {TAB.MANUFACTURE_TAB_PRODUCT === tab && <ManufactureProduct
                    productData={productData}
                    editMaterials={editMaterials}
                    filter={tabData.filter}
                    filterDialog={productFilterDialog}
                    createMaterials={createMaterials}
                    deleteMaterials={deleteMaterials}/>}
                {TAB.MANUFACTURE_TAB_PERSON === tab && <ManufacturePerson
                    personData={personData}/>}
                {TAB.MANUFACTURE_TAB_EQUIPMENT === tab && <ManufactureEquipment
                    equipmentData={equipmentData}/>}
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
    equipmentData: PropTypes.object.isRequired
}

export default ManufactureTab
