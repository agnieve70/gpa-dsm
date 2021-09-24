
import axios from 'axios'
import {
    TC_UPLOAD_REQUEST,
    TC_UPLOAD_SUCCESS,
    TC_UPLOAD_FAIL 
} from '../constants/termsAndConditionConstants'

const URL = 'https://gpadev-api-rebate.xtendly.com/api/v1'

export const uploadFile = (filepath, doctype, controlNo) => async (dispatch) => {
    try{

        let obj = JSON.parse(localStorage.getItem('userInfo'));

        dispatch({
            type: TC_UPLOAD_REQUEST
        })

        let bodyFormData = new FormData();
        bodyFormData.append('doctype', doctype);
        bodyFormData.append('controlNo', controlNo);
        bodyFormData.append('filepath', filepath);

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                "Accept": "application/json",
                'Authorization' : `Bearer ${obj.message.original.access_token}`
            }
        }

        
        const {data} = await axios.post(URL+'/upload-file',
        bodyFormData,
        config
        )

        dispatch({
            type: TC_UPLOAD_SUCCESS,
            payload:data
        })

    }catch(error)
    {
        dispatch({
            type: TC_UPLOAD_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        })
    }
}
