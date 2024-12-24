"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // code.ts
  var require_code = __commonJS({
    "code.ts"(exports) {
      figma.showUI(__html__, { width: 360, height: 800 });
      const currentFileName = figma.root.name;
      figma.ui.postMessage({ type: "init", fileName: currentFileName });
      figma.ui.onmessage = async (msg) => {
        if (msg.type === "create-gradient-cover") {
          const { title, subtitle, author, color1, color2, color3, color4, angle } = msg;
          // 验证标题
          if (!title || title.trim() === '') {
            figma.notify('Please enter a title');
            return;
          }
          try {
            const coverFrame = figma.createFrame();
            coverFrame.name = "Cover Frame";
            coverFrame.resize(1600, 900);
            coverFrame.layoutMode = "VERTICAL";
            coverFrame.primaryAxisAlignItems = "MIN";
            coverFrame.counterAxisAlignItems = "MIN";
            coverFrame.paddingLeft = 120;
            coverFrame.paddingRight = 120;
            coverFrame.paddingTop = 120;
            coverFrame.paddingBottom = 120;

            const angleInRadians = angle * Math.PI / 180;
            const gradientTransform = [
              [Math.cos(angleInRadians), Math.sin(angleInRadians), (1 - Math.cos(angleInRadians) - Math.sin(angleInRadians)) / 2],
              [-Math.sin(angleInRadians), Math.cos(angleInRadians), (1 + Math.sin(angleInRadians) - Math.cos(angleInRadians)) / 2]
            ];
            const gradientFill = {
              type: "GRADIENT_LINEAR",
              gradientTransform,
              gradientStops: [
                { position: 0, color: hexToRgb(color1) },
                { position: 0.33, color: hexToRgb(color2) },
                { position: 0.66, color: hexToRgb(color3) },
                { position: 1, color: hexToRgb(color4) }
              ]
            };
            coverFrame.fills = [gradientFill];

            const containerFrame = figma.createFrame();
            containerFrame.name = "Container Frame";
            containerFrame.layoutMode = "VERTICAL";
            containerFrame.primaryAxisAlignItems = "SPACE_BETWEEN";
            containerFrame.counterAxisAlignItems = "MIN";
            containerFrame.fills = [];
            containerFrame.layoutAlign = "STRETCH";
            containerFrame.layoutGrow = 1;
            containerFrame.itemSpacing = 20;

            await figma.loadFontAsync({ family: "Inter", style: "Regular" });
            await figma.loadFontAsync({ family: "Inter", style: "Bold" });

            const textFrame = figma.createFrame();
            textFrame.name = "Text Frame";
            textFrame.layoutMode = "VERTICAL";
            textFrame.primaryAxisAlignItems = "MIN";
            textFrame.counterAxisAlignItems = "MIN";
            textFrame.fills = [];
            textFrame.layoutAlign = "STRETCH";
            textFrame.itemSpacing = 32;

            const titleText = figma.createText();
            titleText.characters = title;
            titleText.fontSize = 128;
            titleText.fontName = { family: "Inter", style: "Bold" };
            titleText.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
            titleText.textAlignHorizontal = "LEFT";
            textFrame.appendChild(titleText);

            const subtitleText = figma.createText();
            subtitleText.characters = subtitle;
            subtitleText.fontSize = 64;
            subtitleText.fontName = { family: "Inter", style: "Regular" };
            subtitleText.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 }, opacity: 0.7 }];
            subtitleText.textAlignHorizontal = "LEFT";
            textFrame.appendChild(subtitleText);

            const dateText = figma.createText();
            dateText.characters = new Date().toISOString().split('T')[0];
            dateText.fontSize = 48;
            dateText.fontName = { family: "Inter", style: "Bold" };
            dateText.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 }, opacity: 0.7 }];
            dateText.textAlignHorizontal = "LEFT";
            textFrame.appendChild(dateText);

            containerFrame.appendChild(textFrame);

            const authorText = figma.createText();
            authorText.characters = "@" + author;
            authorText.fontSize = 48;
            authorText.fontName = { family: "Inter", style: "Bold" };
            authorText.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
            authorText.textAlignHorizontal = "LEFT";
            containerFrame.appendChild(authorText);

            coverFrame.appendChild(containerFrame);
            figma.currentPage.appendChild(coverFrame);
            figma.viewport.scrollAndZoomIntoView([coverFrame]);
          } catch (error) {
            figma.notify('Error creating gradient cover: ' + error.message);
          }
        } else if (msg.type === "cancel") {
          figma.closePlugin();
        }
      };
      function hexToRgb(hex) {
        const bigint = parseInt(hex.replace("#", ""), 16);
        const r = bigint >> 16 & 255;
        const g = bigint >> 8 & 255;
        const b = bigint & 255;
        return { r: r / 255, g: g / 255, b: b / 255, a: 1 };
      }
    }
  });
  require_code();
})();
