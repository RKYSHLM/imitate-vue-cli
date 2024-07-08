
// lib/create.js
import path from 'path'
import Creator from './creator.js'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import getPromptFeatures from './get-prompt-features.js'

/**
 * 执行create时的处理
 * @param {any} name // 创建的项目名
 * @param {any} options // 配置项 必须是上面option配置的选项之一，否则就报错  这里取的起始就是cmd里面的options的各个option的long属性
 * @param {any} cmd // 执行的命令本身 一个大对象，里面很多属性
 */

const create = async (projectName, options, cmd) => {
	// 获取工作目录
	const cwd = process.cwd() // process.cwd() 返回当前 Node.js 进程的工作目录
	// 目标目录也就是要创建的目录
	const targetDir = path.join(cwd, projectName)

	if (fs.existsSync(targetDir)) {
		//node.js中用于返回目录是否存在
		// 选择了强制创建，先删除旧的目录，然后创建新的目录
		if (options.force) {
			// 带上force
			await fs.remove(targetDir)
		} else {
			// 没带上force-  给用户选择：覆盖还是退出
			const { action } = await inquirer.prompt([
				{
					name: 'action',
					type: 'list',
					// 提示信息
					message: `${projectName} is existed, are you want to overwrite this directory`,
					// 选项
					choices: [
						{ name: 'overwrite', value: true },
						{ name: 'cancel', value: false },
					],
				},
			])
			if (!action) {
				// 上一个函数返回的结果，如果是cancel->false,直接return
				return
			} else {
				console.log('\r\noverwriting...')
				await fs.remove(targetDir)
				console.log('overwrite done')
			}
		}
	}

	const promptFeatures = getPromptFeatures()
	// 创建项目
	const creator = new Creator(projectName, targetDir, promptFeatures)
	creator.create()
}

export default create



