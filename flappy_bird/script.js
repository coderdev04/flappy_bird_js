var stage=document.querySelector('#cover');
    function set_stage(){
    stage.width=window.innerWidth/2;
    stage.height=window.innerHeight/3.5;
    stage.style.left=(window.innerWidth-stage.width)/2;
    stage.style.top=(window.innerHeight-stage.height)/2;
    var score_container=document.querySelector('#score');
    score_container.style.color='white';
    score_container.style.font='Tahoma';
    score_container.style.top=(window.innerHeight-stage.height*1.5)/2;
    score_container.style.left=(window.innerWidth-stage.width)/2;
    // var Multiplier=document.querySelector('#Multiplier');
    // Multiplier.style.color='white';
    // Multiplier.style.font='Tahoma';
    // Multiplier.style.top=(window.innerHeight-stage.height*1.5)/2;
    // Multiplier.style.right=(window.innerWidth-stage.width)/2;
}
window.onload=set_stage();
window.onresize=set_stage;
var score=0;
function update_score(){
    document.querySelector('#score_val').innerHTML=score;
}

function rand_between( a, b){
    return Math.random()*(a-b)+b;
}

var context=document.querySelector('#cover').getContext('2d');
class Square{
    constructor(x,y,side){
        this.x=x;
        this.y=y;
        this.side=side;
        this.gravity=0.05;
        this.speed=0;
        this.vertex_x=[this.x-this.side/2,this.x+this.side/2,this.x+this.side/2,this.x-this.side/2];
        this.vertex_y=[this.y-this.side/2,this.y-this.side/2,this.y+this.side/2,this.y+this.side/2];
    }
    update_coords(){
        this.vertex_x=[this.x-this.side/2,this.x+this.side/2,this.x+this.side/2,this.x-this.side/2];
        this.vertex_y=[this.y-this.side/2,this.y-this.side/2,this.y+this.side/2,this.y+this.side/2];
    }
    draw(){  
        context.fillStyle='grey';
        context.fillRect(this.vertex_x[0],this.vertex_y[0],this.side,this.side);
        context.fillStyle='red';
        context.textAlign='center';
        context.font='10px Tahoma';     
        context.fillText('UwU', this.x, this.y);
                
    }
    update(){
        if(this.vertex_y[2]<=stage.height){
            this.speed+=this.gravity;
        }else{
            if(this.speed>0){
                this.speed=0;
            }
        }
        this.y+=this.speed;
        this.update_coords();
        this.draw();
    }
    jump(){
        this.speed=-1.1;
        this.draw();
    }
}

var speed=1;
class Pipe{
    constructor(x,y){
        this.x=x;
        this.y=y;
        this.width=40;
        this.gap=85;
        this.crossed=false;
        this.coords=[
            [this.x-this.width/2,this.y-this.gap/2],
            [this.x+this.width/2,this.y-this.gap/2],
            [this.x+this.width/2,this.y+this.gap/2],
            [this.x-this.width/2,this.y+this.gap/2],
        ];
    }
    update_coords(){
        this.coords=[
            [this.x-this.width/2,this.y-this.gap/2],
            [this.x+this.width/2,this.y-this.gap/2],
            [this.x+this.width/2,this.y+this.gap/2],
            [this.x-this.width/2,this.y+this.gap/2],
        ];

    }
    draw(){
        context.fillStyle='black';
        
        context.fillRect(this.coords[0][0],0,this.width,this.coords[0][1]);
        context.fillRect(this.coords[3][0],this.coords[3][1],this.width,stage.height-this.coords[2][1]);        
    }
    update(){
        this.x-=speed;
        this.update_coords();
        this.draw();

    }
}

class Pipes{
    constructor(){
        this.pipe_set=[];
        this.pipe_set.push(new Pipe(stage.width,stage.height/2));
    }
    generate_pipe(){
        var pipe_y=(Math.random()*70-35)+this.pipe_set[this.pipe_set.length-1].y;
        if(pipe_y>=stage.height-40){
            pipe_y=stage.height-40;
        }
        if(pipe_y<=40){
            pipe_y=40;
        }
        this.pipe_set.push(new Pipe(this.pipe_set[this.pipe_set.length-1].x+120,pipe_y));
    }
    remove_pipe(){
        this.pipe_set.shift();
    }
}

var pressed=false;
var started=false;
//var pipes_crossed=0;
var square=new Square(stage.width/10,stage.height/2,25);
var pipes=new Pipes();
function draw_end_screen(){
    context.fillStyle='white';    
    context.fillRect(stage.width/6,stage.height/6,stage.width/1.5,stage.height/1.5);
    context.strokeStyle='black';
    context.strokeRect(stage.width/6,stage.height/6,stage.width/1.5,stage.height/1.5);
    context.stroke();
    context.font='20px Tahoma';
    
    context.fillStyle='black';    
    context.textAlign='center';
    
    context.fillText("you ded [Score : "+score+"]", stage.width/2,stage.height/2);
        
}

function has_collided(){
    for(var i=0;i<pipes.pipe_set.length;i++){
        if(Math.abs(square.x-pipes.pipe_set[i].x)<=(pipes.pipe_set[i].width+square.side)/2 &&
        Math.abs(square.y-pipes.pipe_set[i].y)>=(pipes.pipe_set[i].gap-square.side)/2
        ){
            console.log("collision");
            return true;
        }
    }
    return false;
}
square.draw();
animate=()=>{
    if(!has_collided()){
    requestAnimationFrame(animate);
    document.addEventListener('keydown',(e)=>{
        started=true;
        if(!pressed){
            console.log(e.code);
            square.jump();
            pressed=true;
        }
    });
    document.addEventListener('keyup',(e)=>{
        pressed=false;
    });
    if(started){
        context.clearRect(0, 0, stage.width, stage.height);
        square.update(); 
        for(i=0;i<pipes.pipe_set.length;i++){
            pipes.pipe_set[i].update();
            if(pipes.pipe_set[i].x<=square.x && !pipes.pipe_set[i].crossed){
                pipes.pipe_set[i].crossed=true;
                score+=1;
                speed+=0.1;
                update_score();
            }
        }
        //document.querySelector("#Multiplier_val").innerHTML=(1+Math.floor(pipes_crossed/5))+"x";
        if(pipes.pipe_set[pipes.pipe_set.length-1].x<=stage.width-70){
            pipes.generate_pipe();
        }
        if(pipes.pipe_set[0].x<=-20){
            pipes.remove_pipe();
        }
        if(has_collided()){
            draw_end_screen();
        }
    }else{
        context.fillStyle='black';
        context.textAlign='center';
        context.font='20px Tahoma';     
        context.fillText('Pwesh any key to begin...', stage.width/2, stage.height/2);
    }}
}
animate();