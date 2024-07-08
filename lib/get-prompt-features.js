function getPromptFeatures() {
  return ['router', 'eslint'].map((file) => import(`./prompt-features/${file}.js`));
};// import()动态导入，函数返回一个 Promise，这个 Promise 会在模块加载完成后被解析。

export default getPromptFeatures;


// 动态导入（import()) 会返回一个 Promise，这个 Promise 解析后会包含导入模块的导出内容。
// 在你的代码中，getPromptFeatures 函数返回一个 Promise 数组，
// 这些 Promise 分别对应动态导入的 router 和 eslint 模块。
// 可以使用 Promise.all 来等待所有模块加载完成，并获取它们的导出内容。