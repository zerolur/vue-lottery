/* jshint esversion: 6 */ 
import axios from 'axios';
import qs from 'qs';

let base = 'http://192.168.30.7:8004';


export const riskModelList = params => {return axios.post(`${base}/risk-model/riskModelList`, qs.stringify(params)); };

export const riskModelSwitch = params => {return axios.post(`${base}/risk-model/riskModelSwitch`, qs.stringify(params)); };



// 风控模型成功率分析
export const riskAnalysisReport = params => {return axios.post(`${base}/risk-analysis/riskAnalysisReport`, params); };



// 风控模型日志
export const getRiskLogsList = params => {return axios.post(`${base}/risk-logs/getRiskLogsList`, params); };