document.addEventListener("DOMContentLoaded", function () {
    console.log('Website is geladen');

    person.age = calculateAge(person.dateOfBirth);
    setHobbies();
    writeHobbies(person.hobbies);

    const yearElement = document.getElementById('year');
    if (yearElement) yearElement.innerText = new Date().getFullYear();

    checkLastVisit();

    const welcomeElement = document.getElementById('welcomejs');
    if (welcomeElement) welcomeElement.innerText = 'Welcome,';

    window.addEventListener('scroll', doScrollFunctions);
    initSoftSkillsAnimation();
    validateForm();
});

function validateForm() {
    const form = document.getElementById('contact-form');
    const result = document.getElementById('result');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (['name', 'email', 'message'].some(hasElementError)) {
            result.innerHTML = "error message";
            result.className = "form-error";
            return;
        }

        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);
        result.innerHTML = "Please wait..."

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    result.innerHTML = "Form submitted successfully";
                    const name = document.getElementById('name').value;

                    result.innerText = `Dear ${name}, your message has been submitted`;
                    result.className = "success-message";
                
                } else {
                    console.log(response);
                    result.innerHTML = json.message;
                }
            })
            .catch(error => {
                console.log(error);
                result.innerHTML = "Something went wrong!";
            })
            .then(function () {
                form.reset();
                setTimeout(() => {
                    result.style.display = "none";
                }, 3000);
            });
    });
}

let person = {
    name: 'Dani',
    dateOfBirth: new Date(1998, 5, 24),
    hasWork: true,
};

function calculateAge(dateOfBirth) {
    const currentDate = new Date();
    let age = currentDate.getFullYear() - dateOfBirth.getFullYear();
    if (
        currentDate.getMonth() < dateOfBirth.getMonth() ||
        (currentDate.getMonth() === dateOfBirth.getMonth() && currentDate.getDate() < dateOfBirth.getDate())
    ) {
        age--;
    }
    return age;
}

function setHobbies() {
    person.hobbies = ['Fitness', 'Daytraden', 'Gamen', 'Cooking', 'Reading'];
}

function writeHobbies(hobbies) {
    if (!hobbies) {
        console.log('Geen hobbies gevonden');
        return;
    }
    hobbies.forEach((hobby, index) => {
        console.log(`Hobby number ${index + 1} = ${hobby}`);
    });
}

function checkLastVisit() {
    const lastVisit = getLocalStorage('last-visit');
    if (lastVisit) {
        const lastVisitElement = document.getElementById('last-visit');
        if (lastVisitElement) lastVisitElement.innerText = 'Laatste bezoek: ' + lastVisit;
    }
    setLocalStorage('last-visit', new Date().toLocaleString('nl-NL', {
        day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'
    }));
}

function setLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

function getLocalStorage(key) {
    return localStorage.getItem(key);
}

function hasElementError(elementId) {
    const element = document.getElementById(elementId)?.value;
    if (!element || element.length < 2) {
        showElement('form-error');
        hideElement('success-message');
        return true;
    }
    return false;
}

function showElement(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'block';
}

function hideElement(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
}

function doScrollFunctions() {
    showElements();
    hideAfterScroll();
}

function showElements() {
    document.querySelectorAll('.hide-animation').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
            el.classList.add('fade-and-slide-in');
        }
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function hideAfterScroll() {
    toggleClassByScroll('header', 'navigation-color', 140);
    toggleClassByScroll('last-visit', 'last-visit-color', 10);
    toggleClassByScroll('scroll-to-top', 'scroll-to-top-show', 100);
}

function toggleClassByScroll(elementId, className, scrollY) {
    const el = document.getElementById(elementId);
    if (el) {
        if (window.scrollY > scrollY) {
            el.classList.add(className);
        } else {
            el.classList.remove(className);
        }
    }
}

function initSoftSkillsAnimation() {
    const softSkillsSection = document.getElementById("soft-skills");
    const listItems = document.querySelectorAll(".soft-skills ul li");

    if (!softSkillsSection || listItems.length === 0) return;

    let hasAnimated = false;

    function handleScroll() {
        const sectionTop = softSkillsSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (!hasAnimated && sectionTop < windowHeight * 0.5) {
            listItems.forEach((item, index) => {
                setTimeout(() => item.classList.add("visible"), index * 500);
            });
            hasAnimated = true;
            window.removeEventListener("scroll", handleScroll);
        }
    }

    window.addEventListener("scroll", handleScroll);
}
