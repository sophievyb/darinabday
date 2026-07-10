(() => {
  const state = {
    giftOpened: false,
  };

  const selectors = {
    story: ".paper-story",
    giftButton: "#giftButton",
    giftImage: "#giftImage",
    reveal: "#reveal",
    revealTitle: "#reveal-title",
    toGreeting: "#toGreeting",
    greeting: "#greeting",
    greetingTitle: "#greeting-title",
    toCertificate: "#toCertificate",
    certificate: "#certificate",
    certificateTitle: "#certificate-title",
    partyAgain: "#partyAgain",
  };

  const story = document.querySelector(selectors.story);
  const giftButton = document.querySelector(selectors.giftButton);
  const giftImage = document.querySelector(selectors.giftImage);
  const revealSection = document.querySelector(selectors.reveal);
  const toGreetingButton = document.querySelector(selectors.toGreeting);
  const greetingSection = document.querySelector(selectors.greeting);
  const toCertificateButton = document.querySelector(selectors.toCertificate);
  const certificateSection = document.querySelector(selectors.certificate);
  const partyAgainButton = document.querySelector(selectors.partyAgain);

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function revealSectionById(sectionId) {
    const section = document.getElementById(sectionId);

    if (!section) {
      return null;
    }

    section.hidden = false;
    requestAnimationFrame(() => {
      section.classList.add("is-visible");
    });

    return section;
  }

  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    section.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  }

  function focusSectionTitle(selector) {
    const title = document.querySelector(selector);

    if (title) {
      title.focus({ preventScroll: true });
    }
  }

  function showShip() {
    if (!revealSection) {
      return;
    }

    revealSection.classList.add("ship-visible");
  }

  function launchConfetti(originElement = null) {
    if (prefersReducedMotion()) {
      return;
    }

    const field = document.createElement("div");
    const colors = ["#174f9c", "#ef654a", "#f2c84b", "#4d9776"];
    const shapes = ["paper", "dot", "stroke"];
    const count = 42;
    const originRect = originElement?.getBoundingClientRect();
    const startX = originRect ? originRect.left + originRect.width / 2 : window.innerWidth / 2;
    const startY = originRect ? originRect.top + originRect.height / 2 : window.innerHeight / 2;

    field.className = "confetti-field";
    field.setAttribute("aria-hidden", "true");

    for (let index = 0; index < count; index += 1) {
      const piece = document.createElement("i");
      const shape = shapes[index % shapes.length];
      const color = colors[index % colors.length];
      const width = shape === "dot" ? 8 : 9 + Math.random() * 16;
      const height = shape === "stroke" ? 4 : 8 + Math.random() * 18;
      const direction = index % 2 === 0 ? 1 : -1;
      const tx = direction * (70 + Math.random() * 360);
      const ty = -120 - Math.random() * 320 + Math.random() * 160;
      const spin = direction * (160 + Math.random() * 620);

      piece.className = `confetti-piece ${shape}`;
      piece.style.setProperty("--start-x", `${startX}px`);
      piece.style.setProperty("--start-y", `${startY}px`);
      piece.style.setProperty("--w", `${width}px`);
      piece.style.setProperty("--h", `${height}px`);
      piece.style.setProperty("--c", color);
      piece.style.setProperty("--r", `${Math.random() > 0.55 ? 7 : 1}px`);
      piece.style.setProperty("--tx", `${tx}px`);
      piece.style.setProperty("--ty", `${ty}px`);
      piece.style.setProperty("--rot", `${Math.random() * 160 - 80}deg`);
      piece.style.setProperty("--spin", `${spin}deg`);
      piece.style.setProperty("--scale", `${0.75 + Math.random() * 0.65}`);
      piece.style.setProperty("--dur", `${1200 + Math.random() * 760}ms`);
      field.append(piece);
    }

    document.body.append(field);
    window.setTimeout(() => field.remove(), 2300);
  }

  function checkCertificatePdf() {
    const hasCertificatePdf = story?.dataset.hasCertificatePdf === "true";
    const pdfLinks = document.querySelectorAll(".pdf-only");

    pdfLinks.forEach((link) => {
      link.hidden = !hasCertificatePdf;
    });

    return hasCertificatePdf;
  }

  function openGift() {
    if (state.giftOpened || !giftButton || !giftImage) {
      return;
    }

    state.giftOpened = true;
    giftButton.classList.add("is-opening");
    giftButton.setAttribute("aria-expanded", "true");
    giftButton.disabled = true;
    launchConfetti(giftButton);

    window.setTimeout(() => {
      giftImage.src = "./openedgift.png";
      giftImage.alt = "Открытый рисованный подарок с конфетти";
      giftButton.classList.remove("is-opening");
      giftButton.classList.add("is-opened");
    }, prefersReducedMotion() ? 0 : 280);

    window.setTimeout(() => {
      revealSectionById("reveal");
      scrollToSection("reveal");
    }, prefersReducedMotion() ? 0 : 620);

    window.setTimeout(() => {
      showShip();
    }, prefersReducedMotion() ? 0 : 980);

    window.setTimeout(() => {
      focusSectionTitle(selectors.revealTitle);
    }, prefersReducedMotion() ? 80 : 2450);
  }

  function bindEvents() {
    giftButton?.addEventListener("click", openGift);
    giftButton?.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openGift();
      }
    });

    toGreetingButton?.addEventListener("click", () => {
      revealSectionById("greeting");
      scrollToSection("greeting");
      window.setTimeout(() => focusSectionTitle(selectors.greetingTitle), 560);
    });

    toCertificateButton?.addEventListener("click", () => {
      revealSectionById("certificate");
      scrollToSection("certificate");
      window.setTimeout(() => {
        focusSectionTitle(selectors.certificateTitle);
        launchConfetti(certificateSection);
      }, 560);
    });

    partyAgainButton?.addEventListener("click", () => {
      launchConfetti(certificateSection || partyAgainButton);
    });
  }

  checkCertificatePdf();
  bindEvents();

  window.openGift = openGift;
  window.showShip = showShip;
  window.launchConfetti = launchConfetti;
  window.scrollToSection = scrollToSection;
  window.checkCertificatePdf = checkCertificatePdf;
})();
