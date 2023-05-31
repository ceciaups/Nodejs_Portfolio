window.onload = function() {
  // Variables
  const navBar = document.getElementById("nav-bar");
  const navToggle = document.getElementById("nav-toggle");
  const contactForm = document.getElementById("contact-form");
  const slider = document.getElementById("slider-ul");
  const sliderPlay = document.getElementById("slider-play");
  const sliderPause = document.getElementById("slider-pause");
  const sliderBack = document.getElementById("slider-back");
  const sliderFor = document.getElementById("slider-for");
  var mobile = window.matchMedia("(max-width: 425px)");
  var alertContainer = document.getElementById("alert-container");
  var alert = document.getElementById("alert");
  var play;
  var slideTime = 5000; // Change slides every 5 seconds

  // Event Listener
  navToggle.addEventListener("click", toggleMenu, false);
  sliderPlay.addEventListener("click", () => { play = playSlides(slideTime); });
  sliderPause.addEventListener("click", () => { stopSlides(); });
  sliderBack.addEventListener("click", () => { skipSlide(-1); });
  sliderFor.addEventListener("click", () => { skipSlide(1); });
  if (mobile.matches) {
    slider.addEventListener("click", () => { stopSlides(); })
  }
  else {
    slider.addEventListener("mouseover", () => { 
      if (play) {
        stopSlides();
        slider.addEventListener("mouseleave", () => { play = playSlides(slideTime); }, { once: true });
      }
     });
  }
  window.addEventListener("scroll", reveal);
  reveal();
  contactForm.onsubmit = function() {
    return sendMail();
  };
  
  // Toggle Function
  function toggleMenu() {
    navBar.classList.toggle("opened");
  }
  
  function playSlides(time) {
    sliderPlay.style.display = "none";
    sliderPause.style.display = "block";
    return setInterval(function() {
      var sliders = document.getElementsByClassName("slider-radio");
      for (var i = 0; i < sliders.length; i++) {
        if (sliders[i].checked) {
          sliders[i].checked = false;
          if (i < sliders.length - 1)
            sliders[i + 1].checked = true;
          else
            sliders[0].checked = true;
          break;
        }
      }
    }, time);
  }

  function stopSlides() {
    clearInterval(play);
    play = null;
    sliderPause.style.display = "none";
    sliderPlay.style.display = "block";
  }

  function skipSlide(number) {
    let sliders = document.getElementsByClassName("slider-radio");
    for (let i = 0; i < sliders.length; i++) {
      if (sliders[i].checked) {
        sliders[i].checked = false;
        let j = i + number;
        if (j < 0)
          j = sliders.length - 1;
        else if (j > sliders.length - 1)
          j = 0;
        sliders[j].checked = true;
        break;
      }
    }
    if (play) {
      stopSlides();
      play = playSlides(slideTime);
    }
  }

  // Contact Form Function
  function sendMail() {
    // Validate Form Data
    var nameValue = contactForm.fname;
    var emailValue = contactForm.femail;
    var messageValue = contactForm.fmessage;

    var nameCheck = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    var emailCheck = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!nameCheck.test(nameValue.value)) {
      nameValue.focus();
      return false;
    }
    else if (!emailCheck.test(emailValue.value)) {
      emailValue.focus();
      return false;
    }
    else if (messageValue.value == 0) {
      messageValue.focus();
      return false;
    }

    // Send email
    let mail = new FormData(contactForm);
    fetch("/send", {
      method: "post",
      body: mail,
    }).then((res) => {
      if(res.status === 200) {
        alert.innerHTML += 'Thank you for getting in touch!<br>Your message is successfully sent!<i id="alert-close" class="fa-solid fa-xmark"></i>';
        alert.style.backgroundColor = "var(--dark-green)";
        alertContainer.style.display = "grid";
        var alertClose = document.getElementById("alert-close");
        alertClose.addEventListener("click", function() {
          alertContainer.style.display = "none";
        }, { once: true });
      }
      else {
        alert.innerHTML += 'The message cannot be sent at the moment!<br>Please contact me via email: ceciaups@gmail.com<i id="alert-close" class="fa-solid fa-xmark"></i>';
        alert.style.backgroundColor = "var(--orange)";
        alertContainer.style.display = "grid";
        var alertClose = document.getElementById("alert-close");
        alertClose.addEventListener("click", function() {
          alertContainer.style.display = "none";
        }, { once: true });
      }
    });
    return false;
  }

  function reveal() {
    var reveals = document.getElementsByClassName("reveal");

    for (var i = 0; i < reveals.length; i++) {
      var elementTop = reveals[i].getBoundingClientRect().top;
      var elementBottom = reveals[i].getBoundingClientRect().bottom;
      var windowHeight = window.innerHeight;

      if (elementTop < windowHeight && elementBottom > 0) {
        if (!reveals[i].classList.contains("active")) {
          reveals[i].classList.add("active");
        }
      }
      else {
        reveals[i].classList.remove("active");
        if (reveals[i].id == "sec-projects") {
          stopSlides();
        }
      }
    }
  }
}