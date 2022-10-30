
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const type = "image/png";
const codeInput = "input#tipo-padrao";
const baseImage = new Image();
baseImage.src = "./img/base.png";

function roundRect(
    ctx,
    x,
    y,
    width,
    height,
    radius = 5,
    fill = false,
    stroke = true
) {
    if (typeof radius === "number") {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
        radius = { ...{ tl: 0, tr: 0, br: 0, bl: 0 }, ...radius };
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius.br,
        y + height
    );
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    ctx.fill();
}

document.querySelector("input#tipo-padrao").value =
    names[Math.floor(Math.random() * names.length)];


baseImage.addEventListener("load", () => {
    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(baseImage, 0, 0);

        context.save();

        context.translate(540, 360);
        context.rotate((-2 * Math.PI) / 180);

        context.textBaseline = "middle";
        context.font = "196.13px Bebas Neue";
        const width = context.measureText(
            document.querySelector(codeInput).value.trim()
        ).width;

        // context.fillStyle = "#1da60e";
        context.fillStyle = "#19bb4c";
        roundRect(
            context,
            -width / 2 - 40,
            -220 / 2,
            width + 40 * 2,
            210,
            21.66
        );

        context.fillStyle = "#f0f0f0";
        context.fillText(
            document.querySelector(codeInput).value.trim(),
            -width / 2,
            20
        );

        context.restore();

        setTimeout(draw, 100);
    }

    draw();
});
