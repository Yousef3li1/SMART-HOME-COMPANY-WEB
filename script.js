
function signUp() {
  var id = document.getElementById("id").value
  var name = document.getElementById("name").value;
  var password = document.getElementById("password").value;
  var email = document.getElementById("email").value;




  if (name && password && email && id) {
   
}
  alert('Signed in successfully!');
}
 


function login(){
  var name = document.getElementById("name").value;
  var password = document.getElementById("password").value;

  if (name && password) {
    alert('Logged in succssefully');
  }
  
}


function contact() {
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;

  if (name && email) {
    alert('Your message has been sent. We will respond ASAP');
  } else {
    alert('Please fill in the required fields.');
  }
}


function buy(){
  alert('You need to write your credit card information first')
  redirect("credit.html")
}
