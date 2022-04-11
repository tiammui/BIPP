// const {canvasy}=require('./type')

var mum=document.getElementById('mum');
var img = document.getElementById('img');
var clearBtn = document.getElementById('clear-btn')
/**
* @type {HTMLCanvasElement} 
*/
var can = document.getElementById('kill');

mum.addEventListener("change",fileListener)
function fileListener(e){
    console.log(e);
    var file=e.target.files[0]    
    if(file){
        console.log("%c Hurray","color:blue;background-color:aqua");
    } else {
        console.error('Hoops!!!!!');
    }
}

img.addEventListener("load",imageListener)
function imageListener(e){
    handleCanvas()
}

function clearFile(){
    mum.files[0]=undefined;
    console.log(mum.files[0]);
}

function displayFile(){
    img.src=URL.createObjectURL(mum.files[0])
}

function cleary(){
    clearBtn.click()
}

function handleCanvas(){
    var ctx = can.getContext('2d');
    ctx.drawImage(img,0,0)
    
}

function hhh(){
    for(var i=0;i<5;i++){
        looper()
        console.log('a',i);
    }
}
