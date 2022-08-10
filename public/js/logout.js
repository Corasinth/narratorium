// Handler for logout button
const logout = async () => {
    // Sends a logout request to server
    const response = await fetch('/api/users/logout', {
        method: 'POST',
    });

    // Redirects to homepage if successful
    if (response.ok) {
        document.location.replace('/');
    } else {
        // Otherwise, alerts the user
        alert('Failed to log out');
    }
};

// Event listener for logout button
document.querySelector('#logout').addEventListener('click', logout);
