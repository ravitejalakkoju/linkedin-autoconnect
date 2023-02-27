export async function getActiveTabURL() {
    const tabs = await chrome.tabs.query({
        currentWindow: true,
        active: true
    });
  
    return tabs[0];
}

export const EventAction = {
    StartConnecting: 'start-connecting',
    ResumeConnecting: 'resume-connecting',
    StopConnecting: 'stop-connecting',
    CreateNotification: 'create-notification'
}