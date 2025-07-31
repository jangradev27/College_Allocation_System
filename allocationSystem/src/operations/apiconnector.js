import axios from "axios"


const axiosInstance=axios.create({});

const apiconnector=(url,method,bodyData,headerData,params)=>{
    return axiosInstance({
        url:url,
        method:method,
        data:bodyData?bodyData:null,
        headers:headerData?headerData:null,
        params:params?params:null
    })
}

export default apiconnector;