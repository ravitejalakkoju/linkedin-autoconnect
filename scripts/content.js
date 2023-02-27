(() => {
	var completedConnectionsCount = 0, allowedConnections;
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if (request.action === 'start-connecting') {
			completedConnectionsCount++;
			sendResponse(completedConnectionsCount);	
		}
		else if (request.action === 'resume-connecting') {
			completedConnectionsCount++;
			sendResponse(completedConnectionsCount);	
		}
		else if (request.action === 'stop-connecting') {
			completedConnectionsCount;
			sendResponse(completedConnectionsCount);	
		}
	});
})();