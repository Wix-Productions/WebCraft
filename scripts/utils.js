const Int = (n=0) => Math.round(n);

const Load = (url="",type="text",timeout=10000) => {
	return new Promise((resolve,reject) => {
		const xhr = new XMLHttpRequest();

		xhr.open("GET",url,true);
		xhr.responseType = type;

		xhr.onload = () => {
			if (xhr.status === 200) {
				resolve(xhr.response);
			} else {
				reject(`${xhr.statusText} (${xhr.status})`);
			}
		};

		xhr.onerror = () => {
			reject(`Network error (${xhr.status})`);
		};
		
		xhr.ontimeout = () => {
			reject("Network error (timeout");
		};

		xhr.timeout = timeout;

		xhr.send();
	});
};

const Radian = (d=0) => (d % 360) * Math.PI / 180;
const Random = (m=1,M=1) => Math.random() * (M - m) + m;
const Script = (txt="") => {
	console.info(`Executed: ${txt}`);

	return new Function(txt)();
};

const wait = (time=0) => {
	return new Promise((resolve) => {
		if (time < 1000 / 60) {
			requestAnimationFrame(resolve);
		} else {
			setTimeout(() => requestAnimationFrame(resolve),time);
		}
	});
}