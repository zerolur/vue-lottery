/* jshint esversion: 6 */
// 借条状态转换
export const formatState = params => {
    let s = params;
    return s==21?"展期已提交":s==22?"展期已审核":s==31?"还款已提交":"未知";
};

