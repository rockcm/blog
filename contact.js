const contactTriggers = document.querySelectorAll("[data-contact-open]");

if (contactTriggers.length) {
  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <dialog class="contact-modal" id="contact-modal" aria-labelledby="contact-modal-title">
        <div class="contact-modal-shell">
          <div class="contact-modal-bar">
            <span><i aria-hidden="true"></i> NEW PROJECT / CONTACT</span>
            <button class="contact-modal-close" type="button" data-contact-close aria-label="Close contact form">&times;</button>
          </div>
          <div class="contact-modal-content">
            <div class="contact-modal-intro">
              <span class="section-kicker">LET&rsquo;S TALK</span>
              <h2 id="contact-modal-title">Tell me what you&rsquo;re trying to solve.</h2>
              <p>Share a few details and I&rsquo;ll get back to you directly.</p>
            </div>
            <form class="contact-form" id="contact-form" action="https://formspree.io/f/mvzewrek" method="POST">
              <input class="contact-form-trap" name="_gotcha" type="text" tabindex="-1" autocomplete="off" aria-hidden="true">
              <div class="contact-form-grid">
                <label>
                  <span>Your name</span>
                  <input name="name" type="text" autocomplete="name" placeholder="Jane Smith" required>
                </label>
                <label>
                  <span>Your email</span>
                  <input name="email" type="email" autocomplete="email" placeholder="jane@business.com" required>
                </label>
                <label>
                  <span>Business or organization <small>OPTIONAL</small></span>
                  <input name="organization" type="text" autocomplete="organization" placeholder="Company name">
                </label>
                <label>
                  <span>What can I help with?</span>
                  <select name="projectType" required>
                    <option value="" selected disabled>Select a project type</option>
                    <option>Custom application</option>
                    <option>Automation or integration</option>
                    <option>Website or digital presence</option>
                    <option>Platform or deployment system</option>
                    <option>Something else</option>
                  </select>
                </label>
                <label class="contact-form-wide">
                  <span>What problem are you trying to solve?</span>
                  <textarea name="details" rows="5" placeholder="Tell me what is slowing you down, what you want to improve, and what a successful result would look like." required></textarea>
                </label>
              </div>
              <div class="contact-form-actions">
                <button class="button primary" type="submit">Send inquiry <b aria-hidden="true">&rarr;</b></button>
                <button class="button secondary" type="button" data-copy-email>Copy email address</button>
              </div>
              <p class="contact-form-note">Your details are submitted through Formspree so I can respond to your inquiry.</p>
              <p class="contact-form-status" aria-live="polite"></p>
            </form>
            <div class="contact-form-success" hidden>
              <span class="contact-success-mark" aria-hidden="true">&check;</span>
              <span class="section-kicker">MESSAGE RECEIVED</span>
              <h3>Thanks, <span data-contact-name></span>.</h3>
              <p>Your inquiry is on its way. I&rsquo;ll review the details and respond to the email address you provided.</p>
              <button class="button secondary" type="button" data-contact-close>Close</button>
            </div>
          </div>
        </div>
      </dialog>
    `
  );

  const emailAddress = "rockcm@etsu.edu";
  const modal = document.getElementById("contact-modal");
  const form = document.getElementById("contact-form");
  const closeButtons = modal.querySelectorAll("[data-contact-close]");
  const copyButton = modal.querySelector("[data-copy-email]");
  const submitButton = form.querySelector('[type="submit"]');
  const status = modal.querySelector(".contact-form-status");
  const successPanel = modal.querySelector(".contact-form-success");
  const successName = modal.querySelector("[data-contact-name]");
  let activeSubject = "Project inquiry";
  let lastTrigger;

  function openModal(trigger) {
    lastTrigger = trigger;
    activeSubject = trigger.dataset.contactSubject || "Project inquiry";
    status.textContent = "";
    status.classList.remove("is-error");
    form.hidden = false;
    successPanel.hidden = true;
    document.body.classList.add("modal-open");

    if (typeof modal.showModal === "function") {
      modal.showModal();
    } else {
      modal.setAttribute("open", "");
    }
  }

  function closeModal() {
    if (typeof modal.close === "function") modal.close();
    else modal.removeAttribute("open");
    document.body.classList.remove("modal-open");
    lastTrigger?.focus();
  }

  contactTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openModal(trigger);
    });
  });

  if (new URLSearchParams(window.location.search).get("contact") === "open") {
    openModal(contactTriggers[0]);
  }

  closeButtons.forEach((button) => button.addEventListener("click", closeModal));
  modal.addEventListener("cancel", () => {
    document.body.classList.remove("modal-open");
  });
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get("name").trim();
    data.set("_subject", `${activeSubject} — ${name}`);
    data.set("source", "Christian.dev portfolio");

    submitButton.disabled = true;
    submitButton.textContent = "Sending…";
    status.textContent = "Sending your inquiry securely…";
    status.classList.remove("is-error");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          response.status === 429
            ? "Too many requests were received. Please wait a moment and try again."
            : result.errors?.map((error) => error.message).filter(Boolean).join(" ") ||
              "Your inquiry could not be sent. Please try again or copy the email address.";
        throw new Error(message);
      }

      successName.textContent = name;
      form.reset();
      form.hidden = true;
      successPanel.hidden = false;
      successPanel.querySelector("button").focus();
    } catch (error) {
      status.textContent =
        error instanceof TypeError
          ? "A network error prevented the message from sending. Please try again or copy the email address."
          : error.message;
      status.classList.add("is-error");
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Send inquiry <b aria-hidden="true">&rarr;</b>';
    }
  });

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      status.textContent = `${emailAddress} copied to your clipboard.`;
    } catch {
      const temporaryInput = document.createElement("textarea");
      temporaryInput.value = emailAddress;
      temporaryInput.setAttribute("readonly", "");
      temporaryInput.style.position = "fixed";
      temporaryInput.style.opacity = "0";
      document.body.appendChild(temporaryInput);
      temporaryInput.select();
      document.execCommand("copy");
      temporaryInput.remove();
      status.textContent = `${emailAddress} copied to your clipboard.`;
    }
  });
}
