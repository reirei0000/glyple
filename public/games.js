(function (exports) {
  'use strict';

  const WIDTH = 500;
  const HEIGHT = 500;
  var board;
  var particls = []
  var passes = []
  var question = ''
  var answers = []
  var matches = []
  var mask = []
  var fail = []
  var hits = []

  var curx;
  var cury;

  var colormode = 'color';

  function getMode() {
    var cookies = document.cookie;
    var cookiesArray = cookies.split(';');
    var v = 'color';

    for (var c of cookiesArray) {
      var cArray = c.split('=');
      if (cArray[0].trim() == 'colormode') {
        v = cArray[1]
      }
    }

    return v;
  }

  function setMode(mode) {
    document.cookie = `colormode=${mode}`;
  }

  function setColorMode() {
    var mode = document.getElementById('mode');
    var cmode = getMode();
    if (cmode == 'color') {
      mode.innerText = '🎨'
    } else {
      mode.innerText = '✏️'
    }
    setMode(cmode)
    colormode = cmode;
  }

  function onLoad() {
    board = new Board();

    setColorMode();

    function changeColorMode() {
      var cmode = getMode();
      if (cmode == 'color')
        cmode = 'mono';
      else
        cmode = 'color';
      setMode(cmode);
      setColorMode();
    }
    document.getElementById('mode').addEventListener('click', changeColorMode)

    var app = board.init(WIDTH, HEIGHT);
    document.getElementById('board-container').appendChild(app.view);

    question = glyphs[Math.floor(Math.random() * glyphs.length)]

    function passPoint(x, y) {
      var r = 25;
      var cp = Object.keys(gpoints).filter(k => {
        var xx = gpoints[k][0] * WIDTH;
        var yy = gpoints[k][1] * HEIGHT;
        return ((xx - r  < x) && (x < xx + r) && (yy - r < y) && (y < yy + r))
      })
      if (cp.length == 0) {
        return false
      }
      if (passes.length > 0 && passes.slice(-1)[0] == cp[0]) {
        return false
      }

      var k = cp[0]
      hits.push([gpoints[k][0] * WIDTH, gpoints[k][1] * HEIGHT, 0]);
      passes.push(k)
      return true
    }
    function addParticls(x, y, r) {
      particls.push(
        [x + Math.floor(Math.random() * 10 - 5),
         y + Math.random() * 10 - 5, r])
    }
    app.view.addEventListener("touchmove", (e) => {
      var x = e.touches[0].pageX-e.target.getBoundingClientRect().left;
      var y = e.touches[0].pageY-e.target.getBoundingClientRect().top;
      curx = parseInt((x * WIDTH) / e.srcElement.clientWidth);
      cury = parseInt((y * HEIGHT) / e.srcElement.clientHeight);
      addParticls(curx, cury, 100);
      passPoint(curx, cury)
    });
    app.view.addEventListener("pointermove", (e) => {
      curx = parseInt((e.offsetX * WIDTH) / e.srcElement.clientWidth);
      cury = parseInt((e.offsetY * HEIGHT) / e.srcElement.clientHeight);
      if (e.pressure) {
        addParticls(curx, cury, 100);
        passPoint(curx, cury)
      }
    });
    app.view.addEventListener("pointerdown", (e) => {
      particls = []
      passes = []
    });

    app.view.addEventListener("pointerup", (e) => {
      console.log(`up`);
      if (passes.length < 2)
        return

      function normalize_path(path) {
        var normalized = [];
        for (var i = 0; i < path.length - 1; ++i) {
          var a = path[i];
          var b = path[i + 1];
          var c;
          if (a > b)
            c = b + a;
          else
            c = a + b;
          normalized.push(c)
        }
        return [... new Set(normalized)].sort().reduce((a, b) => a + b)
      }

      var normalized_path = normalize_path(passes)
      var match_glyph = glyphs.filter(g => g[0] == normalized_path)
      if (match_glyph.length == 0) {
        let b = document.querySelector('body')
        b.className = 'shake'
        setTimeout(()=>{
          let b = document.querySelector('body')
          b.className = 'body'
        }, 1000)
        return
      }

      var rid = document.getElementById('result')
      rid.textContent = match_glyph[0][1]

      answers.push(match_glyph[0])

      var answers_path = [''].concat(answers.map(p => p[0])).reduce((a, b) => a + b)
      matches = [...answers_path].map(p => [gpoints[p][0] * WIDTH, gpoints[p][1] * HEIGHT])

      mask = createMask(question[0], answers_path).map(p => [gpoints[p][0] * WIDTH, gpoints[p][1] * HEIGHT])

      var aid = document.getElementById(`answer${answers.length}`)
      if (match_glyph[0][0] == question[0]) {
        aid.src = './resources/bg_atari_mono.png'
        return
      }

      if (mask.length > 0) {
        aid.src = './resources/bg_succ_mono.png'
      } else {
        aid.src = './resources/bg_fail_mono.png'
      }

      if (answers.length == 6) {
        fail = [...question[0]].map(p => [gpoints[p][0] * WIDTH, gpoints[p][1] * HEIGHT])
        var fid = document.getElementById('fail_result')
        rid.textContent = `${match_glyph[0][1]}`
        rid.style = 'text-decoration: line-through;'
        fid.textContent = question[1]
      }

      console.log(match_glyph)
      console.log(question)
      console.log(answers)
    });
    app.view.addEventListener("pointerup", (e) => {
      curx = parseInt((e.offsetX * WIDTH) / e.srcElement.clientWidth);
      cury = parseInt((e.offsetY * HEIGHT) / e.srcElement.clientHeight);
    });

    requestAnimationFrame(update);
  }

  function createMask(question, answer) {
    var points = '';
    var q = [...question];
    var a = [...answer];

    for (var i = 0; i < q.length; ++i, ++i) {
      var q1 = q[i];
      var q2 = q[i + 1];
      for (var j = 0; j < a.length; ++j, ++j) {
        var a1 = a[j];
        var a2 = a[j + 1];
        if ((a1 == q1 && a2 == q2) || (a1 == q2 && a2 == q1)) {
          points += `${q1}${q2}`
        }
      }
    }

    return [...points];
  }

  function update() {
    requestAnimationFrame(update);
    hits = hits.map(p => [p[0], p[1], p[2] + 5]).filter(p => p[2] < 60);
    particls = particls.map(p => [p[0], p[1], p[2] - 1]).filter(p => p[2] - 1);
    if (particls.length == 0)
      passes = []
    var points = passes.map(p => [gpoints[p][0] * WIDTH, gpoints[p][1] * HEIGHT])
    board.update(colormode, hits, particls, points, matches, mask, fail);
  }

  exports.onLoad = onLoad;
})((this.window = this.window || {}));
