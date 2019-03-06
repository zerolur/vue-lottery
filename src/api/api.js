/* jshint esversion: 6 */ 
import axios from 'axios';
import qs from 'qs';

let base = 'http://192.168.0.46:8004';


// 用户列表查询
export const userPageList = params => {return axios.post(`${base}/user/userPageList`, qs.stringify(params)); };
// 用户详情的查询方法
export const selectUserById = params => {return axios.post(`${base}/user/selectUserById`, qs.stringify(params)); };
// 修改用户信息的方法
export const updateUserInfo = params => {return axios.post(`${base}/user/updateUserInfo`, qs.stringify(params)); };
// 新增用户信息
export const insertUser = params => {return axios.post(`${base}/user/insertUser`, qs.stringify(params)); };
// 删除用户信息
export const deleteUser = params => {return axios.post(`${base}/user/deleteUser`, qs.stringify(params)); };
// 批量删除用户信息
export const batchDeleteUser = params => {return axios.post(`${base}/user/batchDeleteUser`, qs.stringify(params)); };




// 库存列表查询
export const stockPageList = params => {return axios.post(`${base}/stock/stockPageList`, qs.stringify(params)); };

// 产品新增
export const productPageList = params => {return axios.post(`${base}/product/productPageList`, qs.stringify(params)); };
// 产品新增
export const saveProduct = params => {return axios.post(`${base}/product/saveProduct`, qs.stringify(params)); };