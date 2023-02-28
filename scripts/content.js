(() => {
	let completedConnectionsCount = 0, allowedConnections;

	// chrome.runtime.sendMessage({ action: 'set-session-key', key: 'completed-connections-count', value: 0 }, response => {
	// 	completedConnectionsCount = response;
	// });

	chrome.runtime.sendMessage({ action: 'get-sync-key', key: 'allowed-connections' }, response => {
		allowedConnections = response;
	});

	chrome.runtime.onConnect.addListener(function(port) {
		if(port.name === 'connections') {
			port.onMessage.addListener(function(request) {
				if(request.action === 'get-default-data') {
					port.postMessage({completedConnectionsCount, percent: calculatePercent()});
				}
		      	else if (request.action === 'start-connecting') {
					const connectBtnList = Array.from(document.querySelectorAll('.search-results-container .entity-result__item .entity-result__actions button'))
											.filter(btn => !btn.ariaLabel?.includes('Withdraw'));

			      	connectBtnList.forEach((connectBtn, index) => {
			      		connectBtn.addEventListener('click', event => {
			      			setTimeout(() => {
			      				const sendNowNode = document.querySelector('#artdeco-modal-outlet [aria-label="Send now"]')
			      				if(sendNowNode) {
			      					sendNowNode.click();
			      				}
				      			completedConnectionsCount++;
								port.postMessage({completedConnectionsCount, percent: calculatePercent(connectBtnList.length)});
			      			}, 0);
			      		})
					});

					connectBtnList.forEach((connectBtn, index) => {
						setTimeout(() => {
							connectBtn.click();
						}, index * 500);
					});
				}
				else if (request.action === 'resume-connecting') {
					const connectBtnList = Array.from(document.querySelectorAll('.search-results-container .entity-result__item .entity-result__actions button'))
											.filter(btn => btn.ariaLabel.includes('Invite'));

					connectBtnList.forEach(connectBtn => {
						if(completedConnectionsCount < connectBtnList.length) {
							// connectBtn.click();
							console.log(document.querySelector('#artdeco-modal-outlet [aria-label="Send now"]'))
							completedConnectionsCount++;
						}
						port.postMessage({completedConnectionsCount, percent: calculatePercent(connectBtnList.length)});	
					});
				}
				else if (request.action === 'stop-connecting') {
					completedConnectionsCount;
					port.postMessage({completedConnectionsCount, percent: calculatePercent()});	
				}
		    });
		}


	});

	function connectToProfile(connectBtn) {
		console.log(completedConnectionsCount)
		return 
		new Promise(resolve => setTimeout(() => connectBtn.click(), 100))
		.then(() => document.querySelector('#artdeco-modal-outlet [aria-label="Send now"]').click())
		.then(() => completedConnectionsCount++)

	}

	function calculatePercent(totalConnections) {
	  return Math.round((completedConnectionsCount / (totalConnections || allowedConnections) ) * 100);
	}
})();