# GitHub 项目集成说明

## 功能概述

本项目已集成 GitHub API,可以自动从 GitHub 获取并展示指定用户的项目仓库信息。

## 当前配置

- **GitHub 用户名**: moyhuai
- **API 端点**: `https://api.github.com/users/moyhuai/repos`
- **显示数量**: 最多10个最新更新的仓库
- **过滤规则**: 自动过滤掉 fork 的仓库,只显示原创项目

## 展示的信息

每个项目卡片会显示以下信息:

1. **项目名称** - 仓库名称
2. **项目描述** - 仓库描述(如果没有则显示"暂无描述")
3. **技术栈标签** - 编程语言 + Topics(最多3个)
4. **星标数** ⭐ - 项目的 star 数量
5. **Fork 数** 🔀 - 项目的 fork 数量
6. **更新时间** 🕒 - 相对时间显示(如"2天前更新")
7. **项目主页** 🌐 - 如果设置了 homepage,会显示可点击链接

## 组件结构

### useGitHubProjects Composable
位置: `src/composables/useGitHubProjects.ts`

主要功能:
- 从 GitHub API 获取用户仓库数据
- 过滤和格式化数据
- 计算相对更新时间
- 提供 loading 和 error 状态

### ProjectList 组件
位置: `src/components/ProjectList.vue`

主要功能:
- 展示项目列表
- 响应式布局设计
- 悬停动画效果
- 加载和错误状态处理

## 使用方法

在 `App.vue` 中使用:

```vue
<ProjectList
  :title="i18n[isChinese ? 'zh' : 'en'].featuredProjects"
  github-username="moyhuai"
/>
```

或者传入自定义项目数据:

```vue
<ProjectList
  :title="'我的项目'"
  :projects="customProjects"
/>
```

## 自定义配置

### 修改 GitHub 用户名

在 `App.vue` 中修改 `github-username` 属性:

```vue
<ProjectList github-username="你的用户名" />
```

### 调整显示数量

在 `useGitHubProjects.ts` 中修改 API 参数:

```typescript
const response = await fetch(
  `https://api.github.com/users/${username}/repos?sort=updated&per_page=20`
)
```

### 自定义排序方式

支持的排序选项:
- `updated` - 按更新时间排序(默认)
- `created` - 按创建时间排序
- `pushed` - 按推送时间排序
- `full_name` - 按仓库名称排序

## 样式定制

项目卡片使用了 Tailwind CSS 类名,可以通过修改 `ProjectList.vue` 中的类名来自定义样式:

- 卡片背景: `bg-white dark:bg-gray-800`
- 悬停效果: `hover:shadow-lg hover:-translate-y-1`
- 技术栈标签: `bg-gradient-to-r from-blue-50 to-purple-50`

## 注意事项

1. **API 限制**: GitHub API 未认证请求每小时限制60次
2. **网络问题**: 需要确保能够访问 GitHub API
3. **私有仓库**: 只能获取公开仓库信息
4. **响应式设计**: 已适配移动端和桌面端显示

## 故障排除

### 加载失败

如果显示"加载失败",可能的原因:
- 网络连接问题
- GitHub API 限流
- 用户名错误

检查浏览器控制台的错误信息进行排查。

### 数据不更新

GitHub API 返回的数据可能有缓存,可以尝试:
- 刷新页面
- 清除浏览器缓存
- 等待几分钟后重试
