#!/usr/bin/env node
// lib/creator.js 编写一个creator类，整个找模板到下载模板的主要逻辑都抽象到了这个类中。
import { fetchRepoList } from './request.js'
import { loading } from './utils.js'
import downloadGitRepo from 'download-git-repo'
import inquirer from 'inquirer'
import chalk from 'chalk'
import util from 'util'

class Creator {
	// 构造函数，接收项目名称和目标目录
	constructor(projectName, targetDir) {
		// 将项目名称存储在实例属性 name 中
		this.name = projectName
		// 将目标目录存储在实例属性 dir 中
		this.dir = targetDir
		// 将 downloadGitRepo 函数转换为返回 Promise 的函数，并存储在实例属性 downloadGitRepo 中
		this.downloadGitRepo = util.promisify( downloadGitRepo )
		// console.log(`thisname ${this.name}, this dir${this.dir}`)// 命令行传过来的数据
	}

	// 定义一个异步方法 fetchRepo，用于获取仓库的所有分支
	fetchRepo = async () => {
		// 使用 loading 函数包装 fetchRepoList，显示 'waiting for fetch resources' 消息
		const branches = await loading(fetchRepoList, 'waiting for fetch resources')
		// 返回获取的分支列表
		return branches
	}

	// 定义一个空的 fetchTag 方法，未来可以实现获取标签的功能
	fetchTag = () => {}

	// 定义一个异步方法 download，用于下载指定分支的代码
	download = async branch => {
		// 拼接下载路径，这里使用自己的模板仓库 URL 和指定的分支名
		const requestUrl = `RKYSHLM/vue-template/#${branch}`
		// 使用 downloadGitRepo 方法将代码下载到指定的目标目录
		await this.downloadGitRepo(requestUrl, this.dir)
		// 下载完成后，在控制台打印 'done!' 消息，显示绿色文本
		console.log(chalk.green('done!'))
	}

	// 定义一个异步方法 create，用于创建项目
	create = async () => {
		// 先去拉取当前仓库下的所有分支
		const branches = await this.fetchRepo()
		// console.log( "branches", branches )
		// 在 shell 命令行弹出选择项，选项为 choices 中的内容
		const { curBranch } = await inquirer.prompt([
			// 这里返回的是一个对象{curBranch:"template-js/ts"}直接使用解构赋值更加简洁
			// inquirer.prompt 方法来创建一个交互式命令行界面，让用户从列表中选择一个分支作为当前版本。
			{
				name: 'curBranch', //（String）用于存放用户回答的字段名。
				type: 'list', // list 单选列表
				// 提供一个列表给用户，用户使用上下箭头切换，回车选中
				// 提示信息
				message: 'please choose current version:',
				// 选项
				choices: branches
					.filter(branch => branch.name !== 'main') // 过滤掉 main 分支
					.map(branch => ({
						name: branch.name,
						value: branch.name,
					})),
			},
		])

		// 下载选定的分支
		await this.download(curBranch)
	}
}


export default Creator






