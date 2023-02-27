import { getActiveTabURL } from '../scripts/utils.js';
import { RequestStatus, ActionButtonView } from './types.js';

let currentRequestStatus = RequestStatus.NONE,
    actionButtonElement = document.getElementById('js-button-action'),
    closeButtonElement = document.getElementById('js-btn-close'),
    circle = document.querySelector('circle'),
    completedConnectionsCount = 0,
    allowedConnections = 10, 
    loaderCircumference;

const tab = await getActiveTabURL();

setDefaultView();

// var port = chrome.runtime.connect(null, {name: "connections"});
// port.onMessage.addListener((response) => {
//   console.log("Message received from content script: " + response);
// });
// port.postMessage({ action: 'start-connecting' });

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
  startConnectionRequest()
  .then(response => {
    completedConnectionsCount = response;
    setCountView()
    completedLinkedInConnections();
  });
}

async function startConnectionRequest() {
  return await chrome.tabs.sendMessage(tab.id, { action: 'start-connecting' });
  // await port.postMessage({ action: 'start-connecting' });
}

async function resumeLinkedInConnections() {
  resumeConnectionRequest()
  .then(response => {
    completedLinkedInConnections();
  });
}

async function resumeConnectionRequest() {
  return await chrome.tabs.sendMessage(tab.id, { action: 'resume-connecting' });
  // await port.postMessage({ action: 'resume-connecting' });
}

async function stopLinkedInConnections() {
  stopConnectionRequest()
  .then(response => {
    completedLinkedInConnections();
  });
}

async function stopConnectionRequest() {
  return await chrome.tabs.sendMessage(tab.id, { action: 'stop-connecting' });
  // await port.postMessage({ action: 'stop-connecting' });
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
  chrome.runtime.sendMessage({ action: 'create-notification', title: 'Success', message: 'LinkedIn Connection Requests Sent Successfully!' });
}

function setDefaultView() {
  setLoaderView();
  setCountView();
}

// Event Listeners
actionButtonElement.addEventListener('click', manageLinkedInConnections);
closeButtonElement.addEventListener('click', () => window.close());