const crash = (i,e) => {
	let error = null;

	if (e instanceof Error) {
		error = `${e.name || "Error"}: ${e.message || "Unknow error"} - ${e.cause || ""} (${e.lineNumber || 0}:${e.columnNumber || 0})<br />${(e.stack || "No stack").split("\n","<br />")}`
	}
	
	document.body.innerHTML = `<crash><info>${i || "Oops"}</info><reason selectable>${error || e || "An unknow error occured"}</reason></crash>`;

	window.render = false;
	window.renderingLocked = true;
};

const request = (url,type,timeout,func) => {
	return new Promise((resolve,reject) => {
		const xhr = new XMLHttpRequest();

		xhr.open("GET",url,true);
		xhr.responseType = type || "text";

		xhr.onload = () => {
			resolve(xhr.response);
		};

		xhr.onerror = () => {
			reject(`Network error (${xhr.status})`);
		};
		
		xhr.onprogress = (e) => (func || new Function())(e);

		xhr.ontimeout = () => {
			reject("Network error (timeout");
		};

		xhr.timeout = timeout || 10000;

		xhr.send();
	});
};

const Random = (m=0,M=1) => Math.random() * (M - m) + m;
const IntRandom = (m,M) => Math.round(Random(m,M));

const wait = (time) => {
	return new Promise((resolve) => {
		if (time) {
			requestAnimationFrame(() => {
				setTimeout(resolve,time);
			});
		} else {
			requestAnimationFrame(resolve);
		}
	});;
};
