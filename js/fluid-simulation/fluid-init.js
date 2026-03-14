/**
 * Fluid Simulation Initialization for Hexo Butterfly Theme
 * 流体模拟初始化脚本
 */

(function() {
    'use strict';

    // 读取配置
    const config = window.FLUID_CONFIG || {
        enable: true,
        mobile: false,
        z_index: -1,
        quality: 'medium',
        effects: { bloom: true, sunrays: true, shading: true, colorful: true },
        interaction: { enable: true }
    };

    // 检查是否启用
    if (!config.enable) {
        console.log('[Fluid Simulation] Disabled by config');
        return;
    }

    // 检测移动设备
    const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile && !config.mobile) {
        console.log('[Fluid Simulation] Disabled on mobile');
        return;
    }

    // WebGL支持检测
    function checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch(e) {
            return false;
        }
    }

    if (!checkWebGLSupport()) {
        console.warn('[Fluid Simulation] WebGL not supported');
        return;
    }

    // 初始化函数
    function initFluidSimulation() {
        // 创建Canvas元素
        const canvas = document.createElement('canvas');
        canvas.id = 'fluid-canvas';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: ${config.z_index};
            pointer-events: ${config.interaction && config.interaction.enable ? 'auto' : 'none'};
        `;

        // 插入到body最前面
        document.body.insertBefore(canvas, document.body.firstChild);

        // 由于原始script.js会自动初始化，我们只需要确保canvas存在
        console.log('[Fluid Simulation] Canvas created, waiting for core script to initialize');

        // 暴露canvas给全局，供core script使用
        window.FLUID_CANVAS = canvas;

        // PJAX支持（Butterfly主题的单页应用导航）
        if (typeof pjax !== 'undefined') {
            document.addEventListener('pjax:send', () => {
                if (window.fluidSimulator && window.fluidSimulator.pause) {
                    window.fluidSimulator.pause();
                }
            });
            document.addEventListener('pjax:complete', () => {
                if (window.fluidSimulator && window.fluidSimulator.resume) {
                    window.fluidSimulator.resume();
                }
            });
        }
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFluidSimulation);
    } else {
        initFluidSimulation();
    }

    console.log('[Fluid Simulation] Initialization script loaded');
})();
