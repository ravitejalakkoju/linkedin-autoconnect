### LinkedIn AutoConnect - *Chrome Extension*

With the "LinkedIn AutoConnect" Chrome extension, you can easily search for people on LinkedIn who match your desired criteria, such as location, job title, or industry. Once you have found a list of relevant profiles, simply press the "Start Connecting" button in the extension to automatically send connection requests to those profiles.

The extension saves you time and effort by automating the process of connecting with other professionals on LinkedIn, allowing you to focus on other important tasks.

##### System Design

###### UseCase Diagram

![image](https://user-images.githubusercontent.com/48471743/221475456-370bac4e-815e-4271-8497-c3f09a2254ac.png)

###### Activity Diagram

![image](https://user-images.githubusercontent.com/48471743/221475522-a95033c8-b661-418b-bd0c-0ac8ec47d9ab.png)

###### Class Diagram

![image](https://user-images.githubusercontent.com/48471743/221899409-0d434943-3371-4f00-8a34-781e95397c89.png)

##### Step-by-step guide

- Open your terminal or command prompt.
- Navigate to the directory where you want to store the cloned repository.

```
git clone https://github.com/ravitejalakkoju/linkedin-autoconnect.git
```
- Go the url bar and paste the following

```
chromes://extensions
```
- In the top-right corner of the Extensions page, toggle on the "Developer mode" switch. Enable developer mode
- Click on the "Load unpacked" button in the top-left corner of the Extensions page.
- Navigate to the directory where you cloned the GitHub repository.
- Select the root directory of the repository (the one containing the manifest.json file).
- Click on "Select folder" to load the extension.

- Now go to [LinkedIn](https://www.linkedin.com/search/results/people/) and search for the profiles you want to connect with.
- Click the extension icon to open the popup.
- Click the "Start Connecting" button in the popup to initiate the connection process.
- The extension will continue to connect with each profile until all profiles have been processed or until you click the "Stop Connecting" button in the popup.
- The popup will display the number and percentage of completed connections.

###### Preview

![image](https://user-images.githubusercontent.com/48471743/221910817-bac619e6-dd67-4fab-9c78-764979d9d70f.png)

