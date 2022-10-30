const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const type = "image/png";
const modelLink = document.getElementById("modelo-link");
const codeInput = document.querySelector("input#tipo-padrao");
const presidentInputs = document.querySelectorAll(
    'input[name="seleccione-presidente"]'
);
const presidents = {
    "seleccione-bolsonaro": {
        text: "Bolsonaro",
        x: -412,
        y: 317,
    },
    "seleccione-lula": {
        text: "Lula",
        x: -205,
        y: 319,
    },
};
const images = {
    default: new Image(),
    defaultBadge: new Image(),
    amareloBolsonaro: new Image(),
    amareloLula: new Image(),
};
images.default.src = "./img/default.png";
images.defaultBadge.src = "./img/badge.png";
images.amareloBolsonaro.src = "./img/amarelo-bolsonaro.png";
images.amareloLula.src = "./img/amarelo-lula.png";

let loaded = false;
let draw;

// Display text until all resources have been loaded
setTimeout(() => {
    if (loaded) {
        return;
    }
    context.fillStyle = "#f0f0f0";
    context.font = "40px sans-serif";
    const loadingText = "Loading...";
    const width = context.measureText(loadingText).width;
    context.fillText(
        loadingText,
        canvas.width / 2 - width / 2,
        canvas.height / 2
    );
}, 200);

load();
addEventListener("hashchange", load);

function load() {
    draw = drawDefault;
    let brandClass = "text-success";
    let otherModel = {
        name: "Amarelo (Tag)",
        link: "#amarelo",
        src: "metadata-amarelo.png",
    };
    if (window.location.hash.slice(1) === "amarelo") {
        draw = drawAmarelo;
        brandClass = "text-warning";
        otherModel = {
            name: "Verde",
            link: "#",
            src: "metadata.png",
        };
    }

    modelLink.innerHTML = `<img src="${otherModel.src}" height="30px"> ${otherModel.name}`;
    modelLink.href = otherModel.link;
    document.querySelector(".navbar-brand strong").className = brandClass;
    if (loaded) {
        draw();
    }
}

codeInput.value = names[Math.floor(Math.random() * names.length)];

const createPromiseEvent = (eventTarget, eventName) =>
    new Promise((resolve) => {
        const handleEvent = () => {
            eventTarget.removeEventListener(eventName, handleEvent);
            resolve();
        };
        eventTarget.addEventListener(eventName, handleEvent);
    });

Promise.all([
    ...Object.values(images).map((image) => createPromiseEvent(image, "load")),
    new FontFaceObserver("Bebas Neue").load(),
]).then(() => {
    loaded = true;
    codeInput.addEventListener("input", () => draw());
    presidentInputs.forEach((input) =>
        input.addEventListener("change", () => draw())
    );

    draw();
});

function drawDefault() {
    const roundRect = (ctx, x, y, width, height, radius = 5) => {
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
    };

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(images.default, 0, 0);

    context.save();

    context.translate(540, 360);
    context.rotate((-2 * Math.PI) / 180);

    context.fillStyle = "#f0f0f0";
    context.textBaseline = "middle";
    context.font = "bold 145px Bebas Neue";

    const president =
        presidents[
            Array.from(presidentInputs).find((input) => input.checked).id
        ];
    context.fillText(
        president.text.split("").join(String.fromCharCode(8202)),
        president.x,
        president.y
    );

    const code = codeInput.value.trim() || "Seu nome";

    context.font = "196.13px Bebas Neue";
    const width = context.measureText(code).width;

    context.fillStyle = "#19bb4c";
    roundRect(context, -width / 2 - 40, -220 / 2, width + 40 * 2, 210, 21.66);

    context.fillStyle = "#f0f0f0";
    context.fillText(code, -width / 2, 20);

    context.restore();

    context.drawImage(images.defaultBadge, 711, 570);
}

function drawAmarelo() {
    const roundRect = (ctx, x, y, width, height, radius = 5) => {
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
    };

    context.clearRect(0, 0, canvas.width, canvas.height);

    const image =
        Array.from(presidentInputs).find((input) => input.checked).id ===
        "seleccione-bolsonaro"
            ? images.amareloBolsonaro
            : images.amareloLula;
    context.drawImage(image, 0, 0);
    context.save();
    context.translate(540, 360);

    const code = codeInput.value.trim() || "Seu nome";
    context.textBaseline = "middle";
    context.font = "196.13px Bebas Neue";
    const width = context.measureText(code).width;

    const paddingWidth = 50;

    context.fillStyle = "#276825";
    roundRect(
        context,
        -width / 2 - paddingWidth,
        -225 / 2,
        width + paddingWidth * 2,
        210,
        {
            tl: 50,
            bl: 15,
            br: 50,
            tr: 15,
        }
    );

    context.fillStyle = "#f0f0f0";
    context.fillText(code, -width / 2, 15);

    context.restore();
}
