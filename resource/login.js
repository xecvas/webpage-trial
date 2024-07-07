// add event listener to form submit
document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault(); // prevent form from submitting
  
    const Username = document.querySelector('#Username').value;
    const Password = document.querySelector('#Password').value;
  
    // check if Username and Password are correct
    if (Username === 'myusername' && Password === 'mypassword') {
      alert('Login successful!');
    } else {
      alert('Incorrect Username or Password.');
    }
  });