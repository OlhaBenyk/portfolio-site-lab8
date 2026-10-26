// Оголошення базового масиву об'єктів робіт портфоліо
const portfolioWorks = [
    {
        title: 'Студійний портрет «Warm Tones»',
        year: 2025,
        category: 'Фотографія',
        image: 'assets/img/project1.jpg',
        description: 'Мінімалістична студійна фотозйомка з фокусом на природність та теплу гаму кольорів.'
    },
    {
        title: 'Брендинг для локальної кав’ярні',
        year: 2026,
        category: 'Дизайн',
        image: 'assets/img/project2.jpg',
        description: 'Створення логотипа, кольорової палітри та друкованої продукції в мінімалістичному стилі.'
    },
    {
        title: 'Пейзажна зйомка «Полісся»',
        year: 2024,
        category: 'Фотографія',
        image: 'assets/img/project3.jpg',
        description: 'Дослідження природних ландшафтів та глибини кольорів української природи.'
    },
    {
        title: 'Ретро-серія чорно-білих фотографій',
        year: 2021,
        category: 'Фотографія',
        image: 'assets/img/project4.jpg',
        description: 'Серія аналогових знімків на плівку з виразною грою світла й тіней.'
    }
];

// Стрілкова функція перевірки свіжості роботи (не старіше 2 років)
const isRecent = year => (2026 - year) <= 2;

// Пошук DOM-елементів сторінки
const galleryContainer = document.querySelector('#gallery');
const counterElement = document.querySelector('#projects-count');
const addProjectForm = document.querySelector('#add-project-form');
const yearInput = document.querySelector('#project-year');
const categoryFilter = document.querySelector('#category-filter');

// Функція динамічного рендерингу карток робіт портфоліо в DOM
function renderPortfolio(works) {
    galleryContainer.innerHTML = '';

    works.forEach(work => {
        const card = document.createElement('article');
        card.classList.add('card');
        card.dataset.category = work.category; // збереження категорії для фільтрації

        if (isRecent(work.year)) {
            card.classList.add('recent');
        }

        const title = document.createElement('h3');
        title.textContent = work.title;

        const img = document.createElement('img');
        img.src = work.image;
        img.alt = `${work.title} - ${work.description}`;

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('card-content');

        const yearParagraph = document.createElement('p');
        yearParagraph.textContent = `Рік: ${work.year} | ${work.category}`;
        yearParagraph.style.fontWeight = '500';

        const descParagraph = document.createElement('p');
        descParagraph.textContent = work.description;

        contentDiv.append(yearParagraph, descParagraph);
        card.append(title, img, contentDiv);

        galleryContainer.append(card);
    });

    // Оновлення підсумкового лічильника робіт
    if (counterElement) {
        counterElement.textContent = `Усього робіт: ${works.length}`;
    }
}

// Початковий виклик рендерингу списку робіт
renderPortfolio(portfolioWorks);

// Клієнтська валідація поля року (подія input) через Constraint Validation API
yearInput.addEventListener('input', () => {
    const currentYear = 2026;
    const enteredYear = Number(yearInput.value);

    if (enteredYear > currentYear) {
        yearInput.setCustomValidity(`Рік не може бути в майбутньому (максимум ${currentYear})`);
    } else if (enteredYear < 2000 && enteredYear !== 0) {
        yearInput.setCustomValidity('Рік не може бути раніше 2000-го');
    } else {
        yearInput.setCustomValidity(''); // валідне значення
    }
    yearInput.reportValidity();
});

// Обробка сабміту форми без перезавантаження сторінки (подія submit)
addProjectForm.addEventListener('submit', event => {
    event.preventDefault();

    if (!addProjectForm.checkValidity()) {
        addProjectForm.reportValidity();
        return;
    }

    const title = document.querySelector('#project-title').value.trim();
    const year = Number(yearInput.value);
    const category = document.querySelector('#project-category').value;
    const description = document.querySelector('#project-desc').value.trim();
    const userImageUrl = document.querySelector('#project-image').value.trim();

    const placeholderImage = `https://placehold.co/600x400/222222/ffffff?text=${encodeURIComponent(category)}`;

    const newWork = {
        title,
        year,
        category,
        image: userImageUrl || placeholderImage,
        description
    };

    // Додавання нового об'єкта в масив і повторне перемалювання
    portfolioWorks.push(newWork);
    renderPortfolio(portfolioWorks);

    // Скидання значення фільтра та очищення полів форми
    categoryFilter.value = 'all';
    addProjectForm.reset();
});

// Друга подія варіанта: фільтрація елементів списку за категорією (подія change)
categoryFilter.addEventListener('change', () => {
    const selectedCategory = categoryFilter.value;
    const cards = galleryContainer.querySelectorAll('article.card');

    cards.forEach(card => {
        const isMatch = selectedCategory === 'all' || card.dataset.category === selectedCategory;
        card.classList.toggle('hidden', !isMatch);
    });
});
