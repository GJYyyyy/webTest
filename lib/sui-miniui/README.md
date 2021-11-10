## 修改记录
-------------------------
### 版本号：v1.0.20
_发布日期：2017-11-15_

1. Validatebase : 解决组件校验通过后，title仍显示校验失败提示信息

### 版本号：v1.0.19
_发布日期：2017-09-13_

1. Datagrid : getCellEl提供返回值cellEl
2. 去除内网demo地址及servyou标识

### 版本号：v1.0.18
_发布日期：2017-07-20_

1. Datagrid : 解决type="checkboxcolumn"单元格编辑报错的问题


### 版本号：v1.0.17
_发布日期：2017-03-10_

1. Datagrid : 解决dataType="currency"时decimalPlaces配置无效的问题

### 版本号：v1.0.16
_发布日期：2017-02-24_

1. ButtoneditTip : 解决ButtonEdit多选时，不能根据delimiter正确分割的问题，即buttonedit的delimiter配置对tip失效的问题

### 版本号：v1.0.15
_发布日期：2017-01-12_

1. DataPicker : 解决销毁后重新创建，日历无法弹出的问题
2. AutoComplete : 鼠标右键粘贴无法触发查询操作，导致value不正确

### 版本号：v1.0.14
_发布日期：2017-01-03_

1. 修改源码中的版本号为最新版本号

### 版本号：v1.0.13
_发布日期：2016-09-26_

1. FieldUpload : 彻底解决setLimitType后，typesDescription中limitType丢失问题(原方法会导致typesDescription中limitType重复)

### 版本号：v1.0.12
_发布日期：2016-09-20_

1. Textbox : 解决输入后不失去焦点切换到其他软件后再切回来value无法正确赋值的问题
2. AutoComplete : 弹出层提示信息汉化

### 版本号：v1.0.11
_发布日期：2016-07-26_

1. ButtonEdit及其子类(combobox\treeselect等) : 解决disable之后tooltip无法显示问题
2. ButtonEdit及其子类(combobox\treeselect等) : 解决emptyText设置后无法清空的问题
3. Datagrid : 启动行编辑时,displayfield会从data中获取相应字段值设置buttonedit及其子类(combobox\treeselect等)的文本值(即调用其setText),当相应字段在data中不存在时,会将editor的text清空，故editor增加textname属性(同form),用于获取数据时获取editor的text值
4. Textbox : 解决设置selectOnFocus=true后,快速切换tab键光标乱窜问题
5. Treeselect : 解决在过滤后操作节点覆盖原有value问题
6. TreeGrid : 增加排序功能

### 版本号：v1.0.10
_发布日期：2016-06-15_

1. Treeselect:解决在过滤后操作节点覆盖原有value问题

### 版本号：v1.0.009
_发布日期：2016-02-17_

1. Treeselect:回退在过滤后操作节点覆盖原有value问题

### 版本号：v1.0.008
_发布日期：2016-01-5_

1. Treeselect:解决在过滤后操作节点覆盖原有value问题

### 版本号：1.0.005
_发布日期：2015-08-6_

1. DataPicker:增加对2011.11.02格式的支持
2. Tree:CheckRecursive=true,在filter后，点击父节点后，对于过滤掉的节点，不会被选中
3. Treeselect:CheckRecursive=true,且查询操作后，点击父节点后，子节点全选，过滤掉的节点不出现在输入框当中
4. DataGrid:在ie6,ie8兼容模式下，当没有数据时，没有横向滚动条

### 版本号：1.0.002
_发布日期：2015-05-28_

1. DataGrid:针对开启行编辑的使用场景，新增validateEditors()和isEditorsValid()两个方法，来实现对表格内的所有编辑框做校验的功能
2. FileUpload:解决在发生文件大小，文件类型，空文件等原因引起的错误提示后，输入框还是上一次选择的文件，现改为清空
3. FileUpload:在flash9下运行会导致ie崩溃，所以增加flash版本的校验，如果版本低于10，给出升级的提示
4. DataGrid:在pagechanged事件中，可以通过修改cancel属性来阻止翻页
5. Window:为了解决active控件的穿透问题，增加iframe垫片来遮挡active控件，此功能通过全局变量mini_useShims配置来开启
6. Combobox:在开启多选时，增加showColumns配置，可以列表显示头部
7. FileUpload:增加了下载更新的功能，当客户flashplay版本低于10时，会弹出更新提示，安装文件需要放在swfupload.js同目录下,文件名为flashPlayerSetup.zip，如要选择其他文件，可以配置updateFileName属性来指定文件名
8. FileUpload:将下载更新提示和未安装flash提示改为鼠标点击时才触发
9. Treeselect:在单选的情况下，如果在beforenodeselect事件中，cancel=true后，弹出框任然会被关闭，现改为不关闭
10. DataGrid:解决存在冻结列时，滚动条拖拽后再进行翻页，列信息错误的问题
11. Listbox:新增emptyText and showEmpty的配置
12. DataGrid:新增showButtonText和showButtonIcon的配置

### 版本号：v1.0.001
_发布日期：2015-03-06_

1. DataGrid:displayField配置遇到类似vo.name类型时，无法正确显示
2. DataGrid:若editor配置为mini-checklist时，无法赋值
3. TreeGrid:修改文件夹展开后图标不变的问题
4. Treeselect:弹出层中，输入查询字符后回车，弹出层关闭
5. Treeselect:如果开启查询功能，那么再弹窗关闭前，需要清空查询条件
6. Tree:新增checkOpposite配置，让父子节点互斥选择
7. Tree:新增checkOpposite配置，让父子节点互斥选择
8. DataGrid:修复当setReadOnly(true)后，开启行编辑的行任然可以操作的问题
9. DataGrid:单元格渲染格式化时，新增dateType=int和float的支持，之前dateType=int和float只是在排序时期作用
10. ButtonEdit:修复点击图标时就触发校验的问题
11. Treeselect：搜索功能未进行前后空格的过滤（trim）导致复制文字搜索时不方便
12. Listbox：在IE下有滚动条时出现列错位

### 版本号：v1.0.000
_发布日期：2015-01-21_

1. miniui原始版本