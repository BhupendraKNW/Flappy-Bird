
//board
let board;
let boardWidth=360;
let boardHeight=640;
let context;


//bird
let birdWidth=34;
let birdHeight=24;
let birdX=boardWidth/8;
let birdY=boardHeight/2;
let birdImg;

let bird={
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight,
}
//pipe

let pipeArray=[];
let pipeWidth=64;
// let pipeWidth=44;
let pipeHeight=512;
// let pipeHeight=500;
let pipeX=boardWidth;
let pipeY=0;

let topPipeImg;
let bottomPipeImg;

//math
let velocityX= -2;
let velocityY= 0;
let gravity=0.4;
let gameOver=false;
let score=0;
window.onload=function(){
    board=document.getElementById("board");
    board.height=boardHeight;
    board.width=boardWidth;
    context=board.getContext("2d");

    //d bird
    // context.fillStyle= "green";
    context.fillRect(bird.x ,bird.y ,bird.width ,bird.height);

    //bird image
    birdImg=new Image();
    birdImg.src="./img/flappybird.png";
    birdImg.onload=function(){
        context.drawImage(birdImg, bird.x , bird.y ,bird.width , bird.height);
    }

    topPipeImg=new Image();
    topPipeImg.src="./img/toppipe.png";
    
    bottomPipeImg=new Image();
    bottomPipeImg.src="./img/bottompipe.png";


    requestAnimationFrame(update);
    setInterval(placePipes,1500);
    document.addEventListener("keydown",moveBird);
}

function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0,0,board.width,board.height);
    //bird
    velocityY += gravity;
    // bird.y += velocityY;
     bird.y = Math.max( bird.y+ velocityY,0);

    context.drawImage(birdImg , bird.x , bird.y , bird.width , bird.height);
    
    if(bird.y > board.height)
    {
        gameOver=true;
    }

    //pipes
    for(let i=0; i<pipeArray.length; i++)
    {
        let pipe=pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img , pipe.x, pipe.y, pipe.width, pipe.height); 
       
       if(!pipe.passed && bird.x > pipe.x + pipe.width)
       {
        score +=0.5;
        pipe.passed =true;
       }

        if(detectCollision(bird,pipe))
        {
            gameOver=true;
        }
    }
    while(pipeArray.length>0 && pipeArray[0].x< -pipeWidth)
    {
        pipeArray.shift();
    }
    context.fillStyle="white";
    context.font="45px sans-serif";
    context.fillText(score,5,45);
 
    if(gameOver)
    {
        context.fillText("Game Over",5,90);
    }
    if(gameOver)
    {
        bird.y = birdY;
        pipeArray=[];
        score=0;
        gameOver=false;
    }
}

function placePipes(){
    if(gameOver)
    {
        return;
    }
    let randomPipeY=pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace=board.height/4;

   let topPipe={
    img:topPipeImg,
    x:pipeX,
    y:randomPipeY,
    width:pipeWidth,
    height:pipeHeight,
    passed:false
   } 
   pipeArray.push(topPipe);

   let bottomPipe={
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false
   }
   pipeArray.push(bottomPipe);

}

function moveBird(e){
    if(e.code == "Space" || e.code=="ArrowUp" || e.code=="KeyX")
    {
        velocityY=-8;

        if(gemeOver){
            bird.y=birdY;
            pipeArray=[];
            score=0;
            gameOver=false;
        }
    }
}

function detectCollision(a,b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}