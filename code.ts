/// <reference types="@figma/plugin-typings" />

// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// Show the plugin UI with a specific size
figma.showUI(__html__, { width: 360, height: 800 });

// Get current file name and send it to UI
const currentFileName = figma.root.name;
figma.ui.postMessage({ type: 'init', fileName: currentFileName });

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
type Message = 
  | { type: 'create-gradient-cover', title: string, subtitle: string, color1: string, color2: string, angle: number }
  | { type: 'cancel' };

figma.ui.onmessage = (msg: Message) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'create-gradient-cover') {
    const { title, subtitle, color1, color2, angle } = msg;

    // 创建外层 Frame (1600x900)
    const outerFrame = figma.createFrame();
    outerFrame.resize(1600, 900);
    outerFrame.layoutMode = 'VERTICAL';  // 改为垂直布局
    outerFrame.primaryAxisAlignItems = 'MIN';  // 顶部对齐
    outerFrame.counterAxisAlignItems = 'MIN';  // 左对齐
    outerFrame.paddingLeft = 120;
    outerFrame.paddingRight = 120;
    outerFrame.paddingTop = 120;
    outerFrame.paddingBottom = 120;

    // 计算渐变角度的变换矩阵
    const angleInRadians = (angle * Math.PI) / 180;
    const gradientTransform = [
      [Math.cos(angleInRadians), Math.sin(angleInRadians), (1 - Math.cos(angleInRadians) - Math.sin(angleInRadians)) / 2],
      [-Math.sin(angleInRadians), Math.cos(angleInRadians), (1 + Math.sin(angleInRadians) - Math.cos(angleInRadians)) / 2]
    ];

    // 设置渐变背景
    const gradientFill: GradientPaint = {
      type: 'GRADIENT_LINEAR',
      gradientTransform,
      gradientStops: [
        { position: 0, color: hexToRgb(color1) },
        { position: 1, color: hexToRgb(color2) }
      ]
    };
    outerFrame.fills = [gradientFill];

    // 创建内容 Frame
    const contentFrame = figma.createFrame();
    contentFrame.resize(1600, 1); 
    contentFrame.layoutMode = 'VERTICAL';
    contentFrame.primaryAxisAlignItems = 'MIN';
    contentFrame.counterAxisAlignItems = 'MIN';
    contentFrame.fills = [];
    contentFrame.layoutAlign = 'STRETCH';
    contentFrame.layoutGrow = 1;
    contentFrame.itemSpacing = 20;

    // 加载字体
    const loadFonts = async () => {
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      await figma.loadFontAsync({ family: "Inter", style: "Bold" });
    };

    loadFonts().then(() => {
      // 添加标题文本
      const titleText = figma.createText();
      titleText.characters = title;
      titleText.fontSize = 128;
      titleText.fontName = { family: "Inter", style: "Bold" };
      titleText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      titleText.textAlignHorizontal = 'LEFT';
      contentFrame.appendChild(titleText);

      // 添加副标题文本
      const subtitleText = figma.createText();
      subtitleText.characters = subtitle;
      subtitleText.fontSize = 64;
      subtitleText.fontName = { family: "Inter", style: "Regular" };
      subtitleText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      subtitleText.textAlignHorizontal = 'LEFT';
      contentFrame.appendChild(subtitleText);

      // 添加日期文本
      const dateText = figma.createText();
      dateText.characters = new Date().toISOString().split('T')[0];
      dateText.fontSize = 48;
      dateText.fontName = { family: "Inter", style: "Bold" };
      dateText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      dateText.textAlignHorizontal = 'LEFT';
      contentFrame.appendChild(dateText);

      // 将内容 Frame 添加到外层 Frame
      outerFrame.appendChild(contentFrame);
      
      // 将外层 Frame 添加到页面
      figma.currentPage.appendChild(outerFrame);
      figma.viewport.scrollAndZoomIntoView([outerFrame]);
      figma.closePlugin();
    });
  } else if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};

function hexToRgb(hex: string): RGBA {
  const bigint = parseInt(hex.replace('#', ''), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r: r / 255, g: g / 255, b: b / 255, a: 1 };
}
