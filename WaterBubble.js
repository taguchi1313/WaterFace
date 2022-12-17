class WaterBubble{
  constructor(x,y){
    this.id = int(random(10000));
    // 座標
    this.x = x;
    this.y = y;
    // 泡の半径
    this.r = random(10,30);
    if(random()<0.05){this.r = random(50,100);}
    // 泡の振れ幅
    this.range = 10;
    // 泡の上昇スピード
    this.upSp = random(10,30);
    // 色
    this.cH = 100;
    this.cS = 0;
    this.cB = 100;
    this.cA_set = random(60,80); //不透明度の初期値
    this.cA = this.cA_set;
    // カウント
    this.count = 0;
    this.second = int(random(1,3) * 30);
    
  }

  
//--------------------
// メインの関数
//--------------------
  draw(){
    this.deleteCheck();
    this.colorSet();
    this.frow();
    this.bubbleShape();
    this.count++;
  }
//--------------------
// 色の設定
//--------------------
  colorSet(){
    let c = color(this.cH, this.cS, this.cB, this.cA);
    
    noStroke();
    fill(c);
  }
  
//--------------------
// 泡の形の描画
//--------------------
  bubbleShape(){
    ellipse(this.x,this.y,this.r,this.r*0.9);
  }
  
//--------------------
// 浮かんでいく動き
//--------------------
  frow(){
    let i = map 
    this.x = this.x + map(noise(this.id+this.count/5), 0, 1, -this.range, this.range);
    this.y = this.y - this.upSp;
    //this.cA = map(this.count, 0, this.second, this.cA_set, 40);
    
  }
  
//--------------------
// 削除チェック
//--------------------
  deleteCheck(){
    if(this.y < -30){
      this.delete = true;
    }
  }    
}
