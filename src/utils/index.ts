// @ts-nocheck

/**
 * 生成uuid
 * @returns 随机数
 */
export const getNextId = () => String(Math.random()).slice(2);

/**
 * 获取分页pdfPage的高度
 * @returns 高度
 */
export const getPdfPageHeight = () => {
  const pdfPageHeight = document.querySelector('.page').style.height.replace('px', '');
  return Number(pdfPageHeight);
};

/**
 * 获取高亮元素的位置信息 主要是y轴
 * @returns 高度
 */
export const getHlightPostion = (hlight: any) => {
  return hlight.position.boundingRect.y2 + getPdfPageHeight() * (hlight.position.boundingRect.pageNumber - 1);
};
