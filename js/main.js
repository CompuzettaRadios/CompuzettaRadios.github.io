// DESACTIVAR SERVICE WORKER - Agregar al inicio del archivo main.js
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister();
            console.log('✅ Service Worker desregistrado');
        }
    });
}

// Radio Player - CONFIGURACIÓN ACTUALIZADA PARA SONICPANEL (ICECAST)
const radioURL = 'https://radiostreaming.pro';
let audio = null;
let isPlaying = false;


const playBtn = document.getElementById('playBtn');
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');
const volumeSlider = document.getElementById('volumeSlider');
const header = document.getElementById('header');

// Mobile Menu
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('.nav-link');

menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
});

// Cerrar menú al hacer clic en un link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        
        // Marcar link activo
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Hero Slider con efecto zoom
const slides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;

function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
    
    // Reiniciar animación de zoom en la imagen activa
    const activeImg = slides[currentSlide].querySelector('img');
    activeImg.style.animation = 'none';
    
    // Forzar reflow para reiniciar la animación
    void activeImg.offsetWidth;
    
    activeImg.style.animation = 'zoomIn 15s linear forwards'; // ✅ CORRECTO
}

// Cambiar slide cada 15 segundos (duración del zoom)
setInterval(nextSlide, 15000); // ✅ 15 segundos = 15000ms

// Header Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Inicializar reproductor
function initAudio() {
    if (!audio) {
        audio = new Audio(radioURL);
        audio.volume = volumeSlider.value / 100;
    }
}

// Play/Pause
playBtn.addEventListener('click', () => {
    initAudio();
    
    if (!isPlaying) {
        audio.play().then(() => {
            isPlaying = true;
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
        }).catch(error => {
            console.error('Error al reproducir:', error);
            alert('No se pudo conectar con la radio. Por favor, intenta nuevamente.');
        });
    } else {
        audio.pause();
        isPlaying = false;
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    }
});

// Control de volumen
volumeSlider.addEventListener('input', (e) => {
    if (audio) {
        audio.volume = e.target.value / 100;
    }
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Carousel Programas
const carouselTrack = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const carouselSlides = document.querySelectorAll('.carousel-slide');
let currentCarouselIndex = 0;

function updateCarousel() {
    if (carouselSlides.length > 0) {
        const slideWidth = carouselSlides[0].offsetWidth;
        carouselTrack.style.transform = `translateX(-${currentCarouselIndex * slideWidth}px)`;
    }
}

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        if (currentCarouselIndex > 0) {
            currentCarouselIndex--;
            updateCarousel();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentCarouselIndex < carouselSlides.length - 1) {
            currentCarouselIndex++;
            updateCarousel();
        }
    });
}

// Actualizar carousel en resize
window.addEventListener('resize', updateCarousel);

// Auto-play carousel
setInterval(() => {
    if (carouselSlides.length > 0) {
        currentCarouselIndex = (currentCarouselIndex + 1) % carouselSlides.length;
        updateCarousel();
    }
}, 6000);

// Formulario de contacto

// Galería lightbox
const galleryItems = document.querySelectorAll('.gallery-item img');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="close-lightbox">&times;</span>
                <img src="${item.src}" alt="${item.alt}">
            </div>
        `;
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        `;
        
        const content = lightbox.querySelector('.lightbox-content');
        content.style.cssText = `
            position: relative;
            max-width: 90%;
            max-height: 90%;
        `;
        
        const img = lightbox.querySelector('img');
        img.style.cssText = `
            max-width: 100%;
            max-height: 90vh;
            border-radius: 10px;
        `;
        
        const closeBtn = lightbox.querySelector('.close-lightbox');
        closeBtn.style.cssText = `
            position: absolute;
            top: -40px;
            right: 0;
            font-size: 40px;
            color: white;
            cursor: pointer;
            background: none;
            border: none;
            transition: transform 0.3s ease;
        `;
        
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.transform = 'scale(1.2)';
        });
        
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.transform = 'scale(1)';
        });
        
        const closeLightbox = () => {
            lightbox.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                lightbox.remove();
                document.body.style.overflow = 'auto';
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        });
    });
});

// Animaciones CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);

console.log('🎵 Stereo Revelación Radio - Sitio web cargado correctamente 🎵');

// AGREGA ESTE CÓDIGO AL FINAL DE TU ARCHIVO main.js

// Blog Modal Data
const blogData = {
    blog1: {
        title: "Feliz 2do Aniversario",
        date: "febrero 14, 2023",
        image: "images/blog1.jpg",
        content: `
            <p><strong>FELIZ II ANIVERSARIO</strong></p>
            <p>Esta fecha muy especial recordamos con nostalgia los inicios de nuestra emisora Stereo Revelación Radio y nos damos cuenta de lo que Dios va haciendo día a día, tal y como dice Salmos 37:5</p>
            <p><em>«Encomienda a Jehová tu camino, Y confía en él; y él hará».</em></p>
            <p>Un día como hoy del año 2021 lanzamos nuestra señal al mundo entero a través del internet, luego de haber comenzado en el año 2020 grabando y enviando programas solo por WhatsApp. Nos encomendamos en las manos de Dios, le presentamos nuestro proyecto y confiamos plenamente en su voluntad.</p>
            <p>Hoy 14 de Febrero del 2023 queremos agradecer a nuestro Dios Maravilloso y a todos nuestros oyentes, amigos, familiares, hermanos en Cristo por todo su apoyo y respaldo a este Ministerio.</p>
            <p>Que Dios les bendiga y recompense su labor, por su tiempo para compartir prédicas, mensajes, palabras de aliento y cada una de sus oraciones que llegaron al trono celestial. Y fueron bendición para muchos oyentes que lo necesitaban y que hoy les agradecen.</p>
            <p>Queremos decirle que usted también es parte de esta familia de Stereo Revelación Radio y reciba muchos abrazos y bendiciones en este aniversario.</p>
            <p><em>«No nos cansemos, pues, de hacer bien; porque a su tiempo segaremos, si no desmayamos» Gálatas 6:9</em></p>
        `
    },
    blog2: {
        title: "Bendecido 2023",
        date: "enero 3, 2023",
        image: "images/blog2.jpg",
        content: `
            <p><strong>Querida Audiencia</strong></p>
            <p>Todos debemos saber que Dios es. Desde la ETERNIDAD hasta la ETERNIDAD.</p>
            <p>También Él, creó un espacio llamado tiempo, donde nosotros los seres humanos nacemos, crecemos y morimos. Este espacio de tiempo si tiene un principio y un final.</p>
            <p>Es dentro de este tiempo donde Dios nos ve, nos llama y escoge para cumplir sus PLANES Y PROPÓSITOS. (Isaías 49:1; Jeremías 1:5).</p>
            <p>Por tal razón no permitamos que nada, ni nadie detenga o desvíe el propósito al cual fuimos llamados.</p>
            <p><strong>Stereo revelación Radio.</strong></p>
            <p>Les desea un Feliz Año 2023 y que las bendiciones sean muchas por siempre.</p>
        `
    },
    blog3: {
        title: "Este 2026 - Acepta tu Llamado",
        date: "diciembre 22, 2025",
        image: "images/pedro.png",
        content: `
            <p>El apóstol Pedro, pescador de profesión, escuchó un día a Jesús decirle: "Sígueme". Sin dudarlo, dejó las redes y lo siguió. Día tras día fue testigo de maravillas: vio a Jesús sanar enfermos, resucitar muertos, caminar sobre el mar, alimentar multitudes y hablar con Elías y Moisés. Todo aquello afirmaba en Pedro una certeza profunda: estaba dispuesto a defender a Jesús incluso con su propia vida.</p>
            <p>Tan convencido estaba, que cuando los guardias llegaron para arrestar a Jesús, Pedro reaccionó con rapidez: sacó su espada e hirió a uno de ellos, cortándole la oreja. En su corazón, aquello era una demostración de lealtad y amor.</p>
            <p>Pero entonces Jesús lo confrontó con palabras que lo descolocaron: "Guarda tu espada". Pedro quedó confundido y temeroso. Él había demostrado su disposición a dar la vida por su Maestro, pero parecía que esa no era la manera que Jesús esperaba.</p>
            <p>En ese momento comenzó la zaranda de satanas. Los pensamientos lo asaltaron, el miedo lo dominó, y aquel hombre valiente terminó negando a Jesús tres veces, diciendo incluso con maldiciones: "No conozco a ese hombre". Cuando cantó el gallo y Pedro cruzó la mirada con Jesús, lloró amargamente, decepcionado de sí mismo.</p>
            
            <p><strong>¿Cuántas veces nos hemos sentido como Pedro?</strong><br>
            Con el deseo sincero de hacer lo mejor para Dios, poniendo todo nuestro empeño, pero escuchando en el fondo del alma un susurro: "Así no".<br>
            ¿Y cuántas veces los pensamientos nos zarandean, llevándonos a alejarnos, a dudar, a negar lo que antes afirmábamos con pasión?</p>
            
            <p>Pedro ya no volvió a ser el mismo impulsivo de antes. Olvidando todo lo vivido junto a Jesús, regresó a su antigua faena: la pesca. Dejó atrás incluso las vestiduras que antes lo cubrían. Parecía que todo había terminado.</p>
            
            <p>Sin embargo, el llamado no había sido cancelado. Quien lo llamó fue Jesús, y Él no abandona a los suyos. No permite que aquellos que lo conocieron, que caminaron con Él y disfrutaron de una comunión íntima, vivan atrapados en la culpa para siempre.</p>
            
            <p>Por eso Jesús se acercó a la orilla. No para reprocharle, ni para señalar su error, sino para prepararle un desayuno con pescado asado. Después de comer, le preguntó tres veces:<br>
            "Pedro, ¿me amas?"</p>
            
            <p>La respuesta era obvia. El corazón de Pedro seguía latiendo por Jesús: "Te amo" respondio.<br>
            Entonces Jesús restauró su llamado: "Apacienta, cuida mis ovejas y mis corderos". Le recordó quién era y para qué había sido llamado.</p>
            
            <p><strong>Amado lector</strong>, si has llegado hasta aquí, puedo pensar que tú también amas a Jesús con todo tu corazón.<br>
            ¿Él te llamó?<br>
            ¿Viviste momentos preciosos con Él y contemplaste su gloria?<br>
            ¿Deseaste hacer una enramada para que permaneciera contigo?</p>
            
            <p>Entonces no pienses que Él te va a rechazar o desechar. Llegó tu tiempo, Levantate, Tu llamado sigue en pie. Hay cosas por atar y desatar. hay como 120 esperándote en el aposento alto para ser llenos del Espíritu Santo. Los 3 mil que serán transformados por tu predicación están esperando oír tu voz. Los cojos a la puerta del templo extienden sus manos, no por oro ni plata, sino por un milagro. Los enfermos tendidos en las calles esperan que tu sombra les sane.</p>
            
            <p>No es con tu espada o con tu fuerza, Es a la manera de Dios, será su Santo Espíritu obrando a través de ti.</p>
            
            <p><strong>Este nuevo año 2026 es una oportunidad para volver a la orilla y aceptar tu llamado.</strong></p>
            
            <p><em>Bendecido 2026</em></p>
        `
    },

blog4: {
    title: "Sé parte de Stereo Revelación Radio",
    date: "diciembre 20, 2025",
    image: "images/apoyo3.png",
    content: `
        <p><strong>COLABORA</strong></p>

        <p>
            Esta plataforma cristiana de streaming existe con un solo propósito:
            <strong>llevar el mensaje de Jesucristo a más personas, sin barreras y con excelencia.</strong>
        </p>

        <p>
            Si esta plataforma ha sido de bendición para tu vida y deseas colaborar
            para que el mensaje siga llegando a más personas, puedes hacerlo de manera voluntaria.
        </p>

        <p>
            <a href="#contacto" class="btn-contacto">
                👉 Ir a la sección de Contacto
            </a>
        </p>
    `
},



  
};

// Blog Modal Functions
const modal = document.getElementById('blogModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalText = document.getElementById('modalText');
const closeModal = document.querySelector('.blog-modal-close');

// Abrir modal
document.querySelectorAll('.btn-read').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const blogId = btn.getAttribute('data-blog');
        const blog = blogData[blogId];
        
        if (blog) {
            modalImage.src = blog.image;
            modalImage.alt = blog.title;
            modalTitle.textContent = blog.title;
            modalDate.textContent = blog.date;
            modalText.innerHTML = blog.content;
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

// Cerrar modal con X
closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Cerrar modal al hacer clic fuera
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Cerrar modal con tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Botón Volver Arriba
// AGREGA ESTO al final de tu archivo main.js

const scrollToTopBtn = document.getElementById('scrollToTop');

// Mostrar/ocultar botón según scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});

// Scroll suave al hacer clic (ya tienes esto en tu código, pero por si acaso)
// Si ya tienes un scroll smooth para los anchors, este botón funcionará automáticamente

/* ======== POPUP AÑO NUEVO - ================ */ 
// Esperar a que TODO el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    const popupOverlay = document.getElementById('popupAnoNuevo');
    const closePopupBtn = document.getElementById('closePopup');

    // Verificar que el popup existe
    if (!popupOverlay) {
        console.log('Popup no encontrado');
        return;
    }

    // Verificar si el popup ya fue mostrado en esta sesión
    const popupMostrado = sessionStorage.getItem('popupAnoNuevoMostrado');

    // Si NO se ha mostrado, mostrarlo después de 1.5 segundos
    if (!popupMostrado) {
        setTimeout(function() {
            popupOverlay.style.display = 'flex';
            popupOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Bloquear scroll
            console.log('✅ Popup mostrado');
        }, 1500); // Espera 1.5 segundos
    }

    // Función para cerrar el popup
    function cerrarPopup() {
        popupOverlay.style.animation = 'popupFadeOut 0.3s ease';
        
        setTimeout(function() {
            popupOverlay.style.display = 'none';
            popupOverlay.classList.remove('active');
            document.body.style.overflow = 'auto'; // Restaurar scroll
            
            // Marcar que ya se mostró en esta sesión
            sessionStorage.setItem('popupAnoNuevoMostrado', 'true');
            console.log('✅ Popup cerrado');
        }, 300);
    }

    // Cerrar popup con botón X
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', cerrarPopup);
    }

    // Cerrar popup al hacer clic fuera del contenedor
    popupOverlay.addEventListener('click', function(e) {
        if (e.target === popupOverlay) {
            cerrarPopup();
        }
    });

    // Cerrar popup con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && popupOverlay.style.display === 'flex') {
            cerrarPopup();
        }
    });

});
