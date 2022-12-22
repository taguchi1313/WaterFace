// スタート画面
let start = false;
// イージング
const e  = function (t) {return 1-(--t)*t*t*t};
// マイク
let mic;
let v;
// 音素材
let bgm_00,bgm_01,bgm_02,bgm_03;
let sound = [];
let soundVol = 0.03;
// 音楽カウント
let bgmCount,bgmPart;
let bgmCountSet = 30*3.8;
// マウスカウント
let mouseCount = 0;
let mouseXY = [];
// パーツ
let ripple = [];
let wave = [];
let stream = [];
let stream_goal = [];
let stream_mainCount = 0;
let stream_xyPoint = [[],[]];
let bubble = [];
// 自動描画のタイミング調整用変数
let waveCount, waveTiming;
// 放置モード
let sleep,sleepCount;
let previousMouse = false;


// --------------------
// 音素材のロード
// --------------------
function preload() {
  soundFormats('mp3');
  bgm_00 = loadSound('assets/bgm/bgm_00');
  bgm_01 = loadSound('assets/bgm/bgm_01');
  bgm_02 = loadSound('assets/bgm/bgm_02');
  bgm_03 = loadSound('assets/bgm/bgm_03');
  sound[0] = loadSound('assets/sound/sound_000');
  sound[1] = loadSound('assets/sound/sound_001');
  //sound[2] = loadSound('assets/sound/sound_002');
  //sound[3] = loadSound('assets/sound/sound_003');
  sound[4] = loadSound('assets/sound/sound_004');
  sound[5] = loadSound('assets/sound/sound_005');
  sound[10] = loadSound('assets/sound/sound_010');
  sound[11] = loadSound('assets/sound/sound_011');
  //sound[12] = loadSound('assets/sound/sound_012');
  //sound[13] = loadSound('assets/sound/sound_013');
  sound[14] = loadSound('assets/sound/sound_014');
  sound[15] = loadSound('assets/sound/sound_015');
  sound[20] = loadSound('assets/sound/sound_020');
  sound[21] = loadSound('assets/sound/sound_021');
  //sound[22] = loadSound('assets/sound/sound_022');
  //sound[23] = loadSound('assets/sound/sound_023');
  sound[24] = loadSound('assets/sound/sound_024');
  sound[25] = loadSound('assets/sound/sound_025');
  sound[30] = loadSound('assets/sound/sound_030');
  sound[31] = loadSound('assets/sound/sound_031');
  //sound[32] = loadSound('assets/sound/sound_032');
  //sound[33] = loadSound('assets/sound/sound_033');
  sound[34] = loadSound('assets/sound/sound_034');
  sound[35] = loadSound('assets/sound/sound_035');
  sound[100] = loadSound('assets/sound/sound_100');
  sound[101] = loadSound('assets/sound/sound_101');
  sound[102] = loadSound('assets/sound/sound_102');
  sound[110] = loadSound('assets/sound/sound_110');
  sound[111] = loadSound('assets/sound/sound_111');
  sound[112] = loadSound('assets/sound/sound_112');
  sound[120] = loadSound('assets/sound/sound_120');
  sound[121] = loadSound('assets/sound/sound_121');
  sound[122] = loadSound('assets/sound/sound_122');
  sound[130] = loadSound('assets/sound/sound_130');
  sound[131] = loadSound('assets/sound/sound_131');
  sound[132] = loadSound('assets/sound/sound_132');
  sound[200] = loadSound('assets/sound/sound_200');
  sound[210] = loadSound('assets/sound/sound_210');
  sound[220] = loadSound('assets/sound/sound_220');
  sound[230] = loadSound('assets/sound/sound_230');
}

//--------------------
// 初回起動
//--------------------
function setup() {
  // 基本設定
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 100);
  frameRate(30);
  sleep = false;
  // マイク設定
  mic = new p5.AudioIn();
  v = 0;
  // wave設定
  waveTiming = int(random(4, 6) * 30);
  waveCount = 0;
  bgmCount = 0;
  // sleep設定
  sleepCount = 0;
}


//--------------------
// Draw
//--------------------
function draw() {
  background(0);
  if(start){
    mainDraw();
    touchOnOff();
  }
}


//--------------------
// touchOnOff
//--------------------
function touchOnOff(){
  let a = 0;
  let b = 0;
  if(mouseIsPressed){a=10;}
  if(previousMouse){b=1;}
  
  switch(a+b){
    case 10: touchOnMoment(); break;
    case 01: touchOffMoment(); break;
    case 11: touchOnLong(); break;
    case 0: touchOffLong(); break;
  }
  previousMouse = mouseIsPressed;
}

//--------------------
// touchOnOff クリックした瞬間
//--------------------
function touchOnMoment(){
  // 記録
  mouseXY = [mouseX, mouseY];
  // スリープモードをオフ
  if(sleep){sleep = false;} 
}

//--------------------
// touchOnOff 離した瞬間
//--------------------
function touchOffMoment(){
  if(mouseCount < 5 && stream.length < 7){
    toutchDraw("stream");
  }else{
    toutchDraw("ripple");
  }
  mouseCount=0;
}

//--------------------
// touchOnOff 長押し
//--------------------
function touchOnLong(){
  let a = dist(mouseX, mouseY, mouseXY[0], mouseXY[1]);
  if(a > 10){
    toutchDraw("bubble");
  }
  // 記録
  mouseCount++;
  mouseXY = [mouseX, mouseY];
}

//--------------------
// touchOnOff 押してない
//--------------------
function touchOffLong(){
  // 非スリープモード
  if(!sleep){
    sleepCount++;
    if(sleepCount > bgmCountSet*8){
      sleep = true;
      sleepCount = 0;
    }
  // スリープモード
  }else if(sleep){
    let i = (bgmCount-int(bgmCountSet/4))%bgmCountSet == 0;
    let ii = (bgmCount+int(bgmCountSet/2))%bgmCountSet == 0;
    let iii = (bgmCount+int(bgmCountSet/4))%bgmCountSet == 0;
    if(i || ii){
      if (random() < 0.2){
        let x = random(width/5,width/5*4);
        let y = random(height/4,height/3*2);
        waterStream_push(x,y);
        waterRipple_push(x,y);
      } 
    }
  }
}

//--------------------
// 初クリック
//--------------------
function firstClick(){
  start = true;
  waterRipple_push(mouseX,mouseY);
  mic.start(); // マイク開始
  bgmPart = 0; // BGM設定
  touchSound(1);
}

//--------------------------
// toutchDraw
//--------------------------
function toutchDraw(type){
  switch(type){
    case "ripple":
      waterRipple_push(mouseX,mouseY);
      touchSound(0);
      break;
    case "stream":
      waterStream_push(mouseX,mouseY);
      waterRipple_push(mouseX,mouseY);
      break;
    case "bubble":
      waterBubble_push(random(mouseX-100,mouseX+100),random(mouseY-20,mouseY+150));
  }
}

//--------------------------
// mainDraw
//--------------------------
function mainDraw(){
  let micVolume = mic.getLevel();
  
  if (v < micVolume) {
    v = micVolume;
  }

  // waterPartsDrawing
  waterStream_draw();
  waterWave_draw();
  waterRipple_draw();
  waterBubble_draw();
  
  // waterPatsPush
  waterWave_push(v);
  
  // bgmCount
  if(bgmCount>bgmCountSet*4){bgmCount=0;}
  switch(bgmCount){
    case 0:
      bgm_00.play(0,1,soundVol*0.5);
      bgmPart = 0;
      break;
    case bgmCountSet:
      bgm_01.play(0,1,soundVol*0.5);
      bgmPart = 1;
      break;
    case bgmCountSet*2:
      bgm_02.play(0,1,soundVol*0.5);
      bgmPart = 2;
      break;
    case bgmCountSet*3:
      bgm_03.play(0,1,soundVol*0.5);
      bgmPart = 3;
      break;
  } bgmCount ++;
}



//--------------------------
// toutchSound
//--------------------------
function touchSound(type){
  let a;
  let soundPlay = true;
  switch(type){
    case 0:
      a = random([0,1,/*2,*//*3,*/4,5]);break;
    case 1:
      a = random([0,1,2]); break;
    case 2:
      a = 0;
      if(
        sound[200].isPlaying() || 
        sound[210].isPlaying() || 
        sound[220].isPlaying() || 
        sound[230].isPlaying() 
        ) {
        soundPlay = false;
      }
  }
  if(soundPlay){
    let soundType = type*100 + bgmPart*10 + a;
    sound[soundType].play(0,1,soundVol*1);
  }
  
}


//--------------------------
// WaterStream
//--------------------------

function waterStream_push(mX, mY) { 
  let branchSwitch = [0,0,0,0,0,0];
  
  for(let i = 0; i < stream.length; i++){
    for(let j = 0; j < stream[i].xPoint.length; j++ ){
      let x = stream[i].xPoint[j];
      let y = stream[i].yPoint[j];
      if(dist(mX, mY,x,y) < 20){
        branchSwitch = [1, x, y, stream[i].weightDefault*0.6, stream[i].sp+1];
        break;
      }
    }
  }
  if(branchSwitch[0]==0){
    stream.push(new WaterStream(mX, mY, "main", 0, 0));
    touchSound(0);
  }else{
    stream.push(new WaterStream(branchSwitch[1], branchSwitch[2], "branch",branchSwitch[3], branchSwitch[4]));
    touchSound(1);
  }
  
}

function waterStream_draw() {
  
    // オブジェクトの削除
    for (let i = 0; i < stream_goal.length; i++) {
      if (stream_goal[i].delete) {
        stream_goal.splice(i, 1);
      }
    }
    
    // 広がり開始オブジェクトの順番整理 
    for (let i = 0; i < stream.length; i++) {
      if (stream[i].phaseState == "goal") {
        stream_goal.push(stream[i]);
        stream.splice(i, 1);
      }
    }
  
    // 広がりオブジェクトの描画
    for (let i = 0; i < stream_goal.length; i++){
      stream_goal[i].drawing();
    }
  
    // 各 stream の処理
    for (let i = 0; i < stream.length; i++) {
      // 描画
      stream[i].drawing();
    }
  
}

//--------------------------
// WaterRipple
//--------------------------
function waterRipple_push(mX,mY) {
  ripple.push(new WaterRipple(mX, mY));
}
function waterRipple_draw() {
  if (ripple.length > 0) {
    for (let i = 0; i < ripple.length; i++) {
      if (ripple[i].delete == true) {
        ripple.splice(i, 1);
      }
    }
    for (let i = 0; i < ripple.length; i++) {
      ripple[i].drop();
    }
  }
}

//--------------------------
// WaterWave
//--------------------------

function waterWave_push(vol) {
  if (frameCount % waveTiming == 0) {
    wave.push(new WaterWave(vol));
    waveTiming = int(random(2, 4) * 30);
    waveCount = 0;
    v = 0;
  }
  waveCount++;
}

function waterWave_draw() {
  if (wave.length > 0) {
    for (let i = 0; i < wave.length; i++) {
      if (wave[i].delete) {
        wave.splice(i, 1);
      }
    }
    for (let i = 0; i < wave.length; i++) {
      wave[i].drawing();
    }
  }
}
//--------------------------
//  WaterBubble
//--------------------------
function waterBubble_push(x, y) {
  
  let n = random(1,4);
  let m = random(height/5,height/3);
  for(let i = 0; i < n; i++){
    let a = map(i, 0, n, 0, m)
    bubble.push(new WaterBubble(x, y));
  }
  touchSound(2);
}

function waterBubble_draw(){
  if (bubble.length > 0) {
    for (let i = 0; i < bubble.length; i++) {
      if (bubble[i].delete) {
        bubble.splice(i, 1);
      }
    }
    for (let i = 0; i < bubble.length; i++) {
      bubble[i].draw();
    }
  }
}

function mouseReleased(){
  if(!start){
    firstClick();
  }
}

//--------------------------
//  デバック用
//--------------------------
function keyPressed(){

}
