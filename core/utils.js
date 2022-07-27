const crash = (i,e,c) => {
	let error = null;

	if (e instanceof Error) {
		error = `${e.name || "Error"}: ${e.message || "Unknow error"} - ${e.cause || ""} (${e.lineNumber || 0}:${e.columnNumber || 0})<br />${(e.stack || "No stack").split("\n","<br />")}`
	}

	document.body.innerHTML = `<crash><info>${i || "Oops"}</info><reason selectable>${error || e || "An unknow error occured"}</reason><a href="https://github.com/Wix-Productions/WebCraft/wiki/Error-Code%3A-${c || 0}" target="_blank">Error code: ${c || 0}</a></crash>`;
};

const request = (url,type,timeout) => {
	return new Promise((resolve,reject) => {
		const xhr = new XMLHttpRequest();

		xhr.open("GET",url,true);

		if (type) {
			xhr.overrideMimeType(type);
		}

		xhr.onload = () => {
			resolve(xhr.response);
		};

		xhr.onerror = () => {
			reject(`Network error (${xhr.status})`);
		};

		xhr.ontimeout = () => {
			reject("Network error (timeout");
		};

		xhr.timeout = timeout || 10000;

		xhr.send();
	});
};

const decodeDataURL = (url) => request(url,"text/plain",1000);

const R = (m=0,M=1) => Math.random() * (M - m) + m;
const IR = (m,M) => Math.round(R(m,M));
