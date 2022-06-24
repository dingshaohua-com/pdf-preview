// @ts-nocheck
import './App.less';
import React, { useRef, useState } from 'react';
import PdfRender from './components/pdf-render';
import { pdfUrl1, pdfUrl2, getCompareResult } from './utils/mock-data';
import { getHlightPostion } from './utils';
import cs from 'classnames';

const highlights = getCompareResult(); // mock高亮数据

function App() {
  // 右侧dom
  const rightDom = useRef();

  // 当前激活第几个高亮
  const [currentLight, setCurrentLight] = useState();

  /**
   * 监听左侧文档滚动
   * 同步设置中间高亮和右侧位置
   */
  const onPhScrollLeft = (event) => {
    //左侧滚动位置
    const { scrollTop } = event.target;
    // 遍历左侧高亮节点
    highlights.source.forEach((highlight, index) => {
      //计算左侧高亮元素所在坐标y
      const highlightPostion = getHlightPostion(highlight);
      // 如果当前滚动的位置 到达高亮位置附近
      if (scrollTop < highlightPostion + 80 && scrollTop > highlightPostion - 80) {
        console.log('目标位置到啦');
        //同步中间圆圈的激活状态
        setCurrentLight(index);
        // 关联滚动右侧同索引的高亮
        const rightHighlightPostion = getHlightPostion(highlights.target[index]);
        const rightPdf = rightDom.current.querySelector('.PdfHighlighter');
        rightPdf.scrollTo({ top: rightHighlightPostion, behavior: 'smooth' });
      }
    });
  };

  /**
   * 点击差异点时
   * 更改地址栏
   * 设置高亮圈
   * */
  const onClickDiff = (index, id) => {
    document.location.hash = `highlight-${id}`;
    setCurrentLight(index);
  };

  return (
    <div className="App">
      <div className="left">
        <PdfRender url={pdfUrl1} onPhScroll={onPhScrollLeft} highlights={highlights.source} />
      </div>
      <div className="center">
        {highlights.source.map(({id, position:{rects:[{backgroundColor}]}}, index) => {
          return (
            <div key={index} className={cs('item', { active: currentLight === index })} style={{ backgroundColor}} onClick={()=>{onClickDiff(index, id)}}>
              {index + 1}
            </div>
          );
        })}
      </div>
      <div className="right" ref={rightDom}>
        <PdfRender url={pdfUrl2} highlights={highlights.target} />
      </div>
    </div>
  );
}

export default App;
