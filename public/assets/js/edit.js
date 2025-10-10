// edit.js — Frontend Upload + Drag&Drop Preview
// Works with inputs:
//  - #cover_image            -> image input
//  - #cover_imagePreview     -> image preview container
//  - #game_file              -> game file input
//  - #gamePreview            -> game file preview container
// Optional: .file-upload-area containers for drag/drop

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ edit.js loaded and running");

    // Helpers
    const formatBytes = (bytes) => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B","KB","MB","GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    // --- COVER IMAGE ---
    const coverInput = document.getElementById("cover_image");
    const coverPreview = document.getElementById("cover_imagePreview");
    const coverArea = document.getElementById("cover_imageUploadArea");

    if (!coverInput || !coverPreview) {
        console.error("❌ Missing cover input or preview. IDs required: cover_image, cover_imagePreview");
    } else {
        const showCover = (file) => {
            coverPreview.innerHTML = "";
            if (!file) return;
            if (!file.type.startsWith("image/")) {
                const warn = document.createElement("p");
                warn.textContent = `⚠️ Not an image: ${file.name}`;
                warn.classList.add("file-name");
                coverPreview.appendChild(warn);
                return;
            }

            const img = document.createElement("img");
            img.classList.add("preview-image");
            img.alt = file.name;
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                URL.revokeObjectURL(img.src);
            };
            coverPreview.appendChild(img);

            const meta = document.createElement("div");
            meta.classList.add("file-meta");
            meta.textContent = `${file.name} • ${formatBytes(file.size)}`;
            coverPreview.appendChild(meta);
        };

        coverInput.addEventListener("change", () => {
            const file = coverInput.files && coverInput.files[0];
            console.log(file ? `🖼 Selected cover: ${file.name}` : "⚠️ Cover cleared");
            showCover(file);
        });

        // Drag & drop (if container exists)
        if (coverArea) {
            coverArea.addEventListener("dragover", (e) => { e.preventDefault(); coverArea.classList.add("dragover"); });
            coverArea.addEventListener("dragleave", () => coverArea.classList.remove("dragover"));
            coverArea.addEventListener("drop", (e) => {
                e.preventDefault();
                coverArea.classList.remove("dragover");
                const f = e.dataTransfer.files && e.dataTransfer.files[0];
                if (f) {
                    coverInput.files = e.dataTransfer.files; // set the input's files
                    coverInput.dispatchEvent(new Event("change"));
                }
            });
        }
    }

    // --- GAME FILE ---
    const gameInput = document.getElementById("game_file");
    const gamePreview = document.getElementById("gamePreview");
    const gameArea = document.getElementById("game_fileUploadArea");

    if (!gameInput || !gamePreview) {
        console.error("❌ Missing game input or preview. IDs required: game_file, gamePreview");
    } else {
        const showGameFile = (file) => {
            gamePreview.innerHTML = "";
            if (!file) return;

            const p = document.createElement("p");
            p.classList.add("file-name");
            p.textContent = `📦 ${file.name} • ${formatBytes(file.size)}`;
            gamePreview.appendChild(p);

            // optionally show extension-specific hints
            const ext = file.name.split(".").pop().toLowerCase();
            if (!["zip","rar","7z","exe","apk","ipa"].includes(ext)) {
                const hint = document.createElement("small");
                hint.textContent = `⚠️ Uncommon extension: .${ext}`;
                gamePreview.appendChild(hint);
            }
        };

        gameInput.addEventListener("change", () => {
            const file = gameInput.files && gameInput.files[0];
            console.log(file ? `📦 Selected game file: ${file.name}` : "⚠️ Game file cleared");
            showGameFile(file);
        });

        // Drag & drop
        if (gameArea) {
            gameArea.addEventListener("dragover", (e) => { e.preventDefault(); gameArea.classList.add("dragover"); });
            gameArea.addEventListener("dragleave", () => gameArea.classList.remove("dragover"));
            gameArea.addEventListener("drop", (e) => {
                e.preventDefault();
                gameArea.classList.remove("dragover");
                const f = e.dataTransfer.files && e.dataTransfer.files[0];
                if (f) {
                    gameInput.files = e.dataTransfer.files;
                    gameInput.dispatchEvent(new Event("change"));
                }
            });
        }
    }

    // --- Extra: Prevent accidental form submit on Enter inside inputs that shouldn't submit ---
    document.querySelectorAll('input[type="file"]').forEach(input => {
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") e.preventDefault();
        });
    });

    // Initial: if files are already selected (rare), render them
    if (coverInput && coverInput.files && coverInput.files[0]) {
        coverInput.dispatchEvent(new Event("change"));
    }
    if (gameInput && gameInput.files && gameInput.files[0]) {
        gameInput.dispatchEvent(new Event("change"));
    }
});
