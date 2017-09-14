import ManufactureProductWrapper from './ProductWrapper'
import ManufacturePersonWrapper from './PersonWrapper'
import ManufactureEquipmentWrapper from './EquipmentWrapper'
import ManufactureShipmentWrapper from './ShipmentWrapper'

import {OPEN_USER_CREATE_DIALOG} from './ManufactureAddStaffDialog'
import {MANUFACTURE_SHOW_BOM_DIALOG_OPEN} from './ManufactureShowBom'
import {MANUFACTURE_ADD_PRODUCT_DIALOG_OPEN} from './ManufactureAddProductDialog'
import {MANUFACTURE_EDIT_PRODUCT_DIALOG_OPEN} from './ManufactureEditProductDialog'

const OPEN_DELETE_PRODUCT_DIALOG = 'openDeleteDialog'
const OPEN_USER_UPDATE_DIALOG = 'openUpdateDialog'
const MANUFACTURE_CREATE_PRODUCT_DIALOG_OPEN = 'createMaterials'
const OPEN_DELETE_MATERIALS_DIALOG = 'openDeleteIngredient'
const OPEN_USER_CONFIRM_DIALOG = 'openUserDeleteDialog'
const MANUFACTURE_CHANGE = 'openChangeManufacture'

export {
    OPEN_USER_CREATE_DIALOG,
    MANUFACTURE_SHOW_BOM_DIALOG_OPEN,
    MANUFACTURE_ADD_PRODUCT_DIALOG_OPEN,
    MANUFACTURE_CREATE_PRODUCT_DIALOG_OPEN,
    MANUFACTURE_EDIT_PRODUCT_DIALOG_OPEN,
    OPEN_DELETE_PRODUCT_DIALOG,
    OPEN_USER_CONFIRM_DIALOG,
    OPEN_USER_UPDATE_DIALOG,
    OPEN_DELETE_MATERIALS_DIALOG,
    MANUFACTURE_CHANGE,
    ManufactureProductWrapper,
    ManufacturePersonWrapper,
    ManufactureEquipmentWrapper,
    ManufactureShipmentWrapper
}
