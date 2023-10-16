function setskip() {
    skip = 20;
    wavlen = 15;
}

function speed_change() {
    v = parseInt(speeder.value);
    beta = v / c;
    gamma = 1 / Math.sqrt(1 - beta * beta);
    setskip();
    draw();
}

function nm_change() {
    nm = parseInt(nmer.value);
    emi_style = nm2color(nm)[0];
    draw();
}

function keyb(e) {
    if (e.keyCode == 32) 
        startstop();
    if (e.keyCode == 82) 
        restart();
    if (e.keyCode == 77) 
        mute();
    }

function startstop() {
    //     	canvas.style.left = "10px";     	canvas.style.position = "absolute";
    if (ring == 0) 
        start();
    else 
        stop();
    }

function start() {
    if (ring == 0) 
        timer = window.setInterval(drawplus, speed);
    ring = 1;
}

function stop() {
    ring = 0;
    window.clearInterval(timer);
}

function resize() {
    var cHeight = document.documentElement.clientHeight;
    var cWidth = document.documentElement.clientWidth;
    var oWidth = sWidth;
    sWidth = cWidth;
    sHeight = cHeight;
    sHeight -= vpadding;
    // if (sWidth > 650) sWidth = 650;        if (sHeight > 650) sHeight = 650;
    // sWidth = Math.min(sWidth, sHeight);        sHeight = sWidth;
    ctx.canvas.width = sWidth;
    ctx.canvas.height = sHeight;
    rescale = sWidth / width;
    x0 = sWidth / 2;
    y0 = sHeight / 2;
    document
        .getElementById('TEXT1')
        .setAttribute("style", "width:" + sWidth + "px");
    document
        .getElementById('TEXT1')
        .style
        .width = '' + sWidth + 'px';
    document
        .getElementById('TEXT2')
        .setAttribute("style", "width:" + sWidth + "px");
    document
        .getElementById('TEXT2')
        .style
        .width = '' + sWidth + 'px';

    if (ring == 0) 
        draw();
    }

function resizedraw() {
    resize();
    draw();
}

function init() {
    ring = 0;
    speeder.value = v;
    nmer.value = nm;

    for (i = 0; i < n1; i++) {
        xm[i] = [];
        for (j = 0; j < n1; j++) xm[i][j]=hh*j;
        ym[i] = [];
        for (j = 0; j < n1; j++) ym[i][j]=hh*i;
        vxm[i] = [];
        for (j = 0; j < n1; j++) vxm[i][j]=0;
        vym[i] = [];
        for (j = 0; j < n1; j++) vym[i][j]=0;
        xd[i] = [];
        for (j = 0; j < n1; j++) xd[i][j]=Math.random()*10;
        yd[i] = [];
        for (j = 0; j < n1; j++) yd[i][j]=Math.random()*10;
        vxd[i] = [];
        for (j = 0; j < n1; j++) vxd[i][j]=Math.random()*150;
        vyd[i] = [];
        for (j = 0; j < n1; j++) vyd[i][j]=Math.random()*150;
    }

    setskip();

    document.addEventListener("keydown", keyb)
    window.addEventListener("orientationchange", resize, false);
    window.addEventListener("resize", resize, false);
    resize();

}

function restart() {
    stop();

    init();
    
    draw();
}

function drawplus() {
    t += dt;

    for(i=0;i<n1;i++)
        for(j=0;j<n1;j++) {
            vxd[i][j] -= kk*xd[i][j]*dt*(1+xd[i][j]*xd[i][j]);
            vyd[i][j] -= kk*yd[i][j]*dt*(1+yd[i][j]*yd[i][j]);
            xd[i][j] += vxd[i][j]*dt;
            yd[i][j] += vyd[i][j]*dt;
    }

    draw();

}

function draw() {

    ctx.clearRect(0, 0, sWidth, sHeight); // clear canvas

    for(i=0;i<n1;i++)
        for(j=0;j<n1;j++) {
            ctx.fillStyle = emi_style;
            ctx.beginPath();
            ctx.arc(xm[i][j] + xd[i][j], ym[i][j] + yd[i][j], emi_rad, 0, Math.PI * 2, false);
            ctx.fill();    
    }

}

// takes wavelength in nm and returns an rgba value
function nm2color(wl) {
    var r,
        g,
        b,
        alpha,
        colorSpace,
        gamma = 1;

    if (wl >= 380 && wl < 440) {
        R = -1 * (wl - 440) / (440 - 380);
        G = 0;
        B = 1;
    } else if (wl >= 440 && wl < 490) {
        R = 0;
        G = (wl - 440) / (490 - 440);
        B = 1;
    } else if (wl >= 490 && wl < 510) {
        R = 0;
        G = 1;
        B = -1 * (wl - 510) / (510 - 490);
    } else if (wl >= 510 && wl < 580) {
        R = (wl - 510) / (580 - 510);
        G = 1;
        B = 0;
    } else if (wl >= 580 && wl < 645) {
        R = 1;
        G = -1 * (wl - 645) / (645 - 580);
        B = 0.0;
    } else if (wl >= 645 && wl <= 780) {
        R = 1;
        G = 0;
        B = 0;
    } else {
        R = 0;
        G = 0;
        B = 0;
    }

    // intensty is lower at the edges of the visible spectrum.
    if (wl > 780 || wl < 380) {
        alpha = 0;
    } else if (wl > 700) {
        alpha = (780 - wl) / (780 - 700);
    } else if (wl < 420) {
        alpha = (wl - 380) / (420 - 380);
    } else {
        alpha = 1;
    }

    colorSpace = [
        "rgba(" + (
            R * 100
        ) + "%," + (
            G * 100
        ) + "%," + (
            B * 100
        ) + "%, " + alpha + ")",
        R,
        G,
        B,
        alpha
    ]
    // colorSpace is an array with 5 elements. The first element is the complete
    // code as a string. Use colorSpace[0] as is to display the desired color. use
    // the last four elements alone or together to access each of the individual r,
    // g, b and a channels.
    return colorSpace;
}