window.addEventListener("load",() => {
	for (let interface of Interfaces) {
		if (interface.status == "down") {
			for (let element of document.getElementsByClassName(`interface-${interface}`)) {
				element.setAttribute("disabled","true");
			}
		}
	}
});
