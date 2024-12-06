document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const content = document.getElementById('content');
    const sidebar = document.getElementById('sidebar');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const infoBar = document.getElementById('info-bar');

    const apiKeyOpenWeatherMap = 'f9a4fb26b3ee18311c267be6b7d3cc2e';
    const apiKeyRapidAPI = '8de5aca62amsh9fb4d62e2d3e80fp1b1513jsnbf91cd409d00';

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(link => link.classList.remove('active'));
            e.target.classList.add('active');
            loadCountries();
        });
    });
    
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.toLowerCase();
        searchCountry(query);
    });

    function loadCountries() {
        fetchCountries();
    }

    function searchCountry(query) {
        fetchCountries(query);
    }

    function fetchCountries(query = '') {
        fetch('https://restcountries.com/v3.1/all')
            .then(response => response.json())
            .then(data => {
                if (query) {
                    const filteredCountries = data.filter(country => country.name.common.toLowerCase().includes(query));
                    if (filteredCountries.length > 0) {
                        displayCountryInfo(filteredCountries[0]);
                    } else {
                        content.innerHTML = '<p>País no encontrado.</p>';
                    }
                } else {
                    displayCountries(data);
                }
            })
            .catch(error => console.error('Error fetching countries:', error));
    }

    function displayCountries(countries) {
        if (!sidebar) {
            console.error('El elemento "sidebar" no está definido.');
            return;
        }

        sidebar.innerHTML = `<h2>Países</h2>`;
        const list = document.createElement('ul');
        list.className = 'list-group';

        countries.forEach(country => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = country.name.common;
            listItem.addEventListener('click', () => displayCountryInfo(country));
            list.appendChild(listItem);
        });

        sidebar.appendChild(list);
    }

    function displayCountryInfo(country) {
        document.getElementById('continent').innerText = country.region;
        document.getElementById('country').innerText = country.name.common;
        document.getElementById('region').innerText = country.subregion || 'No disponible';
        document.getElementById('date').innerText = new Date().toLocaleDateString();

        fetchWeather(country.capital ? country.capital[0] : country.name.common);
    }

    function fetchWeather(city) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKeyOpenWeatherMap}&units=metric`)
            .then(response => response.json())
            .then(data => {
                if (data.main) {
                    document.getElementById('weather').innerText = `${data.main.temp}°C`;
                } else {
                    document.getElementById('weather').innerText = 'No disponible';
                }
            })
            .catch(error => console.error('Error fetching weather:', error));
    }
});
