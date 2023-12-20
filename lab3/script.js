const fetchUserData = () => {
    fetch('https://randomuser.me/api/?results=5')
        .then(response => response.json())
        .then(data => {
            const userList = document.getElementById('user-list');
            userList.innerHTML = '';

            data.results.forEach(user => {
                const userCard = document.createElement('div');
                userCard.className = 'user-card';

                userCard.innerHTML = `
                    <img src="${user.picture.large}" alt="User Image">
                    <p>Cell: ${user.cell}</p>
                    <p>Country: ${user.location.country}</p>
                    <p>Email: ${user.email}</p>
                    <p>Phone: ${user.phone}</p>
                `;

                userList.appendChild(userCard);
            });
        })
        .catch(error => console.error('Error fetching user data:', error));
}