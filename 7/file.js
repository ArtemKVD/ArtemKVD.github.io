document.addEventListener('DOMContentLoaded', function() {
    const galleryTrack = document.getElementById('galleryTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pagerText = document.getElementById('pagerText');
    
    let currentIndex = 0;
    let itemsPerPage = 3;
    const totalItems = 8;
    
    function updateItemsPerPage() {
        if (window.innerWidth <= 768) {
            itemsPerPage = 1;
        } else {
            itemsPerPage = 3;
        }
    }
    
    function getTotalPages() {
        return Math.ceil(totalItems / itemsPerPage);
    }
    
    function updatePager() {
        const totalPages = getTotalPages();
        const currentPage = currentIndex + 1;
        pagerText.textContent = `Страница ${currentPage} из ${totalPages}`;
    }
    
    function goToSlide(index) {
        const totalPages = getTotalPages();
        if (index < 0) {
            index = totalPages - 1;
        } else if (index >= totalPages) {
            index = 0;
        }
        
        currentIndex = index;
        
        const galleryItems = galleryTrack.querySelectorAll('.gallery-item');
        if (galleryItems.length === 0) {
            return;
        }
        
        const firstItem = galleryItems[0];
        const itemWidth = firstItem.offsetWidth;
        const gap = 20;
        const itemsToSkip = currentIndex * itemsPerPage;
        const gapsToSkip = itemsToSkip > 0 ? itemsToSkip - 1 : 0;
        const offset = -(itemsToSkip * itemWidth + gapsToSkip * gap);
        
        galleryTrack.style.transform = `translateX(${offset}px)`;
        updatePager();
    }
    
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    function handleResize() {
        const oldItemsPerPage = itemsPerPage;
        updateItemsPerPage();
        if (oldItemsPerPage !== itemsPerPage) {
            currentIndex = 0;
        }
        setTimeout(function() {
            goToSlide(currentIndex);
        }, 100);
    }
    
    window.addEventListener('resize', handleResize);
    
    function initGallery() {
        updateItemsPerPage();
        updatePager();
        setTimeout(function() {
            goToSlide(0);
        }, 100);
    }
    
    initGallery();
});
