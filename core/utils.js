const crash = (i,e,c) => document.body.innerHTML = `<crash><info>${i || "Oops"}</info><reason selectable>${e || "An unknow error occured"}</reason><a href="https://github.com/Wix-Productions/WebCraft/wiki/Error-Code%3A-${c || 0}" target="_blank">Error code: ${c || 0}</a></crash>`;

const decodeDataURL = (url) => {
	return new Promise((resolve,reject) => {
		const xhr = new XMLHttpRequest();

		xhr.open("GET",url,true);

		xhr.overrideMimeType("text/plain");

		xhr.onload = () => {
			resolve(xhr.response);
		};

		xhr.onerror = () => {
			reject(`Network error (${xhr.status})`);
		};

		xhr.ontimeout = () => {
			reject("Network error (timeout");
		};

		xhr.timeout = 1000;

		xhr.send();
	});
};
