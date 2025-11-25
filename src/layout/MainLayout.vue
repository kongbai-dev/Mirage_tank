<script setup>
import { useRoute } from 'vue-router';
import { Picture, Sunny } from '@element-plus/icons-vue';

const route = useRoute();
</script>
<template>
    <el-container class="layout-container">
        <el-aside width="200px" class="aside">
            <div class="logo">
                <h2>🏭 图片工场</h2>
            </div>
            <el-menu 
                :default-active="route.path"
                class="el-menu-vertical"
                router
                background-color="#1e1e1e"
                text-color="#fff"
                active-text-color="#409EFF"
                >
                <el-menu-item index="/mirage">
                    <el-icon><Picture /></el-icon>
                    <span>MirageTank</span>
                </el-menu-item>
                <el-menu-item index="/prism">
                    <el-icon><Sunny /></el-icon>
                    <span>PrismTank</span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-container class="main-content">
            <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                    <component :is="Component"/>
                </transition>
            </router-view>
        </el-container>
    </el-container>
</template>
<style scoped>
.layout-container {
    height: 100vh;
}
.aside {
    background-color: #1e1e1e;
    color: white;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #4c4d4f;
}
.logo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #4c4d4f;
}
.logo h2 {
    margin: 0;
    color: #fff;
    font-size: 18px;
}
.el-menu-vertical {
    border-right: none;
}
.main-content {
    background-color: #141414;
    padding: 20px;
    overflow: hidden;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>