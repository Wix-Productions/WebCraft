const Random = (m=1,M=1) => Math.random() * (M - m) + m;

const Request = (url="",type="text",timeout=10000) => {
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

const Int = (n=0) => Math.round(n);
const Radian = (d=0) => d * Math.PI / 180;
const Degree = (r=0) => r / Math.PI * 180;

Number.isValid = (n=0) => typeof n === "number" && !Number.isNaN(n) && Number.isFinite(n);

const distanceBetween = (a=[],b=[]) => Math.sqrt(Math.pow((a[0] || 0) - (b[0] || 0),2) + Math.pow((a[1] || 0) - (b[1] || 0),2) + Math.pow((a[2] || 0) - (b[2] || 0),2));

const Script = (js="") => {
	const replacements = {
		"null": /((?:^|\W))(?:addEventListener|document|eval|(?:new\s+Function)|renderer|window|world|Block|DOM|Renderer|Request|Script|TextureLoader|Ticker|World)(?:(?!\w)|$)/g,

		"Texture": /((?:^|\W))T(?:(?!\w)|$)/g,
		"TextureLoader": /((?:^|\W))(?:Loader|L)(?:(?!\w)|$)/g,
		"world.resources": /((?:^|\W))Resources(?:(?!\w)|$)/g,

		"World.size": /((?:^|\W))WorldSize(?:(?!\w)|$)/g,
		"Chunk.size": /((?:^|\W))ChunkSize(?:(?!\w)|$)/g
	};

	js = String(js);

	for (let value in replacements) {
		js = js.replaceAll(replacements[value],"$1" + value);
	}

	console.log(js);

	return new Function(js);
};