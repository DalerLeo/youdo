import React from 'react'import MultiSelectField from '../Basic/MultiSelectField'import axios from '../../../helpers/axios'import * as PATH from '../../../constants/api'import toCamelCase from '../../../helpers/toCamelCase'const getOptions = (search) => {    return axios().get(`${PATH.BRAND_LIST}?search=${search || ''}&page_size=100`)        .then(({data}) => {            return Promise.resolve(toCamelCase(data.results))        })}const getIdsOption = (ids) => {    return axios().get(`${PATH.BRAND_LIST}?ids=${ids || ''}`)        .then(({data}) => {            return Promise.resolve(toCamelCase(data.results))        })}const BrandMultiSearchField = (props) => {    return (        <MultiSelectField            getValue={MultiSelectField.defaultGetValue('id')}            getText={MultiSelectField.defaultGetText('name')}            getOptions={getOptions}            getIdsOption={getIdsOption}            getItemText={MultiSelectField.defaultGetText('name')}            {...props}        />    )}export default BrandMultiSearchField