window.$sbarOpen = document.querySelector('#sidebar-open');
window.$sbarClose = document.querySelector('#sidebar-close');
window.$sbar = document.querySelector('#sidebar');

$sbarOpen.addEventListener('click', (e) => {
	$sbar.classList.remove('hidden');
	$sbarClose.classList.remove('hidden');
	$sbarOpen.classList.add('hidden');
});

$sbarClose.addEventListener('click', (e) => {
	$sbar.classList.add('hidden');
	$sbarClose.classList.add('hidden');
	$sbarOpen.classList.remove('hidden');
});
