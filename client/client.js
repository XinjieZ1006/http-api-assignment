const handleResponse = async (res) => {
    const pageContent = document.querySelector('#content');
    // get response text
    let resText = await res.text();
    // print response text to the console
    console.log(resText);
    let contentType = res.headers.get('Content-type');
    if (!contentType) {
        contentType = 'application/json'
    }
    if (contentType === 'application/json') {
        let parsedRes = JSON.parse(resText);
        pageContent.innerHTML = `Message: ${parsedRes.message}`;
    }
    else if (contentType === 'text/xml') {
        let parsedRes = new window.DOMParser().parseFromString(resText, 'text/xml');
        pageContent.innerHTML = `Message: ${parsedRes.querySelector('message').textContent}`;
    }
}

const sendFetch = async (url, type) => {
    const options = {
        method: 'GET',
        headers: { 'Accept': type }
    }
    try {
        let response = await fetch(url, options);
        handleResponse(response);
    }
    catch {
        console.log('oopsie there is an error');
    }
}

// set up buttons
const sendButton = document.querySelector("#send");
const page = document.querySelector("#page");
const type = document.querySelector("#type");

sendButton.onclick = () => { sendFetch(page.value, type.value) };