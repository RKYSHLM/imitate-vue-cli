// lib/prompt-features/router.js
// 路由
const routerPrompt = (cli) => {// 这里的cli就是promptapi
  // 注入特性
  cli.injectFeature({
    name: 'Router',
    value: 'router',
    description: '是否支持路由',
  });
  // 弹出选项，决定路由模式
  cli.injectPrompt({
		name: 'routerMode',
		when: answers => answers.features.includes('router'), 
		message: '请选择路由模式',
		type: 'list',
		choices: [
			{ name: 'hash', value: 'hash' },
			{ name: 'history', value: 'history' },
		],
		default: 'history',
	})
  // App组件的title
  cli.injectPrompt({
    name: 'appTitle',
    when: (answers) => answers.features.includes('router'),
    message: '请输入App组件的内容',
    type: 'text',
    default: 'AppTitle',
  });
  // 选完路由模式后的回调  projectOptions就是本次生成的项目的特性的结果记录
  cli.onPromptComplete((answers, projectOptions) => {
    // 如果选择了路由这个特性，那么我们就记录下参数（hash还是history）
    if (answers.features.includes('router')) {
      if (!projectOptions.plugins) {
        projectOptions.plugins = {};
      }
      // 内部插件的npm包 下面会讲如何写这个插件
      projectOptions.plugins['@rippiorg/react-router-plugin'] = {
        routerMode: answers.routerMode,
      };
      projectOptions.routerMode = answers.routerMode;
      projectOptions.appTitle = answers.appTitle;
    }
  })
};

export default routerPrompt;



