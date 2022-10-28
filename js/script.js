
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const type = "image/png";
const fileName = document.querySelector("input").value.trim();
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

async function file(file, docName) {
    const name = null == docName ? fileName : docName;
    const blob = await (await fetch(file)).blob();
    return new File([blob], name + ".png", { type: blob.type, lastModified: new Date().getTime() });
}

async function share(data) {
    if (navigator.canShare && navigator.canShare(data)) {
        try {
            await navigator.share(data);
        } catch (error) {
            console.log('Ocorreu um erro ao compartilhar!', error)
        }
    } else {
        console.log('Este dispositivo não suporta compartilhamento de arquivos.')
    }
}

document.querySelector("button#save").addEventListener("click", () => {
    const a = document.createElement("a");
    a.setAttribute("href", canvas.toDataURL(type));
    a.setAttribute("download", fileName);
    a.click();
});

document.querySelector("a#shareLink").addEventListener("click", async (e) => {
    const image = await file("./img/image.png", "image")
    const data = {
        title: 'Flyer Bolsonaro 2º Turno',
        text: 'Gere um Flyer com o seu nome de apoio ao Bolsonaro 2º no Turno:',
        url: 'https://alvaroreis.github.io/bolsonaro2turno/',
        files: [image]
    }
    await share(data);
});

document.querySelector("a#shareImage").addEventListener("click", async () => {
    const dataUrl = canvas.toDataURL(type);
    const image = await file(dataUrl)
    const data = { title: 'Flyer Bolsonaro 2º Turno', files: [image] };

    await share(data);
});


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
            document.querySelector("input").value.trim()
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
            document.querySelector("input").value.trim(),
            -width / 2,
            20
        );

        context.restore();

        setTimeout(draw, 100);
    }

    draw();
});
