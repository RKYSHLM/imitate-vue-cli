class PromptApi {
	constructor(creator) {
		this.creator = creator
	}
	// 需要添加的特性
	injectFeature(feature) {
		this.creator.featurePrompts.choices.push(feature)
	} // 这可以理解为在一个交互式CLI工具中加入新的可选功能，从而用户可以在运行时选择是否启用该功能。
	// 特性的弹窗 动态添加用户交互的元素，如问题或配置选项。
	injectPrompt(prompt) {
		this.creator.injectPrompts.push(prompt)
	}
	// 选择特性完成之后的回调
	onPromptComplete(cb) {
		this.creator.promptCompleteCbs.push(cb)
	}
}

export default PromptApi


// promptModuleApi 的角色
// promptModuleApi 实例充当了一个桥梁的角色，它提供了一系列 API 方法供各个功能模块调用，以实现对主程序的修改或增强。这样，每个功能模块都不需要直接修改主程序代码，而是通过调用 promptModuleApi 提供的方法来实现交互。