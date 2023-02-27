import { getActiveTabURL } from '../scripts/utils.js';
import { RequestStatus, ActionButtonView } from './types.js';

let currentRequestStatus = RequestStatus.NONE,
    actionButtonElement = document.getElementById('js-button-action'),
    closeButtonElement = document.getElementById('js-btn-close'),
    circle = document.querySelector('circle'),
    completedConnectionsCount = 0,
    allowedConnections = 10, 
    loaderCircumference;

setDefaultView();

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
  await sendConnectionRequest()
  // while (completedConnectionsCount <= allowedConnections) {
  //   sendConnectionRequest()
  //   .then(data => setCountView(data));
  // }
  // completedLinkedInConnections();
}

async function sendConnectionRequest() {
  const tab = await getActiveTabURL();
  const response = await chrome.tabs.sendMessage(tab.id, { action: 'start-connecting', title: 'Start Connecting', message: 'LinkedIn Connection Requests Sent Successfully!' });
  console.log(response);
  // chrome.runtime.sendMessage({ action: 'startConnecting', title: 'Start Connecting', message: 'LinkedIn Connection Requests Sent Successfully!' });
  // return new Promise(resolve => {
  //   let data = chrome.runtime.sendMessage({ action: 'startConnecting', allowedConnections: allowedConnections });
  //   console.log(data);
  //   resolve(10);
  // });
}

function resumeLinkedInConnections() {
  startLinkedInConnections();
}

function stopLinkedInConnections() {
  // code here
  completedLinkedInConnections();
}

function completedLinkedInConnections() {
  const prevRequestStatus = currentRequestStatus;
  currentRequestStatus = RequestStatus.COMPLETED;
  toggleActionButtonView(prevRequestStatus);
  showSuccessNotification();
}

function calculatePercent() {
  return Math.round((completedConnectionsCount / allowedConnections ) * 100);
}

// View updates
function toggleActionButtonView(prevRequestStatus) {
  actionButtonElement.classList.remove(ActionButtonView[prevRequestStatus].className);
  actionButtonElement.classList.add(ActionButtonView[currentRequestStatus].className);
  actionButtonElement.textContent = ActionButtonView[currentRequestStatus ].name;
}

function setCountView() {
  document.getElementById('js-invitations-count').innerHTML = completedConnectionsCount;
  setProgressView();
}

function setProgressView(percent = calculatePercent()) {
  const offset = loaderCircumference - percent / 100 * loaderCircumference;
  circle.style.strokeDashoffset = offset;
}

function setLoaderView() {
  loaderCircumference = circle.r.baseVal.value * 2 * Math.PI;

  circle.style.strokeDasharray = `${loaderCircumference} ${loaderCircumference}`;
  circle.style.strokeDashoffset = `${loaderCircumference}`;
}

function showSuccessNotification() {
  chrome.runtime.sendMessage({ action: 'createNotification', title: 'Success', message: 'LinkedIn Connection Requests Sent Successfully!' });
}

function setDefaultView() {
  setLoaderView();
  setCountView();
}

// Event Listeners
actionButtonElement.addEventListener('click', manageLinkedInConnections);
closeButtonElement.addEventListener('click', () => window.close());