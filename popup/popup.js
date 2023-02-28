import { getActiveTabURL } from '../scripts/utils.js';
import { RequestStatus, ActionButtonView, EventAction } from './types.js';

let currentRequestStatus = RequestStatus.NONE,
    actionButtonElement = document.getElementById('js-button-action'),
    closeButtonElement = document.getElementById('js-btn-close'),
    circle = document.querySelector('circle'),
    allowedConnections;

setLoaderView();

const tab = await getActiveTabURL();
let port = chrome.tabs.connect(tab.id, {name: "connections"});
port.postMessage({ action: 'get-default-data' });

port.onMessage.addListener((response) => {
  if(response.message === 'default' || response.message === 'connected') {
    setCurrentRequestStatus(response.completedConnectionsCount);
    setCountView(response.completedConnectionsCount);
    setProgressView(response.percent);
    if(response.percent === 100) {
      actionButtonElement.classList.add('btn-disabled');
    }
  }
  else if(response.message === 'stopped') {
    actionButtonElement.classList.add('btn-disabled');
    setTimeout(() => {
      actionButtonElement.classList.remove('btn-disabled');
    }, response.pendingConnections * 250 + 250);
  }
  else if(response.message === 'completed')
    completedLinkedInConnections();
});

chrome.runtime.sendMessage({ action: 'get-sync-key', key: 'allowed-connections' }, response => {
  allowedConnections = response;
});

function manageLinkedInConnections() {
  const prevRequestStatus = currentRequestStatus;
  switch(prevRequestStatus) {
    case RequestStatus.NONE: 
      currentRequestStatus = RequestStatus.INPROGRESS;
      startLinkedInConnections();
      break;
    case RequestStatus.HALTED: 
      currentRequestStatus = RequestStatus.INPROGRESS;
      resumeLinkedInConnections();
      break;
    case RequestStatus.INPROGRESS:
      currentRequestStatus = RequestStatus.HALTED;
      stopLinkedInConnections();
      break;
    default: break;
  }
  toggleActionButtonView(prevRequestStatus);
}

async function startLinkedInConnections() {
  await port.postMessage({ action: 'start-connecting' });
}

async function resumeLinkedInConnections() {
  await port.postMessage({ action: 'resume-connecting' });
}

async function stopLinkedInConnections() {
  await port.postMessage({ action: 'stop-connecting' });
}

function completedLinkedInConnections() {
  const prevRequestStatus = currentRequestStatus;
  currentRequestStatus = RequestStatus.COMPLETED;
  toggleActionButtonView(prevRequestStatus);
  showSuccessNotification();
}

function setCurrentRequestStatus(completedConnectionsCount) {

}

// Views
function toggleActionButtonView(prevRequestStatus) {
  actionButtonElement.classList.remove(ActionButtonView[prevRequestStatus].className);
  actionButtonElement.classList.add(ActionButtonView[currentRequestStatus].className);
  actionButtonElement.textContent = ActionButtonView[currentRequestStatus ].name;
}

function setCountView(completedConnectionsCount) {
  document.getElementById('js-invitations-count').innerHTML = completedConnectionsCount;
  setProgressView(completedConnectionsCount);
}

function setProgressView(percent) {
  const loaderCircumference = getCircleCircumference();
  
  const offset = loaderCircumference - percent / 100 * loaderCircumference;
  circle.style.strokeDashoffset = offset;
}

function setLoaderView() {
  const loaderCircumference = getCircleCircumference();

  circle.style.strokeDasharray = `${loaderCircumference} ${loaderCircumference}`;
  circle.style.strokeDashoffset = `${loaderCircumference}`;
}

function getCircleCircumference() {
  return circle.r.baseVal.value * 2 * Math.PI;
}

function showSuccessNotification() {
  chrome.runtime.sendMessage({ action: 'create-notification', title: 'Success', message: 'LinkedIn Connection Requests Sent Successfully!' });
}

// Event Listeners
actionButtonElement.addEventListener('click', manageLinkedInConnections);
closeButtonElement.addEventListener('click', () => window.close());