import axios from "axios";
import ConstantList from "../../appConfig";

const APT_PATH = ConstantList.API_ENPOINT

export const  getSearchEmployee = async (data) => {
  var url = APT_PATH + "/employees/search";
  return await axios.post(url,data);
};

export const  addEmployee = async (data) => {
  var url = APT_PATH + "/employees";
  return await axios.post(url,data);
};

export const  deleteEmployee = async (id) => {
  var url = APT_PATH + "/employees/"+id;
  return await axios.delete(url);
};

export const  updateEmployee = async (data,id) => {
  var url = APT_PATH + "/employees/"+id;
  return await axios.put(url,data);
};

export const  getSearchProvince = async (data) => {
  var url = APT_PATH + "/provinces/search";
  return await axios.post(url,data);
};
export const  getSearchProvinceByID = async (id) => {
  var url = APT_PATH + "/provinces/"+id;
  return await axios.get(url);
};

export const  getSearchDistrict = async (data) => {
  var url = APT_PATH + "/districts/search";
  return await axios.post(url,data);
};
export const  getSearchCommune = async (data) => {
  var url = APT_PATH + "/communes/search";
  return await axios.post(url,data);
};