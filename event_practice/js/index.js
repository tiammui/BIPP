console.log("it worked");
var box = document.getElementsByClassName('box');
var smallBox = document.getElementsByClassName('small-box');
var fluidBox = document.getElementsByClassName('fluid-box');
var box2 = document.getElementById('box2');
var drum = document.getElementById('drum');
function runner(elemID) {
    document.getElementById(elemID).addEventListener('mouseenter', function (e) {
        console.log(e.offsetX, e.offsetY);
        var newStyle = {
            left: e.offsetX + "px",
            top: e.offsetY + "px"
        };
        updateCss(smallBox[0], newStyle);
        document.getElementById(elemID).addEventListener('mousemove', runnerEvent);
    });
    document.getElementById(elemID).addEventListener('mouseleave', function () {
        document.getElementById(elemID).removeEventListener('mousemove', runnerEvent);
    });
}
function creator(elemID) {
    document.getElementById(elemID).addEventListener("mousedown", creatorEvent);
    document.getElementById(elemID).addEventListener("touchstart", creatorTouchEvent);
    document.getElementById(elemID).addEventListener("mouseup", function () {
        document.getElementById(elemID).removeEventListener("mousemove", mouseMoveEvent);
        fluidBox[0].removeEventListener("mousemove", fluidMouseEvent);
    });
    document.getElementById(elemID).addEventListener("touchend", function () {
        document.getElementById(elemID).removeEventListener("touchmove", touchMoveEvent);
        fluidBox[0].removeEventListener("touchmove", fluidTouchEvent);
    });
}
function runnerEvent(e) {
    // if small-box is clicked do nothing
    // if(!e.target.classList.contains("box")){
    //     return
    // }
    var xMove = e.movementX;
    var yMove = e.movementY;
    var oldLeft = parseInt(smallBox[0].style.left);
    var oldTop = parseInt(smallBox[0].style.top);
    var newLeft = oldLeft + xMove, newTop = oldTop + yMove;
    console.log(e.offsetX, e.offsetY);
    var newStyle = {
        left: newLeft + "px",
        top: newTop + "px"
    };
    updateCss(smallBox[0], newStyle);
}
var creatorObj = {
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0
};
var pinPoint = {
    x: 0, y: 0
};
function creatorEvent(e) {
    creatorObj.x1 = pinPoint.x = e.pageX - getOffset(box2)[0];
    creatorObj.y1 = pinPoint.y = e.pageY - getOffset(box2)[1];
    // if fluid-box is clicked, reset
    if (!e.target.classList.contains("box")) {
        fluidBox[0].addEventListener("mousemove", fluidMouseEvent);
        return console.log('fluid');
    }
    box2.addEventListener("mousemove", mouseMoveEvent);
}
function creatorTouchEvent(e) {
    var change = e.changedTouches[0];
    creatorObj.x1 = pinPoint.x = change.pageX - getOffset(box2)[0];
    creatorObj.y1 = pinPoint.y = change.pageY - getOffset(box2)[1];
    // if fluid-box is clicked, reset
    if (!e.target.classList.contains("box")) {
        fluidBox[0].addEventListener("touchmove", fluidTouchEvent);
        return console.log('fluid');
    }
    box2.addEventListener("touchmove", touchMoveEvent);
}
function mouseMoveEvent(e) {
    creatorObj.x2 = e.pageX - getOffset(box2)[0];
    creatorObj.y2 = e.pageY - getOffset(box2)[1];
    var cord = cordCorrection(creatorObj);
    if (cord.x1 < 0)
        cord.x1 = 0;
    if (cord.y1 < 0)
        cord.y1 = 0;
    if (cord.x2 > getWidth(box2))
        cord.x2 = getWidth(box2);
    if (cord.y2 > getHeight(box2))
        cord.y2 = getHeight(box2);
    var newStyle = {
        left: cord.x1 + "px",
        top: cord.y1 + "px",
        width: cord.x2 - cord.x1 + "px",
        height: cord.y2 - cord.y1 + "px"
    };
    updateCss(fluidBox[0], newStyle);
}
function touchMoveEvent(e) {
    var change = e.changedTouches[0];
    creatorObj.x2 = change.pageX - getOffset(box2)[0];
    creatorObj.y2 = change.pageY - getOffset(box2)[1];
    var cord = cordCorrection(creatorObj);
    if (cord.x1 < 0)
        cord.x1 = 0;
    if (cord.y1 < 0)
        cord.y1 = 0;
    if (cord.x2 > getWidth(box2))
        cord.x2 = getWidth(box2);
    if (cord.y2 > getHeight(box2))
        cord.y2 = getHeight(box2);
    var newStyle = {
        left: cord.x1 + "px",
        top: cord.y1 + "px",
        width: cord.x2 - cord.x1 + "px",
        height: cord.y2 - cord.y1 + "px"
    };
    updateCss(fluidBox[0], newStyle);
}
function fluidMouseEvent(e) {
    var xMove = e.movementX;
    var yMove = e.movementY;
    var oldLeft = parseInt(fluidBox[0].style.left);
    var oldTop = parseInt(fluidBox[0].style.top);
    var newLeft = oldLeft + xMove, newTop = oldTop + yMove;
    var fluidWidth = getWidth(box2) - getWidth(fluidBox[0]), fluidHeight = getHeight(box2) - getHeight(fluidBox[0]);
    if (newLeft < 0)
        newLeft = 0;
    if (newTop < 0)
        newTop = 0;
    if (newLeft > fluidWidth)
        newLeft = fluidWidth;
    if (newTop > fluidHeight)
        newTop = fluidHeight;
    var newStyle = {
        left: newLeft + 'px',
        top: newTop + 'px'
    };
    updateCss(fluidBox[0], newStyle);
}
function fluidTouchEvent(e) {
    var change = e.changedTouches[0];
    var xPos = change.pageX - getOffset(box2)[0], yPos = change.pageY - getOffset(box2)[1];
    var xDiff = xPos - pinPoint.x, yDiff = yPos - pinPoint.y;
    pinPoint.x = xPos;
    pinPoint.y = yPos;
    var oldLeft = parseFloat(fluidBox[0].style.left);
    var oldTop = parseFloat(fluidBox[0].style.top);
    var newLeft = oldLeft + xDiff, newTop = oldTop + yDiff;
    var fluidWidth = getWidth(box2) - getWidth(fluidBox[0]), fluidHeight = getHeight(box2) - getHeight(fluidBox[0]);
    if (newLeft < 0)
        newLeft = 0;
    if (newTop < 0)
        newTop = 0;
    if (newLeft > fluidWidth)
        newLeft = fluidWidth;
    if (newTop > fluidHeight)
        newTop = fluidHeight;
    var newStyle = {
        left: newLeft + 'px',
        top: newTop + 'px'
    };
    updateCss(fluidBox[0], newStyle);
}
function getWidth(el) {
    return el.offsetWidth;
}
function getHeight(el) {
    return el.offsetHeight;
}
function cordCorrection(cord) {
    var xa = cord.x1, xb = cord.x2, ya = cord.y1, yb = cord.y2;
    if (xb < xa) {
        xa = cord.x2;
        xb = cord.x1;
    }
    if (yb < ya) {
        ya = cord.y2;
        yb = cord.y1;
    }
    return { x1: xa, y1: ya, x2: xb, y2: yb };
}
function getOffset(element) {
    var offsetX = element.offsetLeft;
    var offsetY = element.offsetTop;
    return [offsetX, offsetY];
}
function updateCss(element, cssObj) {
    Object.assign(element.style, cssObj);
}
function scroller() {
    drum.addEventListener('scroll', scrollerEvent);
}
function scrollerEvent(e) {
    console.log(e);
}
runner("box1");
creator("box2");
scroller();
