// lib/request.js 下载仓库

import axios from 'axios'

// 响应拦截器 拦截器会在每个请求的响应返回之前执行，并允许您对响应数据进行修改。具体来说，这里拦截器的作用是将响应对象中的 data 属性提取出来，并返回给调用者。
axios.interceptors.response.use(res => {
	return res.data
})

// 这里是获取模板仓库的所有分支，url写自己的模板仓库url
export const fetchRepoList = () => {
	return axios.get('https://api.github.com/repos/RKYSHLM/vue-template/branches')
}

