(() => {
  const pricingSection = document.getElementById('pricingSection');
  const checkoutSection = document.getElementById('checkoutSection');
  const selectedPlanName = document.getElementById('selectedPlanName');
  const selectedPlanPrice = document.getElementById('selectedPlanPrice');

  const plans = {
    starter: { name: 'Starter', price: '$19 one-time' },
    professional: { name: 'Professional', price: '$59 one-time' },
    business: { name: 'Business', price: '$129 one-time' }
  };

  const params = new URLSearchParams(window.location.search);
  const planKey = params.get('plan');
  const isCheckoutRoute = window.location.pathname === '/checkout' || !!planKey;

  if (isCheckoutRoute && planKey && plans[planKey]) {
    pricingSection.classList.add('hidden');
    checkoutSection.classList.remove('hidden');
    selectedPlanName.textContent = plans[planKey].name;
    selectedPlanPrice.textContent = plans[planKey].price;
  }
})();
