import ora from 'ora';
import path from 'path';
import Module from 'module';
import fs from 'fs-extra';
import userhome from 'userhome';


// 定义了一个名为 loading 的异步函数，用于执行一个传入的异步函数 fn，并在执行期间显示一个带有加载动画的消息 msg。如果执行失败，最多会自动重试三次。
export const loading = async (fn, msg, ...args) => {
	// 计数器，失败自动重试最大次数为3，超过3次就直接返回失败
	let counter = 0

	// 定义一个异步函数 run
	const run = async () => {
		// 创建一个新的 ora 实例，并传入消息 msg
		const spinner = ora(msg) // 在shell命令行中展示loading效果
		// 启动加载动画
		spinner.start()

		try {
			// 调用传入的异步函数 fn，并将剩余参数展开传递给 fn, 这里是空数组
			const result = await fn(...args)
			// 加载成功，显示成功消息
			spinner.succeed()
			// 返回 fn 的结果
			return result

		} catch (error) {
			// 加载失败，显示失败消息
			spinner.fail('something go wrong, refetching...')
			// 如果计数器小于3，递增计数器并再次运行 run 函数
			if (++counter < 3) {
				return run()
			} else {
				// 超过3次重试，返回一个被拒绝的 Promise
				return Promise.reject()
			}
		}
	}
	// 调用并返回 run 函数的结果
	return run()
}
