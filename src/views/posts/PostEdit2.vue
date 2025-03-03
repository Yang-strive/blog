<template>
  <div class="article-edit">
    <!-- 顶部操作栏 -->
    <el-row>
      <el-col :span="16">
        <el-row>
          <!-- 文章标题 -->
          <el-col :span="3" class="align-center">
            <span>文章标题：</span>
          </el-col>
          <el-col :span="20">
            <el-input
              v-model="docForm.title"
              maxlength="100"
              minlength="5"
              placeholder="请输入文章标题（5-100个子）"
              show-word-limit
              type="text"
              class="title-box"
            />
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6" :offset="2">
        <el-row>
          <!-- 保存草稿按钮 -->
          <el-col :span="12"
            ><el-button v-if="docForm.status != '1'" @click="saveDraft">保存草稿</el-button></el-col
          >
          <!-- 发布按钮 -->
          <el-col :span="12">
            <!-- 显示发布面板，并给文章封面赋默认值（文章中第一张图片） -->
            <el-button
              @click="
                () => {
                  dialogFormVisible = true;
                  if (!isNotEmpty(docForm.coverUrl)){
                    docForm.coverUrl = docImgLinks[0];
                    docForm.coverId = resolverUrlGetId(docImgLinks[0]);
                  }
                }
              "
              >发布</el-button
            ></el-col
          >
        </el-row>
      </el-col>
    </el-row>

    <!-- markdown编辑区域-->
    <el-row>
      <el-col :span="24">
        <div ref="vditor" class="markdown-editor-box"></div>
      </el-col>
    </el-row>


    <!-- 发布按钮-弹出层 -->
    <el-dialog class="el-dialog" v-model="dialogFormVisible" title="发布文章">
      <!-- 标签 -->
      <el-row ref="tagRow">
        <el-col :span="3" class="label-col">标签</el-col>
        <el-col :span="21" class="input-col">
          <div>
            <el-tag
              v-for="tag in docForm.tags"
              :key="tag.id"
              class="mx-1"
              closable
              :disable-transitions="false"
              @close="handleCloseTag(tag)"
            >
              {{ tag.content }}
            </el-tag>
            <el-tag
              v-if="showAddTagFlag"
              @click="selectTagDialogFlag = true"
              effect="plain"
              type="info"
              >+添加标签</el-tag
            >
            <el-dialog
              ref="tagDialog"
              v-model="selectTagDialogFlag"
              :modal="false"
              :append-to-body="false"
              :style="tagDialogStyle"
              draggable
            >
              <template #default>
                <select-doc-tags :selectTags="docForm.tags" />
              </template>
            </el-dialog>
          </div>
        </el-col>
      </el-row>
      <!-- 封面 -->
      <el-row>
        <el-col :span="3">封面</el-col>
        <el-col :span="21">
          <el-row>
            <el-col :span="8">
              <div>
                <el-upload
                  action="http://localhost:20011/blog/uploadBlogFile"
                  :auto-upload="true"
                  :show-file-list="false"
                  :disabled="isDisabledUpload"
                  :on-remove="handleRemove"
                  v-model="uploadedFiles"
                  :on-success="uploadSuccessHandle"
                  :on-error="uploadErrorHandle"
                  class="upload-cover"
                >
                  <!-- <div v-if="docForm.coverUrl" class="el-upload-list__item is-success"> -->
                  <div
                    v-if="docForm.coverUrl"
                    class="el-upload-list el-upload-list--picture-card is-disabled"
                  >
                    <!-- <div class="el-upload-list__item is-success"> -->
                    <el-image
                      style="width: 150px; height: 100px"
                      :src="docForm.coverUrl"
                      fit="fit"
                    />
                    <span class="el-upload-list__item-actions">
                      <span
                        class="el-upload-list__item-delete"
                        @click.stop="handleRemove()"
                      >
                        <el-icon><Delete /></el-icon>
                      </span>
                    </span>
                    <!-- </div> -->
                  </div>
                  <el-icon v-else class="avatar-uploader-icon">
                    <Plus />添加文章封面
                  </el-icon>
                </el-upload>
              </div>
            </el-col>
            <!-- 文章图片选择区 -->
            <el-col :span="14">
              <div>
                <!-- 图片来源标签页 -->
                <el-row style="height: 30px; margin-bottom: 5px">
                  <el-col :span="12">
                    <el-tag type="info">正文图</el-tag>
                  </el-col>
                  <el-col :span="12">
                    <el-tag type="info">标签图</el-tag>
                  </el-col>
                </el-row>
                <!-- 图片备选区域 -->
                <el-row>
                  <el-col>
                    <el-scrollbar>
                      <div class="selectImgBox">
                        <div style="background-color: #ccc">
                          <el-popover
                            :width="300"
                            v-for="imgLink in docImgLinks"
                            :key="imgLink"
                          >
                            <template #reference>
                              <el-image
                                class="selectImgItem"
                                :src="imgLink"
                                fit="fit"
                                @click="handleSelectImg(imgLink)"
                              />
                            </template>
                            <template #default>
                              <div>
                                <el-image
                                  style="height: 200px"
                                  :src="imgLink"
                                  fit="fit"
                                />
                              </div>
                            </template>
                          </el-popover>
                        </div>
                      </div>
                    </el-scrollbar>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <!-- 文章简介 -->
      <el-row align="middle">
        <el-col :span="3">文章简介</el-col>
        <el-col :span="21">
          <el-input
            v-model="docForm.summary"
            :rows="3"
            type="textarea"
            placeholder="请输入文章标题"
          />
        </el-col>
      </el-row>
      <!-- 是否原创 -->
      <el-row align="middle">
        <el-col :span="3">是否原创</el-col>
        <el-col :span="21">
          <el-radio-group v-model="docForm.original">
            <el-radio label="true">是</el-radio>
            <el-radio label="false">否</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <!-- 文章权限 -->
      <el-row align="middle">
        <el-col :span="3">文章权限</el-col>
        <el-col :span="21">
          <el-radio-group v-model="docForm.authType">
            <el-radio label="1">公开</el-radio>
            <el-radio label="0">私密</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <!-- 是否置顶（功能移到外部操作） -->
      <!-- 是否开启评论（保留功能） -->

      <!-- 弹出层底部按钮区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button v-if="docForm.status != '1'" @click="saveDraft">保存草稿</el-button>
          <el-button type="primary" @click="publish">发布</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import "md-editor-v3/lib/style.css";
// import axios from "axios";
import { onBeforeRouteLeave } from "vue-router";
import { ElMessage } from "element-plus";
import { regEXConstant, isNotEmpty, isEmpty } from "@/utils/commonUtils";
// import "@/vditor";
import Vditor from 'vditor'
import 'vditor/dist/index.css' // 引入样式，要不然页面错乱


///// ============== 属性定义 start =================
interface DocForm{
  title: string;
  userId: string; //用户
  coverId: string; //封面id
  coverUrl: string; //封面url
  coverOrigin: string; //封面来源:1-自身上传，2-依赖文中链接
  tags: Array<{
    id: string;
    content: string;
  }>; //标签
  htmlContent: string;
  content: string;  //md内容
  summary: string; //文章简介
  original: string; //是否原创
  authType: string; //文章权限类型
  blogFileIds: Array<string>;
  status: string;
}
let docForm = ref<DocForm>({
  title: "",
  userId: "001", //用户
  coverId: "", //封面id
  coverUrl: "", //封面url
  coverOrigin: "1", //封面来源:1-自身上传，2-依赖文中链接
  tags: [], //标签
  htmlContent: "", //html内容
  content: ``,  //md内容
  summary: "", //文章简介
  original: "true", //是否原创
  authType: "1", //文章权限类型
  blogFileIds: [],
  status: "",
});

let selectTagDialogFlag = ref(false); //是否显示选择标签对话框
//是否显示添加标签
const showAddTagFlag = computed(() => {
  return isEmpty(docForm.value.tags) ? true : !(docForm.value.tags.length >= 7);
});

// 初始化vditor 实例
const vditor = ref<any>(null)
onMounted(() => {
  initVditor()
})

// TODO：toolbar需要进行移动端适配
const initVditor = () => {
  vditor.value = new Vditor(vditor.value, {
    cache:{id: 'vditor'},
    // height: "80%",
    placeholder: '请输入内容...',
    toolbar: [
      'emoji',
      'headings',
      'bold',
      'italic',
      'strike',
      'link',
      '|',
      'list',
      'ordered-list',
      'check',
      'outdent',
      'indent',
      '|',
      'quote',
      'line',
      'code',
      'inline-code',
      'insert-before',
      'insert-after',
      '|',
      'upload',
      'record',
      'table',
      '|',
      'undo',
      'redo',
      '|',
      'fullscreen',
      'preview',
      'outline',
      'code-theme',
      'content-theme',
      'export',
      'devtools',
      'info',
      'help'
    ],
    after() {
      // vditor.value.setValue('欢迎使用 Vditor!')
    }
  })
}


let dialogFormVisible = ref(false); // 弹窗显示控制

let isDisabledUpload = ref(false); // 上传按钮是否禁用控制

interface UploadedFile {
  name: string;
  url: string;
}
let uploadedFiles = ref<UploadedFile[]>([]);


// 文章中所有上传到服务器的图片链接 只取前10张
let docImgLinks = computed(() => {
  // 获取文本内容
  let content = vditor.value.getValue();
  if(isEmpty(content)) return [];

  // 获取所有服务器的链接（后续上传的url得改变，需要区分上传的文件类型）
  let sourceUrls = content.match(regEXConstant.testImagePreviewUrl);
  let result = <string[]>[];
  if(sourceUrls && sourceUrls.length>0){
    result = sourceUrls.map((urlStr: string) => {
    return urlStr.substring(urlStr.indexOf("(") + 1, urlStr.lastIndexOf(")"));
  });
  }
  // 只取前十条
  result = result ? result.slice(0, 10) : [];
  return result;
});

// 消息弹窗对象
var myMsg = ElMessage;

// 表单校验规则
var validateRules = ref({
  // 标题
  title: [],
  // 正文
  content: [],
  // 标签
  tags: [],
  // 封面图片url
  coverUrl: [],
  // 封面id
  coverId: [],
  // 文章简介
  summary: [],
  // 是否原创
  original: [],
  // 文章权限类型
  authType: [],
});
///// ============== 属性定义 end =================

// 小知识：async关键字是用于异步函数的关键字，标识的方法会返回一个Promise对象，可以通过.then()方法来处理异步操作的结果
/**
 * 上传文件的方法
 * @param {File} files
 * @param {Function} callback
 */
const onUploadImg = async (files:File[], callback:Function) => {
  console.log(validateRules);
  const res = await Promise.all(
    files.map((file) => {
      return new Promise((rev, rej) => {
        const form = new FormData();
        form.append("file", file);
        // TODO 上传文件
        // 休眠1秒，模拟上传过程
        setTimeout(() => {
          // 模拟上传成功
          const res = {
            // 创建随机数模拟id
            id: Math.floor(Math.random() * (999 - 100 + 1)) + 100,
            code: "00000", 
            data:{
              sysUrl: "https://dummyimage.com/500x300/FF6600&text=Image"
            },
            msg: "上传成功",
          }
          rev(res)
        }, 1000)
        if(false){
          // 模拟上传失败
          const res = {
            code: "00001",
            msg: "上传失败",
          }
          rej(res)
        }
        // fileApi
        //   .uploadBlogImg(form)
        //   .then((res) => {
        //     // let data = res.data;
        //     rev(res); //将响应数据返回给rev回调函数做参数，而rev作为Promise的成功回调
        //   })
        //   .catch((error) => rej(error));
      });
    })
  );

  callback(
    res.map((res:any) => {
      if (res.code === '00000') {
        return res.data.sysUrl; //拿到url信息并返回给调用者
      } else {
        myMsg.error(res.msg);
      }
    })
  );
};

// 保存草稿按钮
const saveDraft = () => {
  /**
   * 校验参数
   * 1. 文章内容不能为空
   * 2. 文章标题自动赋值为：【无标题】
   */
   docForm.value.content = vditor.value.getValue();
  var formData = docForm.value;
  let msg = validationTemporary(formData);
  if(msg && msg !== '' ){
    ElMessage.error(msg);
    return;
  }

  /**
   * 保存时，获取文本中所有已经上传的文件id值
   */
  getAllDocFileId();
  // TODO 调用后端接口，保存草稿
  // 休眠1秒，模拟保存草稿
  setTimeout(() => {
    // 模拟上传成功
    // 构建res对象
    let res = {
      code: "00000",
      data:{
        id: "1710135462735003650",
      } 
    }
    console.log("保存成功！", res.data);
    // 将响应后的数据重新赋值给页面
    docForm.value = { ...docForm.value, ...res.data };
    // 提示
    ElMessage.success("博客保存成功！");
    // 隐藏发布弹窗
    dialogFormVisible.value = false;
  }, 1000)
  // blogApi
  //   .temporary(formData)
  //   .then((res) => {
  //     // 处理响应结果
  //     if (res.code === "00000") {
  //       console.log("保存成功！", res.data);
  //       // 将响应后的数据重新赋值给页面
  //       docForm.value = { ...docForm.value, ...res.data };
  //       // 提示
  //       ElMessage.success("博客保存成功！");
  //       // 隐藏发布弹窗
  //       dialogFormVisible.value = false;
  //     } else {
  //       console.log(res.msg);
  //     }
  //   });
};

// 发布按钮
const publish = () => {
  // 打印输出后端请求对象
  try {
    //校验
    docForm.value.content = vditor.value.getValue();
    var formData = docForm.value;
    let msg = validationSubmit(formData);
    if(msg && msg !== ''){
      ElMessage.error(msg);
      return;
    }
    // TODO 调用后端接口，发布文章
    // 休眠1秒，模拟发布
    setTimeout(() => {
      let res = {
        code: "00000",
        data:{
          id: "1710135462735003650",
        } 
      }
      // 将响应后的数据重新赋值给页面
      docForm.value = { ...docForm.value, ...res.data };
      // 隐藏发布弹窗
      dialogFormVisible.value = false;
      // 提示
      ElMessage.success("博客发布成功！");
    }, 1000)
    // blogApi.publish(formData).then(res => {
    //   // 处理响应结果
    //   if (res.code === "00000") {
    //     // 将响应后的数据重新赋值给页面
    //     docForm.value = { ...docForm.value, ...res.data };
    //     // 隐藏发布弹窗
    //     dialogFormVisible.value = false;
    //     // 提示
    //     ElMessage.success("博客发布成功！");
    //   } else {
    //     console.log(res.msg);
    //   }
    // });
  } catch (error) {
    console.error("发布失败:", error);
    ElMessage.error("博客发布失败！")
  }
  dialogFormVisible.value = true;
};

/**
 * 选择封面点击事件，通过url给封面设值
 */
const handleSelectImg = (imgUrl:string) =>{
  if(imgUrl){
    docForm.value.coverUrl = imgUrl
    docForm.value.coverOrigin = '2'
    docForm.value.coverId = resolverUrlGetId(imgUrl);
  }
}

/**
 * 博客封面-删除
 */
const handleRemove = () => {
  if (docForm.value.coverId && docForm.value.coverOrigin === "1") {
    // 删除只对前端进行删除，并不调用后端接口进行文件删除
    // 调用后端删除资源接口
    // axios
    //   .get(
    //     `http://localhost:20011/file/blog/removeBlogFileById/${docForm.value.coverId}`
    //   )
    //   .then((res) => {
    //     console.log(res);
    //     var data = res.data;
    //     if (data.code === "00000") {
    //       console.log("文件删除成功！");
    //     } else {
    //       console.log(data.msg);
    //     }
    //   });
  }
  // 清楚前端缓存数据
  docForm.value.coverId = "";
  docForm.value.coverUrl = "";
  isDisabledUpload.value = false; // 删除封面后启用上传功能
};

/**
 * 上传博客封面成功回调
 * 给图片的url赋值
 */
const uploadSuccessHandle = (response: any) => {
  console.log('博客封面上传成功回调', response);
  if (response.code === "00000" && response.data) {
    docForm.value.coverId = response.data.id;
    docForm.value.coverUrl = response.data.sysUrl;
    docForm.value.coverOrigin = "1";
    isDisabledUpload.value = true; // 上传成功后禁用上传功能
    console.log("上传成功回调：uploadFiles", uploadedFiles.value);
  } else {
    myMsg.error("图片上传失败！");
  }
};
/**
 * 上传博客封面失败回调
 * 弹出提示信息
 */
const uploadErrorHandle = (error: any) => {
  // ajax错误，表示后端请求失败
  if (error.name === "UploadAjaxError") {
    myMsg.error("网络错误，图片上传失败！");
  }
};

/**
 * 关闭标签处理函数
 */
const handleCloseTag = (tag:any) => {
  console.log(docForm.value.tags.indexOf(tag));
  // 遍历录入的标签列表，匹配要去除的标签进行删除
  docForm.value.tags.splice(docForm.value.tags.indexOf(tag), 1);
};


// 拿到预览生成的html文本
const getHtmlText = (htmlContent: string) => {
  docForm.value.htmlContent = vditor.value.getHTML();
  // console.log(docForm.value.content);
};

// 计算markdown的有效字符
const validMDStringCount = computed(() => {
  // 去除无效字符
  const validString = vditor.value.getValue().trim().replace(/(\n|\s)/g, "");
  // 计算有效字符串个数
  return validString.length;
});

//计算预览的html有效字符
const validHTMLStringCount = computed(() => {
  // 去除无效字符
  const validContent = vditor.value.getHTML()
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\s/g, "");
  // 使用DOMParser解码HTML内容
  const parser = new DOMParser();
  const decodedContent = parser.parseFromString(validContent, "text/html")
    .documentElement.textContent;
  // 计算有效字符个数
  return decodedContent.length;
});

//弹出层标签关闭按钮
// const handleClose = (tag) => {
//   docForm.value.docTags.splice(docForm.value.docTags.indexOf(tag), 1)
// };

// const showInput = () => {
//   inputVisible.value = true
//   nextTick(() => {
//     InputRef.value.input.focus()
//   })
// }

// const handleInputConfirm = () => {
//   if (inputValue.value) {
//     docForm.value.docTags.push(inputValue.value)
//   }
//   inputVisible.value = false
//   inputValue.value = ''
// }

/**
 * 校验保存参数
 * 1. 文章内容不能为空
 * 2. 文章标题为空自动赋值为：【无标题】
 */
function validationTemporary(formData) {
  // 文章内容不能为空
  if (formData.content.trim() === "") {
    return "文章内容不能为空！";
  }
  //文章标题为空自动赋值为：【无标题】
  if (formData.title.trim() === "") {
    formData.title = "【无标题】";
  }
}

/**
 * 提交表单校验
 * 1. 文章内容不能为空
 * 2. 文章标题不能为空
 * 3. 文章简介不能为空
 * 4. 文章标签不能为空
 * 4. 栏位设默认值
 */
function validationSubmit(formData) {
  if (formData.content.trim() === "") {
    return "文章内容不能为空！";
  }
  if (formData.title.trim() === "") {
    return "文章标题不能为空！";
  }
  if (formData.summary.trim() === "") {
    return "文章简介不能为空！";
  }
  if (formData.tags && formData.tags.length <= 0) {
    return "文章标签不能为空！";
  }
}

/**
 * 解析markdown中的文件链接，获取资源id
 */
 function resolverUrlGetId(url){
  // 对遍历出来的url做字符串截取，取末尾的id值
  if (isNotEmpty(url)) {
    return url.substring(url.lastIndexOf("/") + 1,url.lastIndexOf("."));
  }
  return '';
 }


/**
 * 保存时获取所有上传到服务器的资源文件id
 */
function getAllDocFileId() {
  let sourceUrls = getAllDocFileUrl();
  var soruceIds = sourceUrls.map((url) => {return resolverUrlGetId(url)});
  if (soruceIds && soruceIds.length > 0) {
    console.log("文章中文件的id集合：", soruceIds);
    docForm.value.blogFileIds = soruceIds;
  }
}

/**
 * 获取所有上传到服务器的资源文件url
 */
function getAllDocFileUrl() {
  let content = vditor.value.getValue();
  // 获取所有图片链接
  let sourceUrls = content.match(regEXConstant.testImagePreviewUrl);
  if(sourceUrls && sourceUrls.length > 0){
    return sourceUrls.map((urlStr:string) => {
      return urlStr.substring(urlStr.indexOf("("), urlStr.lastIndexOf(")"));
    });
  }
  return [];
}

/**
 * 对页面跳转做拦截提示
 */
window.onbeforeunload = function () {
  if (vditor.value.getValue().trim().length > 0) {
    return "你确定要离开当前页面吗？";
  }
};
onBeforeRouteLeave((to, from, next) => {
  if (to !== from && vditor.value.getValue().trim().length > 0) {
    if (confirm("将要离开当前页面，请确认内容已保存！")) {
      next(); // 允许离开当前页面
    } else {
      next(false); // 阻止离开当前页面
    }
  } else {
    next();
  }
});
</script>


<style lang="scss" scoped>
.markdown-editor-box{
  width: 100%;
  // 设置剩下的高度为盒子的高度
  height: 750px;
}
.article-edit {
  min-height: 100vh;
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .el-row {
    margin-bottom: 20px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-col {
    border-radius: 4px;

    .grid-content {
      border-radius: 4px;
      min-height: 36px;
    }
  }

  /* 标题输入框样式 */
  .title-box {
    border-radius: 30px;
    font-weight: bold;
  }

  .dynamic-tag {
  }

  /* CSS样式 */
  .label-col {
    display: flex;
    align-items: center; /* 垂直居中对齐 */
  }

  .input-col {
    display: flex;
    align-items: center; /* 垂直居中对齐 */
  }

  .el-upload--picture-card {
    width: 150px;
    height: 95px;
  }

  .docImgPreviewBar {
    background-color: #959494;
  }

  .docImgPreviewBox {
    display: flexbox;
    overflow-x: auto; /* 如果图片数量过多，显示水平滚动条 */

    .docImgPreviewInnerBox {
      max-width: 100%; /* 图片最大宽度为容器宽度 */
      height: auto; /* 保持图片比例 */
      margin-right: 10px; /* 可选的图片间距 */
    }
  }

  /* 图片统一设为 */
  .el-puload img {
    width: 100%;
    /* height: 100%; */
    object-fit: cover; /* 保持图片比例，同时填充整个容器 */
  }

  .upload-cover {
    width: 150px;
    height: 100px;
    display: block;

    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
      width: 150px;
      height: 100px;

      &:hover {
        border-color: var(--el-color-primary);
      }
    }
  }

  /* 选取封面图片的列表样式 */
  .selectImgBox {
    width: 100%;
    height: 65px;
    display: flex;
    align-items: center; /* 让子元素在垂直方向上居中 */

    /* 选取封面图片的单个图片样式 */
    .selectImgItem {
      border: 1px dashed rgb(95, 195, 195);
      border-radius: 2px;
      width: 75px;
      height: 50px;
      flex-shrink: 0; /**重要的，防止图片在flex容器缩小时改变大小。 */
      margin: 0px 5px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        border-color: var(--el-color-primary);
        transform: translateY(-2px);
      }
    }
  }
}

// 全局样式
:deep(.el-dialog) {
  margin-bottom: 0px;

  .el-icon.avatar-uploader-icon {
    color: #8c939d;
    width: 150px;
    height: 100px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    font-size: 14px;

    .el-icon {
      font-size: 24px;
    }
  }
}

// 响应式适配
@media screen and (max-width: 768px) {
  .article-edit {
    .title-box {
      font-size: 14px;
    }

    .selectImgBox {
      height: auto;
      flex-wrap: wrap;
      padding: 8px;
      gap: 8px;

      .selectImgItem {
        width: calc(33.33% - 8px);
        height: 60px;
        margin: 0;
      }
    }
  }
}
</style>


<style>
.el-dialog {
  /* width: 60%; */
  /* min-width: 500px; */
  margin-bottom: 0px;
}

.upload-cover .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  width: 150px;
  height: 100px;
}

.upload-cover .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  /* font-size: 28px; */
  color: #8c939d;
  width: 150px;
  height: 100px;
  text-align: center;
}
</style>