// function to check if password and password check is equal when user signs up
function check_pass() {
  console.log(document.getElementById("pass").value);
  if (
    document.getElementById("pass").value ==
    document.getElementById("passcheck").value
  ) {
    console.log("pass");
    document.getElementById("submit").disabled = false;
  } else {
    console.log("not pass");
    document.getElementById("submit").disabled = true;
  }
}
