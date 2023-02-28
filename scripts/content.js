(() => {
	let completedConnectionsCount = 0, allowedConnections, isHalted = false;

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
		      		const connectBtnList = getConnectBtnList();

			      	connectBtnList.forEach((connectBtn, index) => {
			      		connectBtn.addEventListener('click', event => {
			      			setTimeout(() => {
			      				const sendNowNode = document.querySelector('#artdeco-modal-outlet [aria-label="Send now"]')
			      				if(sendNowNode) {
			      					sendNowNode.click();
			      				}

				      			completedConnectionsCount++;
								port.postMessage({message: 'connected', completedConnectionsCount, percent: calculatePercent(connectBtnList.length)});
			      			}, 0);
			      		})
					});

					for (let i = 0; i < connectBtnList.length; i++) {
						const connectBtn = connectBtnList[i];

						setTimeout(() => {
							if(isHalted) return;
							connectBtn.click();
						}, i * 250);
					}
				}
				else if(request.action === 'resume-connecting') {
		      		isHalted = false;

		      		const connectBtnList = getConnectBtnList();

					for (let i = 0; i < connectBtnList.length; i++) {
						const connectBtn = connectBtnList[i];

						setTimeout(() => {
							if(isHalted) return;
							connectBtn.click();
						}, i * 250);
					}
				}
				else if (request.action === 'stop-connecting') {
					isHalted = true;
					port.postMessage({message: 'stopped', pendingConnections: getConnectBtnList().length});	
				}
		    });
		}

		function getConnectBtnList() {
			return Array.from(document.querySelectorAll('.search-results-container .entity-result__item .entity-result__actions button'))
											.filter(btn => !btn.ariaLabel?.includes('Withdraw'));
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