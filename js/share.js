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
    // const image = await file("./img/image.png", "image")
    const data = {
        title: 'Flyer Bolsonaro 2º Turno',
        text: 'Gere um Flyer com o seu nome de apoio ao Bolsonaro 2º no Turno:',
        url: 'https://alvaroreis.github.io/bolsonaro2turno/',
        // files: [image]
    }
    await share(data);
});

document.querySelector("a#shareImage").addEventListener("click", async () => {
    const dataUrl = canvas.toDataURL(type);
    const image = await file(dataUrl)
    const data = { title: 'Flyer Bolsonaro 2º Turno', files: [image] };

    await share(data);
});
