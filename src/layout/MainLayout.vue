<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Picture, Sunny, Menu as MenuIcon } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();

const isMobile = ref(false);
const drawerVisible = ref(false);

const checkScreenSize = () => {
    const width = window.innerWidth;
    isMobile.value = width <= 768;

    if (!isMobile.value) {
        drawerVisible.value = false;
    }
}
onMounted(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
});
onUnmounted(() => {
    window.removeEventListener('resize', checkScreenSize);
});
watch(() => route.path, () => {
    if (isMobile.value) {
        drawerVisible.value = false;
    }
});
const menuItems = [
    { index: '/mirage', icon: Picture, label: 'MirageTank' },
    { index: '/prism', icon: Sunny, label: 'PrismTank' },
]
</script>
<template>
    <el-container class="layout-container">
        <el-header v-if="isMobile" class="mobile-header">
            <div class="mobile-header-left">
                <el-button text @click="drawerVisible = true">
                    <el-icon :size="24"><MenuIcon /></el-icon>

                </el-button>
                <span class="mobile-title">图片工场</span>
            </div>
        </el-header>
        <el-aside v-if="!isMobile" width="200px" class="aside">
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
                <el-menu-item v-for="item in menuItems" :key="item.index" :index="item.index">
                    <el-icon><component :is="item.icon" /></el-icon>
                    <span>{{ item.label }}</span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-drawer
            v-model="drawerVisible"
            direction="ltr"
            size="70%"
            :with-header="false"
            class="mobile-drawer"
        >
            <div class="drawer-logo">
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
                <el-menu-item v-for="item in menuItems" :key="item.index" :index="item.index">
                    <el-icon><component :is="item.icon" /></el-icon>
                    <span>{{ item.label }}</span>
                </el-menu-item>
            </el-menu>
        </el-drawer>
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
    display: flex;
    flex-direction: column;
}
@media (min-width: 769px) {
    .layout-container {
        flex-direction: row;
    }
}
.aside {
    background-color: #1e1e1e;
    color: white;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #4c4d4f;
}
.logo ,.drawer-logo{
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #4c4d4f;
    background-color: #1e1e1e;
}
.logo h2, .drawer-logo h2 {
    margin: 0;
    color: #fff;
    font-size: 18px;
}
.el-menu-vertical {
    border-right: none;
    background-color: #1e1e1e;
}
.mobile-header {
    background-color: #1e1e1e;
    color: white;
    display: flex;
    align-items: center;
    padding: 0 10px;
    height: 50px;
    border-bottom: 1px solid #333;
}
.mobile-header-left {
    display: flex;
    align-items: center;
    gap: 10px;
}
.mobile-title {
    font-weight: bold;
    font-size: 16px;
}
.el-button--text {
    color: white;
}
:deep(.mobile-drawer) {
    background-color: #1e1e1e !important;
    color: white;
}
:deep(.el-drawer__body) {
    padding: 0;
    background-color: #1e1e1e;
}
.main-content {
    background-color: #141414;
    padding: 20px;
    overflow-y: auto;
    height: 100%;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>