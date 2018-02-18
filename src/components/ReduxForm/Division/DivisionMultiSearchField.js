import React from 'react'import _ from 'lodash'import MultiSelectField from '../Basic/MultiSelectField'import * as storageHelper from '../../../helpers/storage'const DivisionMultiSearchField = (props) => {    const userData = JSON.parse(storageHelper.getUserData())    const divisions = _.get(userData, 'divisions')    const getOptions = () => {        return Promise.resolve(divisions)    }    const getIdsOption = () => {        return Promise.resolve(divisions)    }    return (        <MultiSelectField            getValue={MultiSelectField.defaultGetValue('id')}            getText={MultiSelectField.defaultGetText('name')}            getOptions={getOptions}            getIdsOption={getIdsOption}            getItemText={MultiSelectField.defaultGetText('name')}            {...props}        />    )}export default DivisionMultiSearchField