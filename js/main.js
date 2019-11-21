import Generation from './Generation.js';

// キャンバスを白に塗りつぶす
const resetCanvas = () => {
  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgba(255, 255, 255)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }
}

// グリッド線を引く
// 三つの頂点を直線で繋いだ三角形をcanvasに描画する
const drawGrid = () => {
  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    const STEP = 100;
    for (let w = 0; w < WIDTH + 1; w += STEP) {
      ctx.moveTo(w, 0);
      ctx.lineTo(w, HEIGHT);
    }
    for (let h = 0; h < HEIGHT + 1; h += STEP) {
      ctx.moveTo(0, h);
      ctx.lineTo(WIDTH, h);
    }
    ctx.closePath();

    ctx.strokeStyle = "rgb(0,0,0)"; //枠線の色
    ctx.stroke();

    ctx.fillStyle = "rgba(0,0,255,0.1)";//塗りつぶしの色
    ctx.fill();
  }
}

// 三つの頂点を直線で繋いだ三角形をcanvasに描画する
// y軸は反転させて表示させる（y = HEIGHT - y')
const drawTriangle = (triangle) => {
  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(triangle.vertexes.A.x1, HEIGHT - triangle.vertexes.A.y1); //最初の点の場所
    ctx.lineTo(triangle.vertexes.B.x2, HEIGHT - triangle.vertexes.B.y2); //2番目の点の場所
    ctx.lineTo(triangle.vertexes.C.x3, HEIGHT - triangle.vertexes.C.y3); //3番目の点の場所
    ctx.closePath();	//三角形の最後の線 closeさせる

    ctx.strokeStyle = "rgb(0,0,0)"; //枠線の色
    ctx.stroke();

    ctx.fillStyle = "rgba(0,0,255,0.1)";//塗りつぶしの色
    ctx.fill();

    ctx.font = "48px serif";
    ctx.fillText("A", triangle.vertexes.A.x1, HEIGHT - triangle.vertexes.A.y1);
    ctx.fillText("B", triangle.vertexes.B.x2, HEIGHT - triangle.vertexes.B.y2);
    ctx.fillText("C", triangle.vertexes.C.x3, HEIGHT - triangle.vertexes.C.y3);
  }
}


// ゼロ埋めで3桁にする
const paddingZero = (num) => {
  return ("000" + num).slice(-3);
}

// 三角形のプロパティを表に出力する
const outputTriangle = (triangle) => {
  // 計算結果を出力する
  $('#vertex_A').text(
    `x1: ${paddingZero(triangle.vertexes.A.x1)},
     y1: ${paddingZero(triangle.vertexes.A.y1)}`
  );
  $('#vertex_B').text(
    `x2: ${paddingZero(triangle.vertexes.B.x2)},
     y2: ${paddingZero(triangle.vertexes.B.y2)}`
  );
  $('#vertex_C').text(
    `x3: ${paddingZero(triangle.vertexes.C.x3)},
     y3: ${paddingZero(triangle.vertexes.C.y3)}`
  );
  $('#side_a').text(Math.floor(triangle.sides.a));
  $('#side_b').text(Math.floor(triangle.sides.b));
  $('#side_c').text(Math.floor(triangle.sides.c));
  $('#sum_sides').text(
    (triangle.sum_sides < $('#input_sum_sides').val()) ?
      Math.ceil(triangle.sum_sides) :
      Math.floor(triangle.sum_sides)
  );
  $('#area').text(Math.floor(triangle.area));
}

const start = () => {
  let generation_size = $('#input_generation_size').val();
  let generation = new Generation(generation_size);
  generation.updateGeneration();
  dataPoints = generation.fitnessPoints;

  // 三角形の描画
  let best_triangle = generation.latest_population.best_triangle;
  drawTriangle(best_triangle);
  outputTriangle(best_triangle);
}

const chartContainer = document.querySelector('#chartContainer');
const drawChart = () => {
  if (chartContainer) {
    let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      theme: "light1",
      axisX: {
        includeZero: false,
        minimum: 1
      },
      axisY: {
        includeZero: false
      },
      data: [{
        type: "line",
        dataPoints: dataPoints
      }]
    });
    chart.render();
  }
}

// rangeslider用
$(function () {
  const $document = $(document);
  const $inputRange = $('input[type="range"]');
  $inputRange.rangeslider({

    // Feature detection the default is `true`.
    // Set this to `false` if you want to use
    // the polyfill also in Browsers which support
    // the native <input type="range"> element.
    polyfill: false,

    // Default CSS classes
    rangeClass: 'rangeslider',
    disabledClass: 'rangeslider--disabled',
    horizontalClass: 'rangeslider--horizontal',
    verticalClass: 'rangeslider--vertical',
    fillClass: 'rangeslider__fill',
    handleClass: 'rangeslider__handle',

    // Callback function
    onInit: function () { },

    // Callback function
    onSlide: function (position, value) { },

    // Callback function
    onSlideEnd: function (position, value) { }
  });

  const valueOutput = (element) => {
    var value = element.value,
      output = element.parentNode.getElementsByTagName('output')[0];
    output.innerHTML = value;
  }
  for (var i = $inputRange.length - 1; i >= 0; i--) {
    valueOutput($inputRange[i]);
  };
  $document.on('input', 'input[type="range"]', function (e) {
    valueOutput(e.target);
  });
});

$('#generate').click(() => {
  resetCanvas();
  drawGrid();
  start();
  drawChart();
}
);

const init = () => {
  window.onload = () => {
    drawGrid();
    drawChart();
  }
}

init();