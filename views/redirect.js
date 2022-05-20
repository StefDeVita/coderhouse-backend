var timeout = 3000;
const redirect = () =>{
setTimeout(function () {
     window.location = "/";
  }, timeout);
}
document.onload = redirect();

