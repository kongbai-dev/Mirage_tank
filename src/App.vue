<script setup>
import { ref ,shallowRef } from 'vue';
import { onMounted, onUnmounted } from 'vue';
import { loadImage, generateMirgeTank } from './utils/imageProcessor.js';
import { UploadFilled, Picture, Download, MagicStick, Delete } from '@element-plus/icons-vue'; 
//import { ElButton, ElUpload, ElMessage } from 'element-plus';


const resultSrc = ref(null);
const isProcessing = ref(false);
const isWhiteBg = ref(true);
const previewBg = ref('white');


const uploadConfig = ref([
  {
    id: 'light',
    label: '1. 表层图(在白色背景显示)',
    sublabel: '选亮色图',
    src: null,
    file: null,
  },
  {
    id: 'dark',
    label: '2. 里层图 (在黑色背景显示)',
    sublabel: '选暗色图',
    src: null,
    file: null,
  }
]);
const handleFileChange = async (UploadFile, index) => {
  const file = UploadFile.raw;
  
  if (!file.type.startsWith('image/')) {
    ElMessage.error("请上传有效的图片文件。");
    return;
  }

  try {
    const img = await loadImage(file);
    uploadConfig.value[index].src = img.src;
    uploadConfig.value[index].file = img;

  } catch (error) {
    console.error("图片加载失败", error);
    ElMessage.error("图片加载失败，请重试。");
  }
};

const handleGenerate = async () => {
  if (!uploadConfig.value[0].file || !uploadConfig.value[1].file) {
    ElMessage.warning("请先上传两张图片。");
    return;
  }
  isProcessing.value = true;

  setTimeout(async () => {
    try {
      resultSrc.value = await generateMirgeTank(uploadConfig.value[0].file, uploadConfig.value[1].file);
      ElMessage.success("幻影坦克生成成功！");
    } catch (error) {
      console.error("图像处理失败", error);
      ElMessage.error("图像处理失败，请重试。");
    } finally {
      isProcessing.value = false;
    }
  }, 100);
};

const handleDownload = () => {
  if (!resultSrc.value) return;
  const a = document.createElement('a');
  a.href = resultSrc.value;
  a.download = `mirge_tank_${Date.now()}.png`;
  a.click();
};
const handleRemove = (index) => {
  uploadConfig.value[index].src = null;
  uploadConfig.value[index].file = null;
};
const handlePaste = (event) => {
  const items = event.clipboardData.items;
  if (items) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind.indexOf('image')!== -1) {
        const file = items[i].getAsFile();
        if (!uploadConfig.value[0].file) {
          handleFileChange({ raw: file } , 0);
        }else if (!uploadConfig.value[1].file) {
          handleFileChange({ raw: file } , 1);
        }
      }
    }
  }
}
onMounted(() => {
  document.addEventListener('paste', handlePaste);
});
onUnmounted(() => {
  document.removeEventListener('paste', handlePaste);
})
</script>

<template>
  <el-container class="app-container">
    <el-header class="header">
      <h1>👻幻影坦克生成器</h1>z 

    </el-header>
    <el-main>
      <el-row :gutter="40">
        <el-col :md="10" :sm="24">
          <el-card class="control-panel">
            <template #header>
              <div class="card-header">
                <span>🛠️ 制作面板</span>
              </div>
            </template>

            <div v-for="(item, index) in uploadConfig" :key="item.id" class="upload-group">
              <div class="label-text">{{ item.label }}</div>
              <el-upload
                class="upload-area"
                drag
                action="#"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="(file) => handleFileChange(file, index)"
                >
                <div v-if="item.src" class="preview-container" @click.stop>
                  <img :src="item.src" class="preview-thumb"></img>
                  <div class="preview-mask">
                    <el-icon @click="handleRemove(index)"><Delete/></el-icon>
                  </div>
                </div>
                <!-- <img v-if="item.src" :src="item.src" class="preview-thumb"/> -->
                <div v-else class="el-upload__text">
                  <el-icon class="el-icon--upload"><upload-filled/></el-icon>
                  <div>拖拽或点击上传 <br/> <small>{{ item.sublabel }}</small></div>
                </div>
              </el-upload>
            </div>
            
            <div class="actions">
              <el-button
                type="primary"
                size="large"
                :icon="MagicStick"
                :loading="isProcessing"
                class="full-btn"
                @click="handleGenerate">
                开始合成
              </el-button>
            </div>
          </el-card>
        </el-col>

        <el-col :md="14" :sm="24" class="result-col">
          <el-card class="result-panel">
            <template #header>
              <div class="card-header">
                <span>效果预览</span>
                <el-switch
                  v-model="isWhiteBg"
                  active-text="白底(表图)"
                  inactive-text="黑底(里图)"
                  inline-prompt
                  style="--el-switch-on-color: #dcdfe6; --el-switch-off-color: #000000"
                  :disabled="!resultSrc"
                  />
              </div>
            </template>
            <div
              class="canvas-container"
              :class="{ 'is-dark': !isWhiteBg, 'has-image' : !!resultSrc }"
              >
              <el-empty v-if="!resultSrc" description="左侧上传并合成后在此预览" />
              <img v-else :src="resultSrc" class="result-image" />
            </div>
            <div class="footer-actions" v-if="resultSrc">
              <el-button type="success" :icon="Download" class="button-download" @click="handleDownload">
                下载 PNG 图片
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<style scoped>
.control-panel, .result-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.button-download {
  width: 100%;
  max-width: 300px;
}
.control-panel :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.action {
  margin-top: auto;
  padding-top: 20px;
}
.result-panel :deep(.el-card__body) {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.canvas-container {
  flex: 1;
  min-height: 400px;
}
.app-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  min-height: 100vh;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif, '微软雅黑';
}
.header {
  text-align: center;
  margin-bottom: 40px;
  color: #409eff;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}
.upload-group {
  margin-bottom: 20px;
}
.label-text {
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}
.upload-area :deep(.el-upload-dragger) {
  padding: 10px;
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.preview-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.preview-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
  cursor: pointer;
  font-size: 24px;
  color: white;
}
.preview-container:hover .preview-mask {
  opacity: 1;
}
.preview-thumb {
  max-height: 100%;
  max-width: 100%;

}
.full-btn {
  width: 100%;
  font-weight: bold;
  font-size: 16px;
}
.result-col {
  margin-top: 20px;
}
@media (min-width: 992px) {
  .result-col {
    margin-top: 0;
  }
}
.canvas-container {
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border: 1px solid #dcbfe6;
  transition: background-color 0.3s;
  position: relative;
  overflow: hidden;

  background-image:
    linear-gradient(45deg, #eee 25%, transparent 25%),
    linear-gradient(-45deg, #eee 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #eee 75%),
    linear-gradient(-45deg, transparent 75%, #eee 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  background-color: #fff;
}
.canvas-container.is-dark {
  background: #000 !important;
}
.result-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;

  filter: drop-shadow(0 0 5px rgba(0,0,0,0.1));
}
.footer-actions {
  margin-top: 20px;
  text-align: center;
}
.el-icon--upload {
  font-size: 60px;
  color: #a8abb2;
  margin-bottom: 10px;
  transition: color 0.3s;
}
.el-upload__text {
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
  text-align: center;
}
.el-upload__text small {
  color: #909399;
  font-size: 12px;
}
.upload-area:hover :deep(.el-icon--upload) {
  color: #409eff;
}
</style>
