    const apiKey = '9b4e44fc';

    document.getElementById('searchInput').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchMovies();
        }
    });

    async function searchMovies() {
        const searchInput = document.getElementById('searchInput').value;

        if (searchInput.trim() !== '') {
            const loadingElement = document.getElementById('loading');
            loadingElement.style.display = 'block';

            try {
                const apiUrl = `http://www.omdbapi.com/?apikey=${apiKey}&s=${searchInput}`;

                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                if (data.Search) {
                    displayMovies(data.Search);
                } else {
                    alert('No movies found with the given title.');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                loadingElement.style.display = 'none';
            }
        } else {
            alert('Please enter a movie title.');
        }
    }

    async function displayMovies(movies) {
        const movieListContainer = document.getElementById('movieList');
        const currentMovies = Array.from(movieListContainer.children);

        const middleIndex = Math.floor(currentMovies.length / 2);

        const fetchPromises = movies.map(movie => {
            const detailUrl = `http://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`;
            return fetch(detailUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                });
        });

        const loadingElement = document.getElementById('loading');
        loadingElement.style.display = 'block';

        try {
            const details = await Promise.all(fetchPromises);
            movieListContainer.innerHTML = '';
            movies.forEach((movie, index) => {
                const detailData = details[index];

                const movieCard = document.createElement('div');
                movieCard.classList.add('movie-card');
                movieCard.innerHTML = `
                    <img src="${movie.Poster}" alt="${movie.Title}">
                    <h3>${movie.Title}</h3>
                    <p><strong>Year:</strong> ${movie.Year}</p>
                    <p><strong>Language:</strong> ${detailData.Language}</p>
                    <p><strong>Genre:</strong> ${detailData.Genre}</p>
                `;

                movieListContainer.appendChild(movieCard);
            });
        } catch (error) {
            console.error('Error fetching movie details:', error);
        } finally {
            loadingElement.style.display = 'none';
        }
    }
