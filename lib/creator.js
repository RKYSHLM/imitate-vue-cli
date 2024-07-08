// #!/usr/bin/env node
// // lib/creator.js 编写一个creator类，整个找模板到下载模板的主要逻辑都抽象到了这个类中。
// import userhome from 'userhome'
// import path from 'path'
// import fs from 'fs-extra'
// import { fetchRepoList } from './request.js';
// import { loading } from './utils.js';
// import downloadGitRepo from 'download-git-repo';
// import inquirer from 'inquirer';
// import chalk from 'chalk';
// import util from 'util';
// import PromptModuleApi from './prompt-api.js'


// const defaultFeaturePrompt = {
// 	name: 'features',
// 	type: 'checkbox',
// 	message: '请选择项目的特性',
// 	choices: [],
// }

// class Creator {
//   constructor(projectName, targetDir, promptFeatures) {
//     // 项目名称
//     this.name = projectName;
//     // 模板目录
//     this.templateDir = null;
//     // 项目目录
//     this.dir = targetDir;
//     // 将downloadGitRepo转成promise
//     this.downloadGitRepo = util.promisify(downloadGitRepo);
//     this.promptFeatures = promptFeatures;
//     // 特性的选择，之后他的choices会被一个一个插件填充
//     this.featurePrompts = defaultFeaturePrompt;
//     // 被注入的插件的选择框
//     this.injectPrompts = [];
//     // 被注入的选择完成的回调
//     this.promptCompleteCbs = [];
//     // 所选择的答案
//     this.projectOptions = null;
//     // 启用的插件
//     this.plugins = [];
//     // package.json的内容
//     this.pkg = null;
//     // 文件处理的中间件数组
//     this.fileMiddleWares = [];
//     // 需要插入的import语句
//     this.imports = {};
//     // key：文件路径 value：文件内容 插件在执行过程中生成的文件都会记录在这，最后统一写入硬盘
//     this.files = {};
//   }

//   // 加载特性
//   async loadFeatures() {
//     const promptModuleApi = new PromptModuleApi(this);
//     const modules = await Promise.all(this.promptFeatures);
//     modules.forEach((module) => {
//       module.default(promptModuleApi);
//     });
//   }

//   // 特性选择
//   async promptAndResolve() {
//     const prompts = [this.featurePrompts, ...this.injectPrompts];
//     const answers = await inquirer.prompt(prompts);
//     const projectOptions = {};
//     this.promptCompleteCbs.forEach((cb) => cb(answers, projectOptions));
//     return projectOptions;
//   }

//   fetchRepo = async () => {
//     const branches = await loading(fetchRepoList, 'waiting for fetch resources');
//     return branches;
//   }


// 	// 定义一个异步方法 fetchRepo，用于获取仓库的所有分支
// 	fetchRepo = async () => {
// 		// 使用 loading 函数包装 fetchRepoList，显示 'waiting for fetch resources' 消息
// 		const branches = await loading(fetchRepoList, 'waiting for fetch resources')
// 		// 返回获取的分支列表
// 		return branches
// 	}

// 	// 定义一个空的 fetchTag 方法，未来可以实现获取标签的功能
// 	fetchTag = () => {}

// 	// 定义一个异步方法 download，用于下载指定分支的代码
// 	download = async branch => {
// 		// 拼接下载路径，这里使用自己的模板仓库 URL 和指定的分支名
// 		const requestUrl = `RKYSHLM/vue-template/#${branch}`
// 		// 把资源下载到指定的本地磁盘的文件夹
// 		const localCacheFolder = userhome('.template')
// 		// 指定文件夹的模板的路径
// 		const localTemplateCacheUrl = ( this.templateDir = path.join( localCacheFolder, 'vue' ) )
// 		console.log(`skdjhfksdjhf${localTemplateCacheUrl}`)
// 		// 判断是否已经下载过该模板
// 		const hasDownloaded = fs.existsSync(localTemplateCacheUrl)
// 		// 如果已经下载过了，就直接跳过。
// 		if (!hasDownloaded) {
// 			await this.downloadGitRepo(requestUrl, localTemplateCacheUrl)
// 		}
// 		console.log( chalk.green( '模板准备完成!' ) )

// 		// 将模板从本地的指定目录复制到目标文件夹
// 		await fs.copy(localTemplateCacheUrl, this.dir)
// 		console.log(chalk.green('模板复制完成!'))
// 	}


// 	// 定义一个异步方法 create，用于创建项目
// 	create = async () => {
// 		await this.loadFeatures()
// 		// 先去拉取当前仓库下的所有分支
// 		const branches = await this.fetchRepo()
// 		// console.log( "branches", branches )
// 		// 在 shell 命令行弹出选择项，选项为 choices 中的内容
// 		const { curBranch } = await inquirer.prompt([
// 			// 这里返回的是一个对象{curBranch:"template-js/ts"}直接使用解构赋值更加简洁
// 			// inquirer.prompt 方法来创建一个交互式命令行界面，让用户从列表中选择一个分支作为当前版本。
// 			{
// 				name: 'curBranch', //（String）用于存放用户回答的字段名。
// 				type: 'list', // list 单选列表
// 				// 提供一个列表给用户，用户使用上下箭头切换，回车选中
// 				// 提示信息
// 				message: 'please choose current version:',
// 				// 选项
// 				choices: branches
// 					.filter(branch => branch.name !== 'main') // 过滤掉 main 分支
// 					.map(branch => ({
// 						name: branch.name,
// 						value: branch.name,
// 					})),
// 			},
// 		])

// 		// 下载选定的分支
// 		await this.download(curBranch)
// 	}
// }


// export default Creator




// lib/creator.js

import { fetchRepoList } from './request.js'
import { loading } from './utils.js'
import downloadGitRepo from 'download-git-repo'
import inquirer from 'inquirer'
import chalk from 'chalk'
import util from 'util'
import PromptModuleApi from './prompt-api.js'
import userhome from 'userhome'
import path from 'path'
import fs from 'fs-extra'

const defaultFeaturePrompt = {
	name: 'features',
	type: 'checkbox',
	message: '请选择项目的特性',
	choices: [],
}

class Creator {
	constructor(projectName, targetDir, promptFeatures) {
		// 项目名称
		this.name = projectName
		// 模板目录
		this.templateDir = null
		// 项目目录
		this.dir = targetDir
		// 将downloadGitRepo转成promise
		this.downloadGitRepo = util.promisify(downloadGitRepo)
		this.promptFeatures = promptFeatures // 动态导入（import eslint和router
		//----------------------------api的方法--------------------------
		// 特性的选择，之后他的choices会被一个一个插件填充
		this.featurePrompts = defaultFeaturePrompt
		// 被注入的插件的选择框, 特性弹框
		this.injectPrompts = []
		// 被注入的选择完成的回调
		this.promptCompleteCbs = []
		//------------------------------------------------------------------
		// 所选择的答案
		this.projectOptions = null
		// 启用的插件
		this.plugins = []
		// package.json的内容
		this.pkg = null
		// 文件处理的中间件数组
		this.fileMiddleWares = []
		// 需要插入的import语句
		this.imports = {}
		// key：文件路径 value：文件内容 插件在执行过程中生成的文件都会记录在这，最后统一写入硬盘
		this.files = {}
	}

	// 加载特性
	async loadFeatures() {
		const promptModuleApi = new PromptModuleApi(this)
		// console.log('promptModuleApi', promptModuleApi)
		const modules = await Promise.all(this.promptFeatures) // routerPrompt eslintprompt
		// console.log('modules', modules)
		// 遍历解析后的模块
		modules.forEach(module => {
			// 调用每个模块的默认导出函数，并传入 promptModuleApi 实例
			module.default(promptModuleApi)
		})
		// console.log('modules', modules)
	}

	// 特性选择
	async promptAndResolve() {
		// 1. 收集所有的 prompts
		const prompts = [this.featurePrompts, ...this.injectPrompts]
		// console.log( "feature", this.featurePrompts )
		// console.log("inj", this.injectPrompts)
		// console.log("promptssss",prompts)
		// 2. 使用 inquirer 库展示 prompts 并收集用户的回答
		const answers = await inquirer.prompt( prompts )
		console.log(answers)

		// 3. 初始化 projectOptions 对象，用于存储项目配置选项
		const projectOptions = {}

		// 4. 遍历并执行所有的 promptComplete 回调函数
		this.promptCompleteCbs.forEach(cb => cb(answers, projectOptions))

		// 5. 返回最终生成的 projectOptions 对象
		return projectOptions
	}

	fetchRepo = async () => {
		const branches = await loading(fetchRepoList, 'waiting for fetch resources')
		return branches
	}

	fetchTag = () => {}

	download = async branch => {
		// 拼接下载路径，这里使用自己的模板仓库 URL 和指定的分支名
		const requestUrl = `RKYSHLM/vue-template/#${branch}`
		// 把资源下载到指定的本地磁盘的文件夹
		const localCacheFolder = userhome('.template')
		// 指定文件夹的模板的路径
		const localTemplateCacheUrl = (this.templateDir = path.join(localCacheFolder, 'vue'))
		console.log(`skdjhfksdjhf${localTemplateCacheUrl}`)
		// 判断是否已经下载过该模板
		const hasDownloaded = fs.existsSync(localTemplateCacheUrl)
		// 如果已经下载过了，就直接跳过。
		if (!hasDownloaded) {
			await this.downloadGitRepo(requestUrl, localTemplateCacheUrl)
		}
		console.log(chalk.green('模板准备完成!'))
	}

	create = async () => {
		await this.loadFeatures()
		const projectOptions = (this.projectOptions = await this.promptAndResolve())
		// 1 先去拉取当前仓库下的所有分支
		const branches = await this.fetchRepo()
		const { curBranch } = await inquirer.prompt([
			{
				name: 'curBranch',
				type: 'list',
				// 提示信息
				message: 'please choose current version:',
				// 选项
				choices: branches
					.filter(branch => branch.name !== 'main')
					.map(branch => ({
						name: branch.name,
						value: branch.name,
					})),
			},
		])
		// 2 下载
		await this.download(curBranch)
		// 3 将模板复制到目标目录
		await fs.copy(this.templateDir, this.dir)
	}
}

export default Creator


