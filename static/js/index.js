var canvas = document.getElementById("myCanvas");
var patternResponseText = document.getElementById("patternResponse");
var mousePressed = false;
var lastX, lastY;
var ctx;

const initTheCanvas = () => {
    ctx = canvas.getContext("2d");
    canvas.width  = 300;
    canvas.height = 300;

    canvas.onmousedown = (event) => {
        mousePressed = true;
        var x = event.pageX - ctx.canvas.offsetLeft
        var y = event.pageY - ctx.canvas.offsetTop;
        drawOnCanvas(x, y, false);
    }

    canvas.onmousemove = (event) => {
        if(mousePressed) {
            var x = event.pageX - ctx.canvas.offsetLeft
            var y = event.pageY - ctx.canvas.offsetTop;
            drawOnCanvas(x, y, true);
        } 
    }

    canvas.onmouseup = (event) => {
        mousePressed = false;
    }

    canvas.onmouseleave = (event) => {
        mousePressed = false;
    }
}

const findPattern = () => {
    var dataURL = canvas.toDataURL();
    const apiUrl = 'http://127.0.0.1:5000/digit'
    //const apiUrl = 'https://digitfind.herokuapp.com/digit';
    const apiData = {
        "image_url" : dataURL
    }
    const other_params = {
        headers : { "content-type" : "application/json"},
        body : JSON.stringify(apiData),
        method : "POST",
    };
    fetch(apiUrl, other_params).then(function(response) {
        return response.json();
      })
      .then(data => {
        console.log('data:',data);
        patternResponseText.value = data.number;
      }).catch((error) => {
        patternResponseText.value = 'something went wrong';
    });

    // var request = new XMLHttpRequest();
    // request.open("POST", "https://digitfind.herokuapp.com/digit", true);
    // request.onload = () => {
    //     /* we begin accessing json data here */
    //     console.log('response ::',request.response);
    //     var data = JSON.parse(request.response);
    // }
    // request.send();
    // var message = "this is the number 3";
}



const clearDrawing = () => {
    console.log('clearing...');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    patternResponseText.value = "";
}


const drawOnCanvas = (x, y, isDown) => {
    if(isDown) {
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 15;
        ctx.lineJoin = "round";
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }
    lastX = x;
    lastY = y;
}

