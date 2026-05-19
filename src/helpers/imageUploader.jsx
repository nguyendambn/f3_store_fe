import { useEffect, useRef } from "react";
import { FileUploadWithPreview } from "file-upload-with-preview";

// 👇 Convert 1 URL thành File object
async function urlToFile(url, filename, mimeType) {
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    return new File([buf], filename, { type: mimeType });
}

function ImageUploader({ onFilesSelected, resetTrigger, initialImages = [] }) {
    const uploadRef = useRef(null);
    const uploadId = "my-unique-id";

    useEffect(() => {
        if (!uploadRef.current) {
            uploadRef.current = new FileUploadWithPreview(uploadId, {
                maxFileCount: 50,
                multiple: true,
                text: {
                    chooseFile: "Chọn ảnh...",
                    browse: "Tải ảnh lên",
                    selectedCount: "Ảnh được chọn",
                    label: "📸 Hình ảnh sản phẩm"
                },
                showDeleteButtonOnImages: true,
                acceptedFileTypes: ["image/jpeg", "image/png", "image/webp"]
            });

            const fileInput = document.querySelector(
                `.custom-file-container[data-upload-id="${uploadId}"] input[type="file"]`
            );

            if (fileInput) {
                fileInput.setAttribute("accept", "image/*");

                fileInput.addEventListener("change", () => {
                    const files = uploadRef.current.cachedFileArray || [];
                    onFilesSelected(files);
                });
            }
        }
    }, [onFilesSelected]);

    useEffect(() => {
        async function addInitialImages() {
            if (initialImages.length > 0 && uploadRef.current) {
                uploadRef.current.resetPreviewPanel();

                const fileInput = document.querySelector(
                    `.custom-file-container[data-upload-id="${uploadId}"] input[type="file"]`
                );

                if (!fileInput) return;

                const fileList = await Promise.all(
                    initialImages.map(async (url, index) => {
                        // 👇 Giả lập File từ URL
                        const file = await urlToFile(url, `image-${index}.jpg`, "image/jpeg");
                        return file;
                    })
                );

                // 👉 Trick: tạo 1 DataTransfer để thêm file vào input
                const dataTransfer = new DataTransfer();
                fileList.forEach(file => {
                    dataTransfer.items.add(file);
                });

                fileInput.files = dataTransfer.files;

                // 👉 Gọi sự kiện change để trigger thư viện
                const event = new Event('change', { bubbles: true });
                fileInput.dispatchEvent(event);
            }
        }

        addInitialImages();
    }, [initialImages]);

    useEffect(() => {
        if (uploadRef.current) {
            uploadRef.current.resetPreviewPanel();
        }
    }, [resetTrigger]);

    return (
        <div className="custom-file-container" data-upload-id={uploadId}></div>
    );
}

export default ImageUploader;
