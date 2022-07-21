<template>
    <div style="border: 1px solid #ccc;">
        <!-- 工具栏 -->
    
        <div style="border: 1px solid #ccc">
          <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editor"
            :defaultConfig="toolbarConfig"
        />
        <!-- 编辑器 -->
        <Editor
            style="height: 300px; overflow-y: hidden;"
            :defaultConfig="editorConfig"
            v-model="html"
            @onCreated="onCreated"
       
        />
        </div>
        
    </div>
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { DomEditor } from '@wangeditor/editor'

export default {
    name: 'MyEditor',
    components: { Editor, Toolbar },
    props:['sendDescription'],
    data() {
        return {
            editor: null,
            html: '<p>请具体描述商品的特征···</p>',
            toolbarConfig: {
                toolbarKeys: [
                    // 菜单 key
                    'headerSelect',
                    // 引用
                    'blockquote',
                    // 分割线
                    'divider',
                    // 分割线
                    '|',

                    // 菜单 key，表情
                    'bold', 'italic','emotion',
                    '|',

                    // 无序列表
                    'bulletedList',
                    // 有序列表
                    'numberedList',
                   
                    
                    // 对齐排列菜单
                    {
                        key: 'group-justify', // 必填，要以 group 开头
                        title: '对齐', // 必填
                        iconSvg: '<svg viewBox=\"0 0 1024 1024\"><path d=\"M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z\">', // 可选
                        menuKeys: ['justifyLeft', 'justifyRight', 'justifyCenter', 'justifyJustify']
                    }, 
                    {
                        key: "group-indent", // 必填，要以 group 开头
                        title: '缩进', // 必填
                        iconSvg: "<svg viewBox=\"0 0 1024 1024\"><path d=\"M0 64h1024v128H0z m384 192h640v128H384z m0 192h640v128H384z m0 192h640v128H384zM0 832h1024v128H0z m0-128V320l256 192z\"></path></svg>",
                        menuKeys: ['indent', 'delIndent']
                    },
                  
                ]
            },
            editorConfig: {
                placeholder: '请输入内容...',
                readOnly : false // 设置只读属性
            }
        }
    },
    methods: {
        onCreated(editor) {
            this.editor = Object.seal(editor) // 【注意】一定要用 Object.seal() 否则会报错
        },
        insertText() {
        const editor = this.editor // 获取 editor 实例
        if (editor == null) return

        // 调用 editor 属性和 API
        // editor.insertText('一段文字')
        // console.log(editor.getHtml())
        const toolbar = DomEditor.getToolbar(editor)
        console.log(toolbar.getConfig().toolbarKeys)
    },
        // @onChange="see"
        // see(editor){
        //     // const toolbar = DomEditor.getToolbar(editor)
        //     // console.log(toolbar.getConfig().toolbarKeys)
        //     console.log(this.html)
        // }
    },
    mounted() {
        // 模拟 ajax 请求，异步渲染编辑器
        // setTimeout(() => {
        //     this.html = '<p>请具体描述商品的特征···</p>'
        // }, 1500)
    },
    beforeDestroy() {
        const editor = this.editor
        if (editor == null) return
        editor.destroy() // 组件销毁时，及时销毁 editor ，重要！！！
    },
    watch: {
        html(val) {
            // console.log(val)
            // 给父组件传值
            this.$emit('getDescription',val)    
        },
        // 编辑状态的时候，需要接收父组件的值
        sendDescription(val){
            this.html = this.sendDescription
        }
    }
}
</script>

<!-- 记得引入 wangEditor css 文件，重要 ！！！ -->
<style src="@wangeditor/editor/dist/css/style.css"></style>
