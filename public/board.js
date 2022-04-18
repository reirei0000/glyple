(function (exports) {
  'use strict';

  function drawDash(target, x1, y1, x2, y2, dashLength = 5, spaceLength = 5) {
    let x = x2 - x1;
    let y = y2 - y1;
    let hyp = Math.sqrt((x) * (x) + (y) * (y));
    let units = hyp / (dashLength + spaceLength);
    let dashSpaceRatio = dashLength / (dashLength + spaceLength);
    let dashX = (x / units) * dashSpaceRatio;
    let spaceX = (x / units) - dashX;
    let dashY = (y / units) * dashSpaceRatio;
    let spaceY = (y / units) - dashY;
    target.moveTo(x1, y1);
    while (hyp > 0) {
      x1 += dashX;
      y1 += dashY;
      hyp -= dashLength;
      if (hyp < 0) {
        x1 = x2;
        y1 = y2;
      }
      target.lineTo(x1, y1);
      x1 += spaceX;
      y1 += spaceY;
      target.moveTo(x1, y1);
      hyp -= spaceLength;
    }
    target.moveTo(x2, y2);
  }

  class Board {

    constructor() {}

    init(w, h) {
      var app = new PIXI.Application({
        width: w,
        height: h,
        backgroundColor: 0x000000,
        preserveDrawingBuffer: true
      });
      // app.view.style.cssText =
        // "position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);";
      app.view.style.width = "100vmin";
      app.view.style.height = "100vmin";

      this._stage = app.stage;

      this._container = new PIXI.Container();

      this._glyph_bg = PIXI.Sprite.from('./resources/bg500.png')
      this._stage.addChild(this._glyph_bg)

      const bg = new PIXI.Graphics();
      this._bg = bg;
      this._container.addChild(bg);
      this._stage.addChild(this._container)


      return app;
    }

    update(cmode, hits, particls, points, matches, mask, fail) {
      var LINE_WIDTH = 16;
      var bg = this._bg;
      bg.clear();
      bg.lineStyle(0, 0x000000);
      bg.beginFill(0x000000);
      bg.drawRect(0, 0, this._bg.width, this._bg.height);
      bg.endFill();
      bg.alpha = 0.8

      hits.forEach(p => {
        bg.beginFill(0xff00ff)
        bg.drawCircle(p[0], p[1], p[2])
        bg.endFill()
      })

      particls.forEach(p => {
        bg.beginFill(0xeeeeff)
        bg.drawCircle(p[0], p[1], p[2] / 10)
        bg.endFill()
      })

      bg.beginFill(0xffffff)
      points.forEach(p => {
        bg.drawCircle(p[0], p[1], 12)
      })
      bg.endFill()

      if (cmode == 'color') {
        for (var i = 0; i < matches.length; ++i, ++i) {
          bg.lineStyle({width: LINE_WIDTH, color: 0xcab558, cap: 'round'}).moveTo(
            matches[i][0], matches[i][1]).lineTo(matches[i + 1][0], matches[i + 1][1])
        }

        for (var i = 0; i < mask.length; ++i, ++i) {
          bg.lineStyle({width: LINE_WIDTH, color: 0x6aac64, cap: 'round'}).moveTo(
            mask[i][0], mask[i][1]).lineTo(mask[i + 1][0], mask[i + 1][1])
        }

        if (points.length) {
          bg.lineStyle({width: LINE_WIDTH, color: 0x8080ff, cap: 'round'}).moveTo(points[0][0], points[0][1])
          points.forEach(p => {
            bg.lineTo(p[0], p[1])
          })
        }

        for (var i = 0; i < fail.length; ++i, ++i) {
          bg.lineStyle({width: LINE_WIDTH, color: 0xfd7e00, cap: 'round'}).moveTo(
            fail[i][0], fail[i][1]).lineTo(fail[i + 1][0], fail[i + 1][1])
        }
      } else {
        for (var i = 0; i < matches.length; ++i, ++i) {
          var target = bg.lineStyle({width: LINE_WIDTH, color: 0xcab558, cap: 'round', alpha: 0.8})
          drawDash(
            target, matches[i][0], matches[i][1], matches[i + 1][0], matches[i + 1][1],
            1, 20)
        }

        bg.alpha = 1
        for (var i = 0; i < mask.length; ++i, ++i) {
          bg.lineStyle({width: LINE_WIDTH, color: 0x6aac64, cap: 'round'}).moveTo(
            mask[i][0], mask[i][1]).lineTo(mask[i + 1][0], mask[i + 1][1])
        }

        if (points.length) {
          bg.lineStyle({width: LINE_WIDTH, color: 0xa0a0ff, cap: 'round'}).moveTo(points[0][0], points[0][1])
          points.forEach(p => {
            bg.lineTo(p[0], p[1])
          })
        }

        for (var i = 0; i < fail.length; ++i, ++i) {
          bg.lineStyle({width: LINE_WIDTH, color: 0xffffff, cap: 'round'}).moveTo(
            fail[i][0], fail[i][1]).lineTo(fail[i + 1][0], fail[i + 1][1])
        }
        for (var i = 0; i < fail.length; ++i, ++i) {
          bg.lineStyle({width: LINE_WIDTH * 8 / 10, color: 0xfd7e00, cap: 'round'}).moveTo(
            fail[i][0], fail[i][1]).lineTo(fail[i + 1][0], fail[i + 1][1])
        }
      }
    }

  }

  exports.Board = Board;
})((this.window = this.window || {}));
