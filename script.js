document.addEventListener('DOMContentLoaded', () => {
  // --- Config ---
  const ALWAYS_CLICKABLE = true; // Buy button always enabled

  // --- Elements ---
  const userIdInput = document.getElementById("userId");
  const zoneIdInput = document.getElementById("zoneId");
  const buyBtn = document.getElementById("buyBtn");
  const selectedPackageText = document.getElementById("selectedPackage");
  const selectedAmountText = document.getElementById("selectedAmount");
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const contentContainer = document.getElementById("content-container");

  if (!userIdInput || !zoneIdInput || !buyBtn || !selectedPackageText || !selectedAmountText || !contentContainer) {
    console.error("Required DOM elements missing.");
    return;
  }

  // --- State ---
  let selectedPackage = null;
  let selectedAmount = null;
  let selectedPayment = null;

  // --- Helpers ---
  const getChecked = (name) => document.querySelector(`input[name="${name}"]:checked`);

  // Validate form and toggle Buy button
  function validateForm() {
    const isValid = !!(userIdInput.value.trim() && zoneIdInput.value.trim() && selectedPackage && selectedPayment);
    buyBtn.disabled = ALWAYS_CLICKABLE ? false : !isValid;
    buyBtn.classList.toggle('enabled', isValid);
  }

  // Bind dynamically loaded package inputs
  function bindPackageListeners() {
    document.querySelectorAll('input[name="package"]').forEach(pkg => {
      pkg.addEventListener('change', () => {
        selectedPackage = pkg.dataset.diamonds || pkg.value;
        selectedAmount = pkg.value;
        selectedPackageText.textContent = selectedPackage;
        selectedAmountText.textContent = selectedAmount;
        validateForm();
      });
    });
  }

  // Bind payment inputs
  document.querySelectorAll('input[name="payment"]').forEach(pay => {
    pay.addEventListener('change', () => {
      selectedPayment = pay.value;
      validateForm();
    });
  });

  // Input listeners
  [userIdInput, zoneIdInput].forEach(input => input.addEventListener('input', validateForm));

  // Toggle sidebar
  window.toggleMenu = function () {
    if (sidebar) sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('show');
  };

  // Buy button click
buyBtn.addEventListener('click', () => {
  const userId = userIdInput.value.trim();
  const zoneId = zoneIdInput.value.trim();
  const missingFields = [];

  // Check which fields are missing
  if (!userId) missingFields.push("User ID");
  if (!zoneId) missingFields.push("Zone ID");
  if (!selectedPackage) missingFields.push("Diamond Packs");

  // Show alert if anything is missing
  if (missingFields.length > 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Details',
      html: missingFields.map(f => `<p style="margin:5px 0; font-weight:600; font-size:18px;">${f}</p>`).join(''),
      confirmButtonColor: '#FF5700',
      width: '400px' // optional: wider alert
    });
    return;
  }

  // Show alert if payment not selected
  if (!selectedPayment) {
    Swal.fire({
      icon: 'info',
      title: 'Select Payment',
      text: 'Please select a payment method.',
      confirmButtonColor: '#FF5700'
    });
    return;
  }

  // Generate a unique Order ID for this purchase
  const orderId = `RYO-${Date.now()}-${Math.floor(Math.random() * 1000)}`; 
  // Example: RYU-1695212345678-482

  // All fields filled → send WhatsApp message
  const message = `Hello, I have placed an order!:\n\n🆔 Order ID: ${orderId}\n🎮 Game: Mobile Legends\n🆔 User ID: ${userId}\n🌍 Zone ID: ${zoneId}\n💎 Package: ${selectedPackage}\n💰 Amount: ₹${selectedAmount}\n💳 Payment: ${selectedPayment}`;

  const phoneNumber = "917005121396";
  window.location.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
});

  // --- Swiper init (optional) ---
  try {
    if (typeof Swiper === 'function') {
      new Swiper(".mySwiper", {
        loop: true,
        autoplay: { delay: 4000, disableOnInteraction: false },
        pagination: { el: ".swiper-pagination", clickable: true },
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
        effect: "slide",
        speed: 700
      });
    }
  } catch (err) { console.error("Error initializing Swiper:", err); }

  // --- Category loading ---
  const radios = document.querySelectorAll('input[name="category"]');

  function loadContent(file) {
    fetch(file)
      .then(res => res.text())
      .then(data => {
        contentContainer.innerHTML = data;
        bindPackageListeners(); // Bind package inputs after loading
      })
      .catch(() => { contentContainer.innerHTML = "<p>Error loading content.</p>"; });
  }

  // Load default
  loadContent("large.html");

  // Change category
  radios.forEach(radio => {
    radio.addEventListener("change", () => {
      loadContent(radio.value === "large" ? "large.html" : "small.html");
    });
  });

  // Initialize state
  selectedPayment = getChecked('payment')?.value || null;
  validateForm();
});

// Toggle Sidebar Menu
function toggleMenu() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  // Toggle open class
  sidebar.classList.toggle("open");
  overlay.classList.toggle("show");
}