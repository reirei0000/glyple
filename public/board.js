(function (exports) {
  'use strict';

  class Board {

    constructor() {}

    init(w, h) {
      var app = new PIXI.Application({
        width: w,
        height: h,
        backgroundColor: 0x000000,
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

    update(hits, particls, points, matches, mask, fail) {
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

      for (var i = 0; i < matches.length; ++i, ++i) {
        bg.lineStyle(8, 0xcab558).moveTo(
          matches[i][0], matches[i][1]).lineTo(matches[i + 1][0], matches[i + 1][1])
      }

      for (var i = 0; i < mask.length; ++i, ++i) {
        bg.lineStyle(8, 0x6aac64).moveTo(
          mask[i][0], mask[i][1]).lineTo(mask[i + 1][0], mask[i + 1][1])
      }

      if (points.length) {
        bg.lineStyle(8, 0x8080ff).moveTo(points[0][0], points[0][1])
        points.forEach(p => {
          bg.lineTo(p[0], p[1])
        })
      }

      for (var i = 0; i < fail.length; ++i, ++i) {
        bg.lineStyle(8, 0xff0000).moveTo(
          fail[i][0], fail[i][1]).lineTo(fail[i + 1][0], fail[i + 1][1])
      }
    }

  }

  exports.Board = Board;
})((this.window = this.window || {}));
