/* jshint esversion: 6 */ 
import axios from 'axios';

import qs from 'qs';

// let base = 'http://www.daiyupingzheng.com/systemManager';
let base = 'http://192.168.30.7:8004';


// ---------------用户-------------- //
// 获取用户列表
export const getAccessUserList = params => { return axios.post(`${base}/accessUser/getAccessUserList`, qs.stringify(params));};
// 用户页面设置关联角色获取所有的角色节点
export const getAllRoleNodes = params => { return axios.post(`${base}/accessUser/getAllRoleNodes`, qs.stringify(params));};
// 用户绑定角色操作
export const bindAccessRole = params => { return axios.post(`${base}/accessUser/bindAccessRole`, params);};
// 根据用户ID获取该用户关联的所有角色ID
export const getCheckedRole = params => { return axios.post(`${base}/accessUser/getCheckedRole`, qs.stringify(params));};
// 新增用户
export const insertAccessUserInfo = params => { return axios.post(`${base}/accessUser/insertAccessUserInfo`, qs.stringify(params));};
// 修改用户
export const updateAccessUserInfo = params => { return axios.post(`${base}/accessUser/updateAccessUserInfo`, qs.stringify(params));};
// 删除用户
export const batchRemoveUser = params => { return axios.post(`${base}/accessUser/batchRemoveUser`, qs.stringify(params));};
// 用户密码初始化
export const initUserPsw = params => { return axios.post(`${base}/accessUser/initUserPsw`, qs.stringify(params));};
// 用户登录密码校验
export const accessUserLogin = params => { return axios.post(`${base}/accessUser/accessUserLogin`, qs.stringify(params));};
//用户登录成功 动态菜单的获取
export const getUserAccessMenu = params => { return axios.post(`${base}/accessUser/getUserAccessMenu`, qs.stringify(params));};
// 用户名唯一性校验
export const chkUserOnly = params => { return axios.post(`${base}/accessUser/chkUserOnly`, qs.stringify(params));};


// ---------------角色-------------- //
// 列表
export const getAccessRoleList = params => { return axios.post(`${base}/accessRole/getAccessRoleList`, qs.stringify(params));};
// 新增
export const insertAccessRole = params => { return axios.post(`${base}/accessRole/insertAccessRole`, params);};
// 修改
export const updateAccessRole = params => { return axios.post(`${base}/accessRole/updateAccessRole`, params);};
// 删除
export const deleteAccessRole = params => { return axios.post(`${base}/accessRole/deleteAccessRole`, qs.stringify(params));};
//获取所有的菜单节点
export const getAllNodes = params => { return axios.post(`${base}/accessRole/getAllNodes`, qs.stringify(params));};
//批量删除角色
export const batchRemoveRole = params => { return axios.post(`${base}/accessRole/batchRemoveRole`, qs.stringify(params));};
// 修改角色时获取已拥有的菜单节点
export const getCheckedNodes = params => { return axios.post(`${base}/accessRole/getCheckedNodes`, qs.stringify(params));};
// 角色名称唯一性校验
export const chkRoleOnly = params => { return axios.post(`${base}/accessRole/chkRoleOnly`, qs.stringify(params));};






// ---------------菜单-------------- //
// 获取菜单列表
export const getAccessMenuList = params => { return axios.post(`${base}/accessMenu/getAccessMenuList`, qs.stringify(params));};
// 新增菜单
export const insertAccessMenu = params => { return axios.post(`${base}/accessMenu/insertAccessMenu`, qs.stringify(params));};
// 修改菜单
export const updateAccessMenu = params => { return axios.post(`${base}/accessMenu/updateAccessMenu`, qs.stringify(params));};
// 删除菜单
export const deleteAccessMenu = params => { return axios.post(`${base}/accessMenu/deleteAccessMenu`, qs.stringify(params));};
