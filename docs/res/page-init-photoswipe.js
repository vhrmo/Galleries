import PhotoSwipeLightbox from './photoswipe/photoswipe-lightbox.esm.js';
import PhotoSwipe from './photoswipe/photoswipe.esm.js';

function loadCSS() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = '../res/photoswipe/photoswipe.css';
    document.head.appendChild(link);
}

/************************************************************************
 * PhotoSwipe lightbox initialization
 ************************************************************************/
function initPhotoSwipe() {
    const lightbox = new PhotoSwipeLightbox({
        gallery: '.photoswipe',
        children: 'img',
        pswpModule: PhotoSwipe
    });

    lightbox.addFilter('domItemData', (itemData, element, linkEl) => {
        if (element) {
            itemData.src = element.src;
            itemData.w = element.width * 10;
            itemData.h = element.height * 10;
            itemData.msrc = element.src;
        }
        return itemData;
    });

    lightbox.init();
}


/************************************************************************
 * Justified image gallery
 ************************************************************************/
function justifyImagesInContainer(container) {
    // images are lined up to multiple rows
    // images in each row should be justified to fill the entire width of the container
    // each image should keep its aspect ratio
    const images = Array.from(container.querySelectorAll('img'));
    if (images.length === 0) return;
    const containerWidth = container.clientWidth;
    let currentRow = [];
    let currentRowWidth = 0;

    let gap = 0;
    if (images.length > 1) {
        gap = images[1].offsetLeft - images[0].offsetLeft - images[0].width;
    }

    let maxHeight = 100;
    if (images.length > 0) {
        maxHeight = parseInt(getComputedStyle(images[0]).maxHeight);
    }

    images.forEach(img => {
        let ratio = img.naturalWidth / img.naturalHeight;
        const scaledWidth = maxHeight * ratio;
        const scaledHeight = maxHeight;

        // const imgWidth = img.width;
        currentRowWidth += scaledWidth;
        currentRow.push({img, scaledWidth, scaledHeight});

        const rowWidthWithGaps = currentRowWidth + (currentRow.length - 1) * gap;
        // console.log('currentRowWidth', currentRowWidth, 'rowWidthWithGaps', rowWidthWithGaps, 'containerWidth', containerWidth);

        if (rowWidthWithGaps === containerWidth) {
            // just reset for next row
            currentRow = [];
            currentRowWidth = 0;
        } else if (rowWidthWithGaps > containerWidth) {
            // need to scale down the images in the current row to fit the container width
            const resizeRatio = (containerWidth - (currentRow.length - 1) * gap) / currentRowWidth;
            for (let i = 0; i < currentRow.length; i++) {
                const newWidth = Math.floor(currentRow[i].scaledWidth * resizeRatio);
                const newHeight = Math.floor(currentRow[i].scaledHeight * resizeRatio);
                console.log(newWidth, newHeight);
                currentRow[i].img.style.width = `${newWidth}px`;
                currentRow[i].img.style.height = `${newHeight}px`;
            }
            currentRow = [];
            currentRowWidth = 0;
        }
    });

    // handle the last row - set height same as first image in the first row
    if (currentRow.length > 0) {
        const firstRowImageHeight = images[0].height;
        currentRow.forEach(imgData => {
            const img = imgData.img;
            const resizeRatio = firstRowImageHeight / img.height;
            const newWidth = Math.floor(img.width * resizeRatio);
            img.style.width = `${newWidth}px`;
            img.style.height = `${firstRowImageHeight}px`;
        });
    }
}

function initJustifiedGalleries() {
    const galleries = document.querySelectorAll('.thumbnails.justified');
    function resizeImages() {
        galleries.forEach(gallery => {
            justifyImagesInContainer(gallery);
        });
    }
    resizeImages();
    if (galleries.length > 0) {
        window.addEventListener('resize', () => {
            resizeImages();
            // setTimeout(resizeImages, 50);
        });
    }
}


/************************************************************************
 * Photo stack layout
 ************************************************************************/
function layoutPhotoStacks() {

    function getOffsetX(container, images) {
        const containerWidth = container.clientWidth;
        const offsetX = Math.floor((containerWidth - 220)/images.length);
        return Math.min(offsetX, 200);
    }

    function layoutPhotos(container) {
        const images = Array.from(container.querySelectorAll('img'));
        if (images.length === 0) return;
        const offsetX = getOffsetX(container, images);
        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            img.style.left = (offsetX * i) + 'px';

            const initialized = img.dataset.initialized;
            if (!initialized) {
                img.addEventListener('mouseenter', (e) => {
                    images.forEach(im => im.classList.remove('hovered'));
                    img.classList.add('hovered');
                });
                img.dataset.initialized = 'true';
            }
        }
    }

    document.querySelectorAll('.photo-stack').forEach(container => {
        layoutPhotos(container);
    })
}



loadCSS();
document.addEventListener('DOMContentLoaded', function () {
    initPhotoSwipe();
    initJustifiedGalleries();
    layoutPhotoStacks();
});
window.addEventListener('resize', layoutPhotoStacks);


