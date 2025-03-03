import Vditor from 'vditor'
import 'vditor/dist/index.css' // 引入样式，要不然页面错乱


let toolbar: (string | IMenuItem)[]
let vditor: Vditor

if (window.innerWidth < 768) {
    toolbar = [
        "emoji",
        "headings",
        "bold",
        "italic",
        "strike",
        "link",
        "|",
        "list",
        "ordered-list",
        "check",
        "outdent",
        "indent",
        "|",
        "quote",
        "line",
        "code",
        "inline-code",
        "insert-before",
        "insert-after",
        "|",
        "upload",
        "record",
        "table",
        "|",
        "undo",
        "redo",
        "|",
        "edit-mode",
        "content-theme",
        "code-theme",
        "export",
        {
            name: "more",
            toolbar: [
                "fullscreen",
                "both",
                "preview",
                "info",
                "help",
            ],
        }]
}

const createVditor = (id: string | HTMLElement) => {
    return new Vditor(id, {
        // _lutePath: `http://192.168.31.194:9090/lute.min.js?${new Date().getTime()}`, 
        // _lutePath: "src/js/lute/lute.min.js",
        cdn: "",
        toolbar,
        lang: "zh_CN",
        // mode: 'wysiwyg',
        height: window.innerHeight + 100,
        cache: { enable: false },
        outline: {
            enable: true,
            position: "right",
        },
        debugger: true,
        typewriterMode: true,
        placeholder: "Hello, Vditor!",
        preview: {
            markdown: {
                toc: true,
                mark: true,
                footnotes: true,
                autoSpace: true,
            },
            math: {
                engine: "KaTeX",
                inlineDigit: true,
            },
        },
        toolbarConfig: {
            pin: true,
        },
        counter: {
            enable: true,
            type: "text",
        },
        hint: {
            emojiPath: "https://cdn.jsdelivr.net/npm/vditor@1.8.3/dist/images/emoji",
            emojiTail: "<a href=\"https://ld246.com/settings/function\" target=\"_blank\">设置常用表情</a>",
            emoji: {
                "sd": "💔",
                "j": "https://cdn.jsdelivr.net/npm/vditor@1.3.1/dist/images/emoji/j.png",
            },
            parse: false,
            extend: [
                {
                    key: "@",
                    hint: (key: string) => {
                        console.log(key)
                        if ("vanessa".indexOf(key.toLocaleLowerCase()) > -1) {
                            return [
                                {
                                    value: "@Vanessa",
                                    html: "<img src=\"https://avatars0.githubusercontent.com/u/970828?s=60&v=4\"/> Vanessa",
                                }]
                        }
                        return []
                    },
                },
                {
                    key: "#",
                    hint: (key: string) => {
                        console.log(key)
                        if ("vditor".indexOf(key.toLocaleLowerCase()) > -1) {
                            return [
                                {
                                    value: "#Vditor",
                                    html: "<span style=\"color: #999;\">#Vditor</span> ♏ 一款浏览器端的 Markdown 编辑器，支持所见即所得（富文本）、即时渲染（类似 Typora）和分屏预览模式。",
                                }]
                        }
                        return []
                    },
                }],
        },
        tab: "\t",
        upload: {
            accept: "image/*,.mp3, .wav, .rar",
            token: "test",
            url: "/api/upload/editor",
            linkToImgUrl: "/api/upload/fetch",
            filename(name: string) {
                return name.replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, "").replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, "").replace("/\\s/g", "")
            },
        },
    })
}

// createVditor("zh_CN")

/* window.setLang = (language: any) => {
    vditor.destroy()
    createVditor(language)
} */

export default createVditor