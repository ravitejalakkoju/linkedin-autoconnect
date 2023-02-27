(() => {
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if (request.action === 'start-connecting') {
			sendResponse(10);	
		}
	});
})();