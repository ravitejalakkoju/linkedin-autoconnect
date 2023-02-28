(() => {
	let completedConnectionsCount, allowedConnections;

	chrome.storage.session.set({ 'completed-connection-count': 0 }, () => {
		completedConnectionsCount = 0;
	});
	chrome.storage.sync.get('allowed-connections', result => {
	  allowedConnections = result['allowed-connections'];
	});

	chrome.runtime.onConnect.addListener(function(port) {
		if(port.name === 'connections') {
			port.onMessage.addListener(function(request) {
		      	if (request.action === 'start-connecting') {
			      	document.querySelectorAll('.search-results-container .entity-result__item .entity-result__actions button').forEach(btn => {
						// if(btn.ariaLabel.includes('Invite') && completedConnectionsCount <= allowedConnections){ 
						// 	btn.click();
						// 	setTimeout(() => {
						// 		document.querySelector('#artdeco-modal-outlet [aria-label="Send now"]')?.click();
						// 	}, 200);
						// 	completedConnectionsCount++;
						// }
						completedConnectionsCount++;
						port.postMessage(completedConnectionsCount);	
					});
				}
				else if (request.action === 'resume-connecting') {
					completedConnectionsCount++;
					port.postMessage(completedConnectionsCount);	
				}
				else if (request.action === 'stop-connecting') {
					completedConnectionsCount;
					port.postMessage(completedConnectionsCount);	
				}
		    });
		}
	});
})();