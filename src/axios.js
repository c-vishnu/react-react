import axios from "axios"; 
const GetData = axios.create({
    baseURL: "https://neyyar-all-api-stream.herokuapp.com/api/admin/v1/"
});

export default GetData;