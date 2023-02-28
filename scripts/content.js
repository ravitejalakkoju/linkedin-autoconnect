(() => {
	let completedConnectionsCount = 0, totalConnections = 10, isHalted = false, port = null;

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if(request.action === 'tab-updated') {
			completedConnectionsCount = 0;
		}
	})

	chrome.runtime.onConnect.addListener(function(connectionsPort) {
		if(connectionsPort.name === 'connections') {
			port = connectionsPort;
			port.onMessage.addListener(function(request) {
				if(request.action === 'get-default-data') {
					completedConnectionsCount = 10 - getConnectBtnList().length;
					port.postMessage({message: 'default', completedConnectionsCount, percent: calculatePercent()});
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
								port.postMessage({message: 'connected', completedConnectionsCount, totalConnections, percent: calculatePercent()});

								if(completedConnectionsCount === totalConnections) {
				      				port.postMessage({message: 'completed'});
				      			}
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

		    port.onDisconnect.addListener(() => {
			   port = null;
			});
		}

		function getConnectBtnList() {
			return Array.from(document.querySelectorAll('.search-results-container .entity-result__item .entity-result__actions button'))
											.filter(btn => !btn.classList.contains('artdeco-button--muted') && !btn.querySelector('.artdeco-button__text').innerHTML.includes('Message'));
		}

		function calculatePercent() {
		  return Math.round((completedConnectionsCount / totalConnections) * 100);
		}
	});
})();