const { PDFDocument } = PDFLib;

const fileDropArea = document.getElementById('file-drop-area');
const fileInput = document.getElementById('file-upload');
const fileNameDiv = document.getElementById('file-name');
const form = document.getElementById('upload-form');
const errorMsg = document.getElementById('error-msg');
const loadingMsg = document.getElementById('loading-msg');

let originalFileName = '';

;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    fileDropArea.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

;['dragenter', 'dragover'].forEach(eventName => {
    fileDropArea.addEventListener(eventName, highlight, false);
});

;['dragleave', 'drop'].forEach(eventName => {
    fileDropArea.addEventListener(eventName, unhighlight, false);
});

fileDropArea.addEventListener('drop', handleDrop, false);
fileInput.addEventListener('change', () => handleFiles(fileInput.files));

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight() {
    fileDropArea.classList.add('highlight');
}

function unhighlight() {
    fileDropArea.classList.remove('highlight');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

function handleFiles(files) {
    if (files.length > 0) {
        originalFileName = files[0].name;
        fileNameDiv.textContent = `選択されたファイル: ${originalFileName}`;
        fileNameDiv.style.display = 'block';
        errorMsg.style.display = 'none';
        errorMsg.textContent = '';

        const dt = new DataTransfer();
        dt.items.add(files[0]);
        fileInput.files = dt.files;
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.style.display = 'none';
    errorMsg.textContent = '';

    const files = fileInput.files;
    if (!files || files.length === 0) {
        errorMsg.textContent = 'ファイルが選択されていません';
        errorMsg.style.display = 'block';
        return;
    }

    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    loadingMsg.style.display = 'block';

    try {
        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        const resultPdfBytes = await splitAndMergePdf(arrayBuffer);

        const baseName = originalFileName.replace(/\.[^/.]+$/, "");
        const downloadName = `split_${baseName}.pdf`;
        
        const blob = new Blob([resultPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            window.location.href = url;
        } else {
            const link = document.createElement('a');
            link.href = url;
            link.download = downloadName;
            link.click();
        }

        setTimeout(() => URL.revokeObjectURL(url), 1000);

    } catch (err) {
        console.error(err);
        errorMsg.textContent = 'エラーが発生しました: ' + err.message;
        errorMsg.style.display = 'block';
    } finally {
        loadingMsg.style.display = 'none';
        submitBtn.disabled = false;
    }
}); 