# listUsers-APItests
SDET - QA Engineer API Testing Exercise

### Setup
Below is a step-by-step process of how to setup this repo on your local computer (assuming a base level knowledge of Git and Github).

1. Clone the repository to your local computer and checkout the main branch
2. open the Folder containing the repo, and run
	```
	npm i
	```
3. Now you should be able to run all tests using the following command: 
	```
	npm run test
	```
### NOTE:
The following tests should be the only ones to fail: 
    1) GET /users?page=wrongNum
    2) GET /users?per_page=-5
these are currently failing because of possible bugs. 