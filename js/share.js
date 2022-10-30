async function file(file, docName) {
    try {
        const fileName = document.querySelector(codeInput).value.trim();
        const name = null == docName ? fileName : docName;
        const blob = await (await fetch(file)).blob();
        return new File([blob], name + ".png", { type: blob.type, lastModified: new Date().getTime() });
    } catch (error) {
        console.log('Ocorreu um erro ao buscar arquivo: Causa:', error)
    }
}

async function share(data) {
    if (navigator.canShare(data)) {
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
    try {
        const fileName = document.querySelector(codeInput).value.trim();
        const a = document.createElement("a");
        a.setAttribute("href", canvas.toDataURL(type));
        a.setAttribute("download", fileName);
        a.click();
    } catch (error) {
        console.log('Ocorreu um erro ao salvar imagem: Causa:', error)
    }
});

document.querySelector("a#shareLink").addEventListener("click", async (e) => {
    try {
        const url = window.location.href;
        const data = {
            title: 'Flyer Bolsonaro 2º Turno',
            text: 'Gere um Flyer com o seu nome de apoio ao Bolsonaro 2º no Turno:',
            url: url,
        }
        await share(data);
    } catch (error) {
        console.log('Ocorreu um erro compartilhar link: Causa:', error)
    }
});

document.querySelector("a#shareImage").addEventListener("click", async () => {
    try {
        const dataUrl = canvas.toDataURL(type);
        const image = await file(dataUrl)
        const data = { title: 'Flyer Bolsonaro 2º Turno', files: [image] };

        await share(data);
    } catch (error) {
        console.log('Ocorreu um erro compartilhar imagem: Causa:', error)
    }
});