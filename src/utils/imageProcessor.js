export const loadImage = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    })
}
const calculateAspectFit = (img, canvasWidth, canvasHeight) => {
    const scaleWidth = canvasWidth / img.width;
    const scaleHeight = canvasHeight / img.height;

    const scale = Math.min(scaleWidth, scaleHeight);

    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;

    const x = (canvasWidth - drawWidth) / 2;
    const y = (canvasHeight - drawHeight) / 2;

    return { x, y, w: drawWidth, h: drawHeight };
}
export const generateMirgeTank = async (imgLight, imgDark) => {
    const width = Math.max(imgLight.width, imgDark.width);
    const height = Math.max(imgLight.height, imgDark.height);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    
    const lightMetrics = calculateAspectFit(imgLight, width, height);
    const xLight = lightMetrics.x;
    const yLight = lightMetrics.y;
    ctx.drawImage(imgLight, xLight, yLight, lightMetrics.w, lightMetrics.h);
    const lightData = ctx.getImageData(0, 0, width, height).data;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    
    const darkMetrics = calculateAspectFit(imgDark, width, height);
    const xDark = darkMetrics.x;
    const yDark = darkMetrics.y;
    ctx.drawImage(imgDark, xDark, yDark, darkMetrics.w, darkMetrics.h);
    const darkData = ctx.getImageData(0, 0, width, height).data;

    const resultImageData = ctx.createImageData(width, height);
    const resultData = resultImageData.data;

    for (let i = 0; i < resultData.length; i += 4) {
        const r1 = lightData[i], g1 = lightData[i + 1], b1 = lightData[i + 2];
        const lightGray = 0.299 * r1 + 0.587 * g1 + 0.114 * b1;

        const r2 = darkData[i], g2 = darkData[i + 1], b2 = darkData[i + 2];
        const darkGray = 0.299 * r2 + 0.587 * g2 + 0.114 * b2;

        const L_light = lightGray * 0.5 + 128;
        const L_Dark = darkGray * 0.5;

        let alpha = 255 - (L_light - L_Dark);
        let gray = 0;

        if (alpha > 0) {
            gray = (L_Dark * 255) / alpha;
        }

        resultData[i] = gray;
        resultData[i + 1] = gray;
        resultData[i + 2] = gray;
        resultData[i + 3] = alpha;
    }
    ctx.putImageData(resultImageData, 0, 0);
    return canvas.toDataURL('image/png');
}