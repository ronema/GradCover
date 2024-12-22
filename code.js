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
      var currentFileName = figma.root.name;
      figma.ui.postMessage({ type: "init", fileName: currentFileName });
      figma.ui.onmessage = (msg) => {
        if (msg.type === "create-gradient-cover") {
          const { title, subtitle, color1, color2, angle } = msg;
          const outerFrame = figma.createFrame();
          outerFrame.resize(1600, 900);
          outerFrame.layoutMode = "VERTICAL";
          outerFrame.primaryAxisAlignItems = "MIN";
          outerFrame.counterAxisAlignItems = "MIN";
          outerFrame.paddingLeft = 120;
          outerFrame.paddingRight = 120;
          outerFrame.paddingTop = 120;
          outerFrame.paddingBottom = 120;
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
              { position: 1, color: hexToRgb(color2) }
            ]
          };
          outerFrame.fills = [gradientFill];
          const contentFrame = figma.createFrame();
          contentFrame.resize(1600, 1);
          contentFrame.layoutMode = "VERTICAL";
          contentFrame.primaryAxisAlignItems = "MIN";
          contentFrame.counterAxisAlignItems = "MIN";
          contentFrame.fills = [];
          contentFrame.layoutAlign = "STRETCH";
          contentFrame.layoutGrow = 1;
          contentFrame.itemSpacing = 20;
          const loadFonts = () => __async(exports, null, function* () {
            yield figma.loadFontAsync({ family: "Inter", style: "Regular" });
            yield figma.loadFontAsync({ family: "Inter", style: "Bold" });
          });
          loadFonts().then(() => {
            const titleText = figma.createText();
            titleText.characters = title;
            titleText.fontSize = 128;
            titleText.fontName = { family: "Inter", style: "Bold" };
            titleText.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
            titleText.textAlignHorizontal = "LEFT";
            contentFrame.appendChild(titleText);
            const subtitleText = figma.createText();
            subtitleText.characters = subtitle;
            subtitleText.fontSize = 64;
            subtitleText.fontName = { family: "Inter", style: "Regular" };
            subtitleText.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
            subtitleText.textAlignHorizontal = "LEFT";
            contentFrame.appendChild(subtitleText);
            const dateText = figma.createText();
            dateText.characters = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
            dateText.fontSize = 48;
            dateText.fontName = { family: "Inter", style: "Bold" };
            dateText.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
            dateText.textAlignHorizontal = "LEFT";
            contentFrame.appendChild(dateText);
            outerFrame.appendChild(contentFrame);
            figma.currentPage.appendChild(outerFrame);
            figma.viewport.scrollAndZoomIntoView([outerFrame]);
            figma.closePlugin();
          });
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
