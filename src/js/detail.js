// src/js/detail.js
import { productsData } from './data.js';

// ---- HÀM 1: TỰ ĐỘNG ĐỔ 20 SẢN PHẨM HOẶC LỌC DANH SÁCH DỰA THEO TRANG ----
const renderProductGridDynamically = () => {
    const path = window.location.pathname;
    // BẢO VỆ TRANG CHỦ: Nếu đang đứng ở trang chủ thì thoát ra luôn, giữ nguyên HTML tĩnh để không lỗi giao diện
    if (path === '/' || path.includes('index.html') || document.getElementById('grid-sale')) return;

    const gridContainer = document.querySelector(".product-grid");
    if (!gridContainer) return; 

    // MẢNG ĐỊNH DANH THỨ TỰ CHUẨN: Ép trang Products hiển thị đúng theo thứ tự 20 sản phẩm gốc ban đầu
    const originalOrderKeys = [
        "sofa-mochi", "armchair-olly", "giuong-comet", "giuong-blink", 
        "tu-ao-astro", "tu-don-astro", "tu-dau-giuong", "giuong-bond", 
        "nem-balance", "tu-astro-1m2", "tu-vline-v3", "tu-don-vline", 
        "tu-2-canh", "dalumd-living", "koster-dining", "vline-combo", 
        "tu-dau-giuong-scarlet", "combo-scarlet", "giuong-scarlet-1m6", "bo-ban-an-plank"
    ];

    // Chuyển đổi dữ liệu đối tượng sang mảng dựa theo đúng thứ tự mảng ép buộc ở trên
    let displayProducts = [];
    originalOrderKeys.forEach(key => {
        if (productsData[key]) {
            displayProducts.push({ id: key, ...productsData[key] });
        }
    });

    // Phân luồng lọc dữ liệu thông minh nếu là trang Khuyến mãi hoặc trang Chi tiết
    if (window.location.pathname.includes("promotions") || window.location.pathname.includes("khuyen-mai")) {
        displayProducts = displayProducts.filter(p => p.discount && p.discount !== "");
    } else if (window.location.pathname.includes("product-detail")) {
        const urlParams = new URLSearchParams(window.location.search);
        const currentId = urlParams.get('id');
        displayProducts = displayProducts.filter(p => p.id !== currentId).slice(0, 4);
    }

    // Bơm mã HTML vào lưới của trang Products
    gridContainer.innerHTML = displayProducts.map(prod => {
        let badgeHTML = prod.discount ? `<div class="discount-tag">${prod.discount}</div>` : "";
        if (!prod.discount && prod.tag) {
            badgeHTML = `<div class="discount-tag" style="background-color: #e67e22;">${prod.tag}</div>`;
        }

        let priceOverlayHTML = "";
        if (prod.id === "giuong-comet" || prod.id === "giuong-blink" || prod.id === "giuong-bond") {
            let finalPrice = "12.316.500đ";
            if (prod.id === "giuong-blink") finalPrice = "13.591.500đ";
            if (prod.id === "giuong-bond") finalPrice = "12.741.500đ";

            priceOverlayHTML = `
                <div class="price-overlay">
                    <div class="price-left">Chỉ còn<br><strong>${finalPrice}</strong></div>
                    <div>Nhập mã nhận ưu đãi<br><strong>TLU26BR15.TS</strong></div>
                </div>`;
        }

        return `
            <div class="product-card" data-id="${prod.id}" style="cursor: pointer;">
                <div class="product-image-wrapper">
                    <img src="${prod.mainImg}" alt="${prod.title}" class="js-grid-img">
                    ${badgeHTML}
                    ${priceOverlayHTML}
                </div>
                <div class="product-info">
                    <h3 class="product-title">${prod.title}</h3>
                    <div class="product-pricing">
                        <span class="new-price">${prod.currentPrice}</span>
                        ${prod.oldPrice ? `<span class="old-price">${prod.oldPrice}</span>` : ""}
                    </div>
                    <div class="product-meta">
                        <div class="stars"></div>
                        <span>Đã bán ${prod.soldCount || Math.floor(Math.random() * 15) + 5}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
};

// ---- HÀM 2: KẾT XUẤT NỘI DUNG CHI TIẾT SẢN PHẨM ĐỘNG ----
const renderProductDetail = () => {
    if (!window.location.pathname.includes("product-detail")) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const currentProduct = productsData[productId] || productsData["sofa-mochi"];

    document.title = `${currentProduct.title} - TLU Furniture`;
    
    const breadcrumbCurrent = document.querySelector(".breadcrumb .current");
    if (breadcrumbCurrent) breadcrumbCurrent.innerText = currentProduct.title;

    const mainSection = document.querySelector(".product-detail-section");
    if (mainSection) {
        const titleH1 = mainSection.querySelector(".product-info h1");
        const skuDiv = mainSection.querySelector(".product-sku");
        const discountBadge = mainSection.querySelector(".discount-badge");
        const currentPriceSpan = mainSection.querySelector(".current-price");
        const oldPriceSpan = mainSection.querySelector(".old-price");
        const mainImgNode = mainSection.querySelector(".gallery-main img");

        if (titleH1) titleH1.innerText = currentProduct.title;
        if (skuDiv) skuDiv.innerHTML = `<span>SKU:</span> ${currentProduct.sku || 'TLU-' + productId.toUpperCase()}`;
        if (discountBadge) discountBadge.innerText = currentProduct.discount || '';
        if (currentPriceSpan) currentPriceSpan.innerText = currentProduct.currentPrice;
        if (oldPriceSpan) oldPriceSpan.innerText = currentProduct.oldPrice || '';
        if (mainImgNode) mainImgNode.src = currentProduct.mainImg;

        const attributes = mainSection.querySelectorAll(".product-attribute");
        if(attributes.length >= 2) {
            const colorSpan = attributes[0].querySelector("span");
            if (colorSpan) colorSpan.innerText = currentProduct.colorName || "Tiêu chuẩn";
            attributes[1].innerHTML = `<strong>Kích thước:</strong> ${currentProduct.size || "1m8 x 2m"}`;
        }

        const attrList = mainSection.querySelector(".attr-list");
        if (attrList) {
            const materials = currentProduct.materials || ["Gỗ tràm tự nhiên kết hợp MDF chuẩn CARB-P2", "Vải bọc cao cấp"];
            attrList.innerHTML = materials.map(item => `<li>${item}</li>`).join("");
        }

        const thumbWrapper = mainSection.querySelector(".gallery-thumbnails");
        if (thumbWrapper) {
            const thumbs = currentProduct.thumbs || [currentProduct.mainImg];
            thumbWrapper.innerHTML = thumbs.map((img, index) => 
                `<img src="${img}" class="${index === 0 ? 'active' : ''}" alt="Thumb ${index + 1}">`
            ).join("");
        }
    }

    const tabSection = document.querySelector(".product-tabs-section");
    if (tabSection) {
        const descH3 = tabSection.querySelector(".tab-content h3");
        const descP = tabSection.querySelector(".tab-content p");
        const descImg = tabSection.querySelector(".tab-content img");

        if (descH3) descH3.innerText = currentProduct.descTitle || currentProduct.title;
        if (descP) descP.innerText = currentProduct.descText || "Sản phẩm nội thất tinh tế đạt chuẩn chất lượng xuất khẩu cao cấp.";
        if (descImg) descImg.src = currentProduct.descImg || currentProduct.mainImg;
    }
};

const initPage = () => {
    renderProductGridDynamically();
    renderProductDetail();
};

initPage();

window.addEventListener("popstate", () => {
    initPage();
});

document.addEventListener("click", (e) => {
    const productCard = e.target.closest(".product-card");
    if (productCard && productCard.hasAttribute("data-id")) {
        e.preventDefault();
        e.stopPropagation();
        const productId = productCard.getAttribute("data-id");
        const targetUrl = `/product-detail.html?id=${productId}`;
        
        if (window.location.pathname.includes("product-detail")) {
            window.history.pushState(null, "", targetUrl);
            initPage();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            window.location.href = targetUrl;
        }
    }
}, true);