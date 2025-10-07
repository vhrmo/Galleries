import PhotoSwipeLightbox from './photoswipe/photoswipe-lightbox.esm.js';
import PhotoSwipe from './photoswipe/photoswipe.esm.js';

let zIndex = 100;

function loadCSS() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = '../res/photoswipe/photoswipe.css';
    document.head.appendChild(link);
}

/**
 * Returns the image elements (img or div) that are direct children of the container
 */
function getImageElements(container) {
    let images = Array.from(container.querySelectorAll(':scope > img'));
    if (images.length === 0) images = Array.from(container.querySelectorAll(':scope > div'));
    return images;
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

    /********************************************************************************
     * Highlight current photo in the photo stack when slide changes in PhotoSwipe
     ********************************************************************************/
    // Keep track of current gallery
    let currentGallery = null;

    // When a gallery item is opened
    lightbox.on('itemData', (e) => {
        // e.itemData.element is the <a> tag that was clicked
        const linkEl = e.itemData.element;
        currentGallery = linkEl.closest('.photoswipe'); // find its parent gallery
    });

    // When slide changes
    lightbox.on('change', () => {
        const pswp = lightbox.pswp;
        const currSlide = pswp.currSlide;
        const currIndex = currSlide.index;

        if (currentGallery) {
            // Highlight or update thumbnails in that gallery only
            const images = getImageElements(currentGallery);
            if (images.length === 0) return;

            images.forEach((thumb, i) => {
                if (i === currIndex) {
                    thumb.style.zIndex = zIndex++;
                    thumb.classList.add('hovered');
                } else {
                    thumb.classList.remove('hovered');
                }
            });
        }
    });
    /********************************************************************************
     * End of photo stack related code
     ********************************************************************************/


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

function initJustifiedThumbnailGalleries() {
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
        const images = getImageElements(container);
        if (images.length === 0) return;
        const offsetX = getOffsetX(container, images);
        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            img.style.left = (offsetX * i) + 'px';

            const initialized = img.dataset.initialized;
            if (!initialized) {
                img.addEventListener('mouseenter', () => {
                    images.forEach(im => im.classList.remove('hovered'));
                    img.classList.add('hovered');
                    img.style.zIndex = zIndex++;
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
    initJustifiedThumbnailGalleries();
    layoutPhotoStacks();
});
window.addEventListener('resize', layoutPhotoStacks);


