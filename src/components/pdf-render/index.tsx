// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { PdfLoader, PdfHighlighter, Tip, Highlight, Popup, AreaHighlight } from '../react-pdf-highlighter';
import { getNextId } from '../../utils';
import { Comment } from './type';

function PdfRender(props) {
  useEffect(() => {
    // 监听hash变化
    window.addEventListener('hashchange', scrollToHighlightFromHash, false);
  });

  useEffect(() => {
    // 合并父组件传递的highlights
    setHighlights([...highlights, ...(props.highlights ? props.highlights : [])]);
  }, [props.highlights]);

  // 高亮节点
  const [highlights, setHighlights] = useState([]);

  /*
   * 保存高亮
   */
  const addHighlight = (highlight: NewHighlight) => {
    setHighlights([{ ...highlight, id: getNextId() }, ...highlights]);
  };

  /*
   * 更新高亮
   */
  const updateHighlight = (highlightId: string, position: Object, content: Object) => {
    const res = highlights.map((h) => {
      const { id, position: originalPosition, content: originalContent, ...rest } = h;
      return id === highlightId
        ? {
            id,
            position: { ...originalPosition, ...position },
            content: { ...originalContent, ...content },
            ...rest
          }
        : h;
    });
    setHighlights(res);
  };

  /**
   * 根据hash路由改变， 滑动到高亮处
   * 此处用于点击中间模块的小圆圈，跳转到对应位置
   * */
  let scrollViewerTo = (highlight: any) => {};
  const scrollToHighlightFromHash = () => {
    const parseIdFromHash = () => document.location.hash.slice('#highlight-'.length);
    const getHighlightById = (id: string) => {
      return highlights.find((highlight) => highlight.id === id);
    };
    const highlight = getHighlightById(parseIdFromHash());
    if (parseIdFromHash() !== '' && highlight) {
      scrollViewerTo(highlight);
    }
  };

  /**
   * 查看高亮的提示组件
   * */
  const HighlightPopup = ({ comment }: Comment) =>
    comment.text ? (
      <div className="Highlight__popup">
        {comment.emoji} {comment.text}
      </div>
    ) : null;

  /**
   * PdfHighlighter配置
   * */
  const getPHCfg = (pdfDocument) => ({
    pdfDocument, // 渲染内容
    highlights, // 高亮节点
    onPhScroll: props.onPhScroll ? props.onPhScroll : () => {}, // 监听滚动
    onScrollChange() {
      console.log('onScrollChange');
    },
    scrollRef(scrollTo) {
      // 点击或者切换hash高亮跳转对应位置
      scrollViewerTo = scrollTo;
      scrollToHighlightFromHash();
    },
    onSelectionFinished(...p) {
      // 选中完成
      const [position, content, hideTipAndSelection, transformSelection] = p;
      return (
        <Tip
          onOpen={transformSelection}
          onConfirm={(comment) => {
            addHighlight({ content, position, comment });
            hideTipAndSelection();
          }}
        />
      );
    },
    highlightTransform(...p) {
      // 选中完成点击tip事件
      const [highlight, index, setTip, hideTip, viewportToScaled, screenshot, isScrolledTo] = p;
      const isTextHighlight = !Boolean(highlight.content && highlight.content.image);

      const component = isTextHighlight ? (
        <Highlight isScrolledTo={isScrolledTo} position={highlight.position} comment={highlight.comment} />
      ) : (
        <AreaHighlight
          isScrolledTo={isScrolledTo}
          highlight={highlight}
          onChange={(boundingRect) => {
            updateHighlight(highlight.id, { boundingRect: viewportToScaled(boundingRect) }, { image: screenshot(boundingRect) });
          }}
        />
      );
      return <Popup popupContent={<HighlightPopup {...highlight} />} onMouseOver={(popupContent) => setTip(highlight, (highlight) => popupContent)} onMouseOut={hideTip} key={index} children={component} />;
    }
  });
  return <PdfLoader url={props.url}>{(pdfDocument) => <PdfHighlighter {...getPHCfg(pdfDocument)} />}</PdfLoader>;
}

export default PdfRender;
