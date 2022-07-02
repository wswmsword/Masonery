# Masonry

[English](README_EN.md)

> [Masonry creates a deterministic grid layout, positioning items based on available vertical space.](https://gestalt.netlify.app/masonry)

## 调试组件

### 编辑和监听组件

```bash
$ cd src
$ npm install
$ npm run watch
```

现在我们可以自由编辑根目录下`src`内的组件源码，每次编辑并保存之后，在根目录下会生成`dist`文件夹。`dist`文件夹里是可以被引用的`commonjs`和`es6`模块。

### 在应用环境里调试组件

```bash
$ cd ..
$ cd app/demo-cjs
$ npm install
$ npm run start
```

使用`app/demo-cjs`的应用环境，或者创建一个应用环境并引用`dist`内的模块，安装并运行应用环境。当我们编辑并保存根目录`src`组件源码的时候，浏览器会立即刷新，并且看到最新的更改。

## Component Intro

文档里的“项目”是指砖块布局里的每个砖块组件，“容器”是指砖块布局自身，也就是容纳砖块组件的父组件 wrapper。

## Props

| Name | Type | Default | isRequired | Description
|:--|:--|:--|:--|:--|
| width | number | 屏幕宽度 | 🔴 | 容器宽度 |
| disableWrap | boolean | false | 🔴 | 容器包裹住项目，宽度是项目加间距的长度 |
| itemWidth | number | / | ✅ | 项目宽度 |
| colsNum | number | 铺满宽度的最大纵列数量 | 🔴 | 纵列数量 |
| gapX | number | 0 | 🔴 | 横向间距 |
| gapY | number | 0 | 🔴 | 纵向间距 |
| disableGapX | boolean | false | 🔴 | 控制项目横向均匀分布 |
| itemsData | ReadOnlyArray\<T\> | / | ✅ | 项目数据，用于`ItemComp`的渲染 |
| ItemComp | React.ComponentType\<ItemCompProps\> | / | ✅ | 项目组件，使用`itemsData `渲染 |
| placeHeight | number | / | 🔴 | 占位高度 |
| PlaceComp | React.ComponentType\<PlaceCompProps\> | / | 🔴 | 占位组件 |

## 铺满屏幕，项目之间间隔 18 像素

```javascript
<Masonry
	itemWidth={169}
	itemsData={itemsData}
	ItemComp={GreyPinItem}
	gapX={18}
	gapY={18} />
```

容器的宽度是默认的屏幕宽度，项目的宽度是`169px`，横向和纵向的项目间距是的`18px`，纵列的数目是，屏幕宽度里，横向能放置的最多项目的数量。

## 动态铺满屏幕，项目之间间隔 18 像素

首先引入高阶组件`withAutoColumn`，这个组件监听屏幕宽度并生成属性`colsNum`给被包裹的组件，也就是根据屏幕变化动态地给`Masonry`组件属性`colsNum`。

```javascript
const MasonryWithAutoCol = withAutoColumn<MasonryProps>(Masonry, {
	gap: 18,
	itemW: 169,
});
```

```javascript
<MasonryWithAutoCol
	itemWidth={169}
	itemsData={itemsData}
	ItemComp={GreyPinItem}
	gapX={18}
	gapY={18} />
```

## 指定 3 列，并在 569 像素的宽度间均匀分布

```javascript
<Masonry
	width={569}
	itemWidth={169}
	colsNum={3}
	itemsData={itemsData}
	ItemComp={GreyPinItem}
	disableGapX
	gapY={18} />
```

容器的宽度是`569px`，项目的宽度是`169px`，纵列数目是`3`，三列在指定的容器宽度均匀分布，列和间距的宽度就是`[169, 31, 169, 31 169]`。

## 指定 3 列，项目之间间隔 18 像素

```javascript
<Masonry
	itemWidth={169}
	itemsData={itemsData}
	ItemComp={GreyPinItem}
	colsNum={3}
	gapX={18}
	gapY={18} />
```