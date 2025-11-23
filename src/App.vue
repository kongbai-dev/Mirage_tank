<script setup>
import { ref } from 'vue';
import { loadImage, generateMirgeTank } from './utils/imageProcessor.js';
const imgLightSrc = ref(null);
const imgDarkSrc = ref(null);
const resultSrc = ref(null);
const isProcessing = ref(false);
const previewBg = ref('white');

let imgLightObj = null;
let imgDarkObj = null;

const handleFileChange = async (event, type) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const img = await loadImage(file);
    if (type === 'light') {
      imgLightObj = img;
      imgLightSrc.value = img.src;
    } else {
      imgDarkObj = img;
      imgDarkSrc.value = img.src;
    } 
  } catch (error) {
    console.error("图片加载失败", error);
    alert("图片加载失败，请重试。");
  }
};
const makeImages = async () => {
  if (!imgLightObj || !imgDarkObj) {
    alert("请先上传两张图片。")
    return;
  }

  isProcessing.value = true;

  setTimeout(async () => {
    try {
      resultSrc.value = await generateMirgeTank(imgLightObj, imgDarkObj);
    } catch (error) {
      console.error("图像处理失败", error);
      alert("图像处理失败，请重试。");
    } finally {
      isProcessing.value = false;
    }
  }, 100);
};

const toggleBg = () => {
  previewBg.value = previewBg.value === 'white' ? 'black' : 'white';
};

const downloadImage = () => {
  if (!resultSrc.value) return;
  const a = document.createElement('a');
  a.href = resultSrc.value;
  a.download = 'mirge_tank_result.png';
  a.click();
}
</script>

<template>
  <div class="container">
    <h1 class="title">Mirge Tank 图片生成器</h1>

    <div class="upload-section">
      <div class="upload-box">
      <h3>表层图片</h3>
      <input type="file" accept="image/*" @change="(e) => handleFileChange(e,'light')"/>
      <div class="preview" v-if="imgLightSrc">
        <img :src="imgLightSrc" alt="表图预览"/>
      </div>
    </div>

      <div class="upload-box">
      <h3>里层图片</h3>
      <input type="file" accept="image/*" @change="(e) => handleFileChange(e, 'dark')" />
      <div class="preview" v-if="imgDarkSrc">
        <img :src="imgDarkSrc" alt="里图预览" />
      </div>
    </div>
    </div>

    

    

    <div class="actions">
      <button @click="makeImages" :disabled="isProcessing || !imgLightSrc || !imgDarkSrc">
        {{ isProcessing ? '合成中...' : '生成幻影坦克' }}
      </button>
    </div>

    <div class="result-section" v-if="resultSrc">
      <h3>生成结果</h3>
      <p class="tip">点击下方按钮切换背景色预览，点击图片下载</p>
      
      <div class="toggle-bar">
        <button @click="toggleBg">切换背景色 (当前: {{ previewBg === 'white' ? '白' : '黑' }})</button>
      </div>

      <div 
        class="result-canvas" 
        :style="{ backgroundColor: previewBg }"
        @click="downloadImage"
        title="点击下载"
      >
        <img :src="resultSrc" class="final-image" />
      </div>
    </div>
  </div>

</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  text-align: center;
}

.upload-section {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.upload-box {
  border: 2px dashed #ccc;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
}

.preview img {
  max-width: 100%;
  max-height: 200px;
  margin-top: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #3aa876;
}

.result-section {
  margin-top: 40px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.result-canvas {
  display: inline-block;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.final-image {
  max-width: 100%;
  max-height: 400px;
}

.toggle-bar {
  margin-bottom: 10px;
}

.toggle-bar button {
  background-color: #666;
  font-size: 14px;
  padding: 5px 10px;
}
</style>
