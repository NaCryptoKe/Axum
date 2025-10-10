document.addEventListener('DOMContentLoaded', function() {
    function setupUpload(inputId, previewId, areaId) {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        const area = document.getElementById(areaId);

        if (input) {
            input.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        preview.innerHTML = `
                            <img src="${e.target.result}" alt="Preview">
                            <button type="button" class="remove-file" onclick="clearFile('${inputId}')">×</button>
                        `;
                        area.classList.add('has-file');
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    setupUpload('cover_image', 'coverPreview', 'coverUploadArea'); // For upload.php
    setupUpload('game_file', 'gamePreview', 'gameUploadArea');     // For upload.php
    setupUpload('cover_image', 'cover_imagePreview', 'cover_imageUploadArea'); // For edit.php
    setupUpload('game_file', 'gamePreview', 'game_fileUploadArea'); // For edit.php
});

function clearFile(inputId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(inputId + 'Preview');
    const uploadArea = document.getElementById(inputId + 'UploadArea');

    if (input) input.value = '';
    if (preview) preview.innerHTML = '';
    if (uploadArea) uploadArea.classList.remove('has-file');
}
