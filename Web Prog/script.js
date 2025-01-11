hamburger.addEventListener('click', () => {
    // Check the current position of the sidebar
    if (sidebar.style.right === '0px') {
        sidebar.style.right = '-250px'; // Hide sidebar
    } else {
        sidebar.style.right = '0px'; // Show sidebar
    }
});

const homeSection = document.getElementById('home');

// Daftar gambar latar belakang
const backgrounds = [
    'images/home_bg_1.png', // Ganti dengan jalur gambar Anda
    'images/home_bg_2.jpg', // Ganti dengan jalur gambar Anda
    'images/home_bg_3.png'  // Ganti dengan jalur gambar Anda
];

let currentIndex = 0;

// Fungsi untuk mengubah gambar latar belakang
function changeBackground() {
    currentIndex = (currentIndex + 1) % backgrounds.length; // Menghitung indeks gambar berikutnya
    homeSection.style.backgroundImage = `url(${backgrounds[currentIndex]})`; // Mengubah gambar latar belakang
}

// Mengubah gambar latar belakang setiap 5 detik
setInterval(changeBackground, 5000);

// Set gambar latar belakang pertama saat halaman dimuat
homeSection.style.backgroundImage = `url(${backgrounds[currentIndex]})`;


document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.querySelector('#name').value;
        const message = document.querySelector('#message').value;
        const phone = '6285774537320'; // Replace with your phone number

        if (name && message) {
            const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(`Halo, nama saya ${name}. ${message}`)}`;
            window.open(whatsappUrl, '_blank');
        } else {
            alert('Harap isi semua kolom!');
        }
    });

    const scrollToTopBtn = document.getElementById('scrollToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

function filterCategory(category) {
    const products = document.querySelectorAll('.product');
    products.forEach(product => {
        if (category === 'all' || product.getAttribute('data-category') === category) {
            product.style.display = 'block'; // Menampilkan produk yang sesuai
        } else {
            product.style.display = 'none'; // Menyembunyikan produk yang tidak sesuai
        }
    });
}

function filterCategory(category) {
    const products = document.querySelectorAll('.product');
    const buttons = document.querySelectorAll('.radio-inputs .radio input'); // Memperbaiki selector

    // Menghapus kelas 'active' dari semua tombol
    buttons.forEach(button => {
        button.parentElement.classList.remove('active'); // Menghapus kelas 'active' dari label
    });

    // Menambahkan kelas 'active' pada tombol yang dipilih
    if (category === 'all') {
        buttons[0].parentElement.classList.add('active'); // Tombol "Semua"
    } else {
        buttons.forEach(button => {
            if (button.value === category) {
                button.parentElement.classList.add('active'); // Menambahkan kelas 'active' pada label yang sesuai
            }
        });
    }

    // Menampilkan atau menyembunyikan produk berdasarkan kategori
    products.forEach(product => {
        if (category === 'all' || product.getAttribute('data-category') === category) {
            product.style.display = 'block'; // Menampilkan produk yang sesuai
        } else {
            product.style.display = 'none'; // Menyembunyikan produk yang tidak sesuai
        }
    });
}


document.querySelectorAll('.product-image').forEach(image => {
    image.addEventListener('dblclick', function() {
        const enlargedImage = document.createElement('img');
        enlargedImage.src = this.src; // Mengambil sumber gambar yang diklik
        enlargedImage.classList.add('enlarged-image'); // Menambahkan kelas untuk gaya
        document.body.appendChild(enlargedImage); // Menambahkan gambar yang diperbesar ke body

        enlargedImage.addEventListener('click', function() {
            document.body.removeChild(enlargedImage); // Menghapus gambar yang diperbesar saat diklik
        });
    });
});

document.querySelectorAll('.product-image-featured').forEach(image => {
    image.addEventListener('dblclick', function() {
        const enlargedImage = document.createElement('img');
        enlargedImage.src = this.src; // Mengambil sumber gambar yang diklik
        enlargedImage.classList.add('enlarged-image'); // Menambahkan kelas untuk gaya
        document.body.appendChild(enlargedImage); // Menambahkan gambar yang diperbesar ke body

        enlargedImage.addEventListener('click', function() {
            document.body.removeChild(enlargedImage); // Menghapus gambar yang diperbesar saat diklik
        });
    });
});


const featuredProducts = document.querySelectorAll('.featured-product');
let currentIndex1 = 0;
let intervalId;

function startHighlighting() {
    intervalId = setInterval(() => {
        // Remove highlight from all products
        featuredProducts.forEach(product => product.classList.remove('highlight'));
        
        // Add highlight to the current product
        featuredProducts[currentIndex1].classList.add('highlight');
        
        // Move to the next product
        currentIndex1 = (currentIndex1 + 1) % featuredProducts.length;
    }, 1000); // Change every 1 second
}

// Start the highlighting effect
startHighlighting();

// Stop highlighting on hover
const featuredSection = document.getElementById('featured');
featuredSection.addEventListener('mouseover', () => {
    clearInterval(intervalId);
    featuredProducts.forEach(product => product.classList.remove('highlight'));
});

// Restart highlighting when not hovering
featuredSection.addEventListener('mouseout', () => {
    startHighlighting();
});


document.querySelectorAll('li a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const elementPosition = targetElement.offsetTop;
            const offsetPosition = elementPosition - headerHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
    });
});
